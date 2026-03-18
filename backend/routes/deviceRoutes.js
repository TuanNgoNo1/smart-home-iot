const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET /api/devices — Danh sách thiết bị + device_state
router.get('/', deviceController.getDevices);

// POST /api/devices/control — Gửi lệnh bật/tắt
router.post('/control', deviceController.controlDevice);

module.exports = router;
