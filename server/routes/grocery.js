const express = require('express');
const router = express.Router();
const {
  getOrders,
  importOrderItems,
  connectStoreAccount,
  disconnectStoreAccount,
} = require('../controllers/groceryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/orders', getOrders);
router.post('/import', importOrderItems);
router.post('/connect', connectStoreAccount);
router.post('/disconnect', disconnectStoreAccount);

module.exports = router;
