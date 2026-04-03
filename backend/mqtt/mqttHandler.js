const mqtt = require('mqtt');
const db = require('../database/db');
const wsHandler = require('../websocket/wsHandler');
require('dotenv').config();

let client = null;

// Ngưỡng cảnh báo (FR-DASH-07)
const THRESHOLDS = {
  dht_temp: { max: 40, unit: '°C', name: 'Nhiệt độ' },
  dht_hum: { max: 90, unit: '%', name: 'Độ ẩm' },
  light: { max: 2000, unit: 'lux', name: 'Ánh sáng' },
};

// AUTO mode threshold
const AUTO_LIGHT_THRESHOLD = 500; // lux

// LED is always in AUTO mode
const deviceModes = {
  led_01: 'auto', // Always auto for LED
};

// Track last sensor data time to detect hardware reconnect
let lastSensorDataTime = null;
const RECONNECT_THRESHOLD = 10000; // 10 seconds - if no data for 10s, consider it disconnected

/**
 * Sync device states to hardware after reconnect
 */
async function syncDeviceStates() {
  try {
    console.log('🔄 Syncing device states to hardware...');
    const [devices] = await db.query('SELECT id, device_state FROM devices');

    for (const device of devices) {
      const action = device.device_state; // 'ON' or 'OFF'
      const requestId = `sync_${Date.now()}_${device.id}`;

      console.log(`  → Syncing ${device.id}: ${action}`);
      publishDeviceCommand(requestId, device.id, action);

      // Small delay between commands to avoid overwhelming hardware
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Device state sync completed');
  } catch (error) {
    console.error('❌ Error syncing device states:', error.message);
  }
}

/**
 * Kết nối MQTT Broker
 */
function connect() {
  const mqttUrl = `mqtt://${process.env.MQTT_HOST || 'localhost'}:${process.env.MQTT_PORT || 1884}`;
  
  client = mqtt.connect(mqttUrl, {
    username: process.env.MQTT_USERNAME || 'NgoDucAnhTuan',
    password: process.env.MQTT_PASSWORD || 'iot2026',
    clientId: `backend_${Date.now()}`,
    clean: true,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('✅ MQTT connected to', mqttUrl);

    // Subscribe topics
    client.subscribe('data_sensor', { qos: 1 }, (err, granted) => {
      if (err) {
        console.error('❌ Subscribe data_sensor failed:', err.message);
      } else {
        console.log('📡 Subscribed to: data_sensor', JSON.stringify(granted));
      }
    });

    client.subscribe('device/ack', { qos: 1 }, (err, granted) => {
      if (err) {
        console.error('❌ Subscribe device/ack failed:', err.message);
      } else {
        console.log('📡 Subscribed to: device/ack', JSON.stringify(granted));
      }
    });
  });

  client.on('message', async (topic, message) => {
    const raw = message.toString();
    console.log(`📨 MQTT [${topic}]: ${raw}`);
    try {
      const payload = JSON.parse(raw);

      if (topic === 'data_sensor') {
        console.log('  → Processing sensor data...');
        await handleSensorData(payload);
        console.log('  → Sensor data saved ✅');
      } else if (topic === 'device/ack') {
        handleDeviceACK(payload);
      }
    } catch (error) {
      console.error('MQTT message error:', error.message, '| Raw:', raw);
    }
  });

  client.on('error', (err) => {
    console.error('❌ MQTT error:', err.message);
  });

  client.on('reconnect', () => {
    console.log('🔄 MQTT reconnecting...');
  });

  client.on('offline', () => {
    console.log('📴 MQTT offline');
    // Broadcast connection lost to FE
    wsHandler.broadcast({
      type: 'mqtt_status',
      data: { connected: false, timestamp: new Date() }
    });
  });
}

/**
 * Xử lý dữ liệu cảm biến từ hardware
 * Payload: { temp: 28, humidity: 80, light: 1000 }
 */
async function handleSensorData(payload) {
  const now = new Date();
  const { temp, humidity, light } = payload;

  // Detect hardware reconnect
  const timeSinceLastData = lastSensorDataTime ? (now.getTime() - lastSensorDataTime.getTime()) : Infinity;
  const isReconnect = timeSinceLastData > RECONNECT_THRESHOLD;

  if (isReconnect) {
    console.log('🔌 Hardware reconnect detected! Syncing device states...');
    // Sync device states after a short delay to let hardware stabilize
    setTimeout(() => syncDeviceStates(), 1000);
  }

  lastSensorDataTime = now;

  try {
    // INSERT 3 bản ghi sensor_data
    const values = [];
    if (temp !== undefined) values.push(['dht_temp', temp, now]);
    if (humidity !== undefined) values.push(['dht_hum', humidity, now]);
    if (light !== undefined) values.push(['light', light, now]);

    for (const [sensorId, value, timestamp] of values) {
      await db.query(
        'INSERT INTO sensor_data (sensor_id, value, created_at) VALUES (?, ?, ?)',
        [sensorId, value, timestamp]
      );
    }

    // Broadcast realtime data to FE via WebSocket
    const sensorUpdate = {
      type: 'sensor_update',
      data: {
        temperature: temp,
        humidity: humidity,
        light: light,
        timestamp: now,
        time: now.toLocaleTimeString('vi-VN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
      },
    };
    wsHandler.broadcast(sensorUpdate);

    // Kiểm tra ngưỡng cảnh báo (FR-DASH-07)
    const alerts = [];
    if (temp !== undefined && temp > THRESHOLDS.dht_temp.max) {
      alerts.push({ sensor_id: 'dht_temp', value: temp, threshold: THRESHOLDS.dht_temp.max, name: THRESHOLDS.dht_temp.name, unit: THRESHOLDS.dht_temp.unit });
    }
    if (humidity !== undefined && humidity > THRESHOLDS.dht_hum.max) {
      alerts.push({ sensor_id: 'dht_hum', value: humidity, threshold: THRESHOLDS.dht_hum.max, name: THRESHOLDS.dht_hum.name, unit: THRESHOLDS.dht_hum.unit });
    }
    if (light !== undefined && light > THRESHOLDS.light.max) {
      alerts.push({ sensor_id: 'light', value: light, threshold: THRESHOLDS.light.max, name: THRESHOLDS.light.name, unit: THRESHOLDS.light.unit });
    }

    if (alerts.length > 0) {
      wsHandler.broadcast({
        type: 'threshold_alert',
        data: { alerts, timestamp: now },
      });
    }

    // AUTO mode logic for LED (light sensor < 500 lux)
    if (light !== undefined && deviceModes.led_01 === 'auto') {
      await handleAutoLightControl(light);
    }

  } catch (error) {
    console.error('Error saving sensor data:', error.message);
  }
}

/**
 * AUTO mode logic: Tự động bật/tắt đèn dựa trên ánh sáng
 */
async function handleAutoLightControl(lightValue) {
  try {
    // Get current LED state from DB
    const [rows] = await db.query('SELECT device_state FROM devices WHERE id = ?', ['led_01']);
    if (rows.length === 0) return;

    const currentState = rows[0].device_state;
    let targetAction = null;

    // Determine target action based on light threshold
    if (lightValue < AUTO_LIGHT_THRESHOLD && currentState === 'OFF') {
      targetAction = 'ON';
      console.log(`🤖 AUTO: Light ${lightValue} lux < ${AUTO_LIGHT_THRESHOLD} → Turn LED ON`);
    } else if (lightValue >= AUTO_LIGHT_THRESHOLD && currentState === 'ON') {
      targetAction = 'OFF';
      console.log(`🤖 AUTO: Light ${lightValue} lux >= ${AUTO_LIGHT_THRESHOLD} → Turn LED OFF`);
    }

    // If action needed, publish command
    if (targetAction) {
      const requestId = `auto_${Date.now()}`;
      const now = new Date();

      // Insert action_history
      await db.query(
        'INSERT INTO action_history (request_id, device_id, action, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [requestId, 'led_01', targetAction, 'SUCCESS', now]
      );

      // Update device state
      await db.query(
        'UPDATE devices SET device_state = ? WHERE id = ?',
        [targetAction, 'led_01']
      );

      // Publish MQTT command
      publishDeviceCommand(requestId, 'led_01', targetAction);

      // Broadcast to frontend
      wsHandler.broadcast({
        type: 'device_update',
        data: {
          deviceId: 'led_01',
          device_state: targetAction,
          requestId,
          status: 'SUCCESS',
          auto: true // Flag to indicate this was auto-triggered
        }
      });
    }
  } catch (error) {
    console.error('Error in auto light control:', error.message);
  }
}

/**
 * Xử lý ACK phản hồi từ hardware
 * Payload: { requestId, result: "SUCCESS" | "FAILED" }
 */
function handleDeviceACK(payload) {
  const { requestId, result } = payload;
  
  if (!requestId || !result) {
    console.warn('Invalid ACK payload:', payload);
    return;
  }

  console.log(`📨 ACK received: ${requestId} → ${result}`);

  // Forward to deviceController để resolve pending promise
  const deviceController = require('../controllers/deviceController');
  deviceController.handleACK(requestId, result);
}

/**
 * Publish lệnh điều khiển xuống hardware
 * Topic: device/cmd
 * Payload: { requestId, deviceId, action }
 */
function publishDeviceCommand(requestId, deviceId, action) {
  if (!client || !client.connected) {
    console.error('MQTT not connected, cannot publish');
    return;
  }

  const payload = JSON.stringify({ requestId, deviceId, action });
  client.publish('device/cmd', payload, { qos: 1 }, (err) => {
    if (err) {
      console.error('MQTT publish error:', err.message);
    } else {
      console.log(`📤 Published to device/cmd: ${payload}`);
    }
  });
}

/**
 * Set device mode (manual/auto)
 */
function setDeviceMode(deviceId, mode) {
  if (deviceId === 'led_01' && ['manual', 'auto'].includes(mode)) {
    deviceModes[deviceId] = mode;
    console.log(`🔧 Device mode updated: ${deviceId} → ${mode}`);

    // Broadcast mode change to frontend
    wsHandler.broadcast({
      type: 'device_mode_update',
      data: { deviceId, mode }
    });
  }
}

/**
 * Get device mode
 */
function getDeviceMode(deviceId) {
  return deviceModes[deviceId] || 'manual';
}

module.exports = {
  connect,
  publishDeviceCommand,
  setDeviceMode,
  getDeviceMode,
};
