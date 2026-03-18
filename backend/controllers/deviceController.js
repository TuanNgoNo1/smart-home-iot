const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// In-memory map: requestId → { resolve, timer }
// Dùng để chờ ACK từ hardware
const pendingRequests = new Map();

/**
 * GET /api/devices
 * Danh sách devices + device_state (cho F5 reload + Dropdown filter)
 */
const getDevices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, topic, device_state, created_at FROM devices ORDER BY created_at');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/devices/control
 * Body: { deviceId, action }
 * Luồng: INSERT action_history (WAITING) → MQTT publish → chờ ACK 10s
 */
const controlDevice = async (req, res) => {
  const { deviceId, action } = req.body;

  if (!deviceId || !action) {
    return res.status(400).json({ error: 'deviceId and action are required' });
  }

  if (!['ON', 'OFF'].includes(action.toUpperCase())) {
    return res.status(400).json({ error: 'action must be ON or OFF' });
  }

  const requestId = uuidv4();
  const now = new Date();

  try {
    // Step 1: INSERT action_history (status=WAITING)
    await db.query(
      'INSERT INTO action_history (request_id, device_id, action, status, created_at) VALUES (?, ?, ?, ?, ?)',
      [requestId, deviceId, action.toUpperCase(), 'WAITING', now]
    );

    // Step 2: Publish MQTT (sẽ được gọi từ bên ngoài qua mqttPublish)
    const mqttHandler = require('../mqtt/mqttHandler');
    mqttHandler.publishDeviceCommand(requestId, deviceId, action.toUpperCase());

    // Step 3: Chờ ACK tối đa 10 giây
    const ackResult = await waitForACK(requestId, 10000);

    if (ackResult.success) {
      // SUCCESS: update action_history + device_state
      await db.query(
        'UPDATE action_history SET status = ? WHERE request_id = ?',
        ['SUCCESS', requestId]
      );
      await db.query(
        'UPDATE devices SET device_state = ? WHERE id = ?',
        [action.toUpperCase(), deviceId]
      );

      // Broadcast device state change via WebSocket
      const wsHandler = require('../websocket/wsHandler');
      wsHandler.broadcast({
        type: 'device_update',
        data: { deviceId, device_state: action.toUpperCase(), requestId, status: 'SUCCESS' }
      });

      return res.json({
        request_id: requestId,
        request_status: 'SUCCESS',
        device_state: action.toUpperCase(),
      });
    } else if (ackResult.result === 'FAILED') {
      // FAILED: update action_history only (do NOT update device_state)
      await db.query(
        'UPDATE action_history SET status = ? WHERE request_id = ?',
        ['FAILED', requestId]
      );

      const wsHandler = require('../websocket/wsHandler');
      wsHandler.broadcast({
        type: 'device_update',
        data: { deviceId, requestId, status: 'FAILED' }
      });

      return res.json({
        request_id: requestId,
        request_status: 'FAILED',
      });
    }
  } catch (error) {
    // TIMEOUT case
    if (error.message === 'TIMEOUT') {
      await db.query(
        'UPDATE action_history SET status = ? WHERE request_id = ?',
        ['TIMEOUT', requestId]
      );

      const wsHandler = require('../websocket/wsHandler');
      wsHandler.broadcast({
        type: 'device_update',
        data: { deviceId, requestId, status: 'TIMEOUT' }
      });

      return res.status(504).json({
        request_id: requestId,
        request_status: 'TIMEOUT',
        message: 'Không nhận được phản hồi từ thiết bị trong 10 giây',
      });
    }

    console.error('Error controlling device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Chờ ACK từ hardware qua MQTT
 * Returns: { success: true/false, result: 'SUCCESS'/'FAILED' }
 * Throws: Error('TIMEOUT') nếu quá thời gian
 */
function waitForACK(requestId, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error('TIMEOUT'));
    }, timeoutMs);

    pendingRequests.set(requestId, {
      resolve: (result) => {
        clearTimeout(timer);
        pendingRequests.delete(requestId);
        resolve(result);
      },
      timer,
    });
  });
}

/**
 * Được gọi bởi MQTT handler khi nhận ACK
 */
function handleACK(requestId, result) {
  const pending = pendingRequests.get(requestId);
  if (pending) {
    pending.resolve({
      success: result === 'SUCCESS',
      result: result,
    });
  }
}

module.exports = {
  getDevices,
  controlDevice,
  handleACK,
};
