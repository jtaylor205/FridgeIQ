const express = require('express');
const router = express.Router();
const { getMealSuggestions } = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

router.get('/suggestions', protect, getMealSuggestions);

module.exports = router;
