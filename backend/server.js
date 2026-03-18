require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

// Import handlers
const wsHandler = require('./websocket/wsHandler');
const mqttHandler = require('./mqtt/mqttHandler');

// Import routes
const sensorRoutes = require('./routes/sensorRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const actionRoutes = require('./routes/actionRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString('vi-VN')} ${req.method} ${req.url}`);
  next();
});

// ============================================
// Routes
// ============================================
app.use('/api/sensors', sensorRoutes);
app.use('/api/sensor-data', sensorDataRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/action-history', actionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start Server
// ============================================
const server = http.createServer(app);

// Initialize WebSocket (share HTTP server)
wsHandler.init(server);

// Connect to MQTT Broker
mqttHandler.connect();

server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🏠 IoT Smart Home Backend Server      ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║   HTTP:      http://localhost:${PORT}       ║`);
  console.log(`║   WebSocket: ws://localhost:${PORT}         ║`);
  console.log(`║   MQTT:      ${process.env.MQTT_HOST}:${process.env.MQTT_PORT}             ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log('API Endpoints:');
  console.log('  GET  /api/sensors          - Danh sách cảm biến');
  console.log('  GET  /api/sensors/latest   - Dữ liệu mới nhất');
  console.log('  GET  /api/sensors/chart    - Dữ liệu biểu đồ');
  console.log('  GET  /api/sensor-data      - Lịch sử cảm biến (phân trang)');
  console.log('  GET  /api/devices          - Danh sách thiết bị');
  console.log('  POST /api/devices/control  - Điều khiển thiết bị');
  console.log('  GET  /api/action-history   - Lịch sử điều khiển (phân trang)');
  console.log('');
});
