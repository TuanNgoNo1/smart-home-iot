const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// GET /api/sensor-data?sensor_id=&from=&to=&search=&page=&pageSize=&sortBy=&sortOrder=
router.get('/', sensorController.getSensorData);

module.exports = router;
