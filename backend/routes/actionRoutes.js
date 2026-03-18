const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

// GET /api/action-history?device_id=&status=&from=&to=&search=&page=&pageSize=&sortOrder=
router.get('/', actionController.getActionHistory);

module.exports = router;
