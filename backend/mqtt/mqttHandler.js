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

  } catch (error) {
    console.error('Error saving sensor data:', error.message);
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

module.exports = {
  connect,
  publishDeviceCommand,
};
