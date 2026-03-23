const express = require('express');
const router = express.Router();
const { getExpirationAlerts } = require('../controllers/expirationController');
const { protect } = require('../middleware/auth');

router.get('/alerts', protect, getExpirationAlerts);

module.exports = router;
