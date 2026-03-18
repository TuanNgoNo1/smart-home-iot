const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// GET /api/sensors — Danh sách loại cảm biến (cho Dropdown)
router.get('/', sensorController.getSensors);

// GET /api/sensors/latest — 3 chỉ số mới nhất
router.get('/latest', sensorController.getLatestSensorData);

// GET /api/sensors/chart?limit=20 — Dữ liệu biểu đồ
router.get('/chart', sensorController.getChartData);

module.exports = router;
