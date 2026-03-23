const express = require('express');
const router = express.Router();
const { getFridge, addItem, updateItem, deleteItem } = require('../controllers/fridgeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFridge);
router.post('/items', addItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

module.exports = router;
