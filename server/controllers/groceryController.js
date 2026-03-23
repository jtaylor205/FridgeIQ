const FridgeItem = require('../models/FridgeItem');
const Fridge = require('../models/Fridge');
const User = require('../models/User');
const grocerySimulator = require('../services/grocerySimulator');

const getOrders = async (req, res, next) => {
  try {
    const orders = grocerySimulator.getSimulatedOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const importOrderItems = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const docs = items.map((item) => ({
      ...item,
      fridge: req.user.fridge,
      addedBy: req.user._id,
      importSource: 'grocery_import',
    }));

    const created = await FridgeItem.insertMany(docs);
    const ids = created.map((i) => i._id);
    await Fridge.findByIdAndUpdate(req.user.fridge, { $push: { items: { $each: ids } } });

    res.status(201).json({ imported: created.length, items: created });
  } catch (err) {
    next(err);
  }
};

const connectStoreAccount = async (req, res, next) => {
  try {
    const { provider } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { connectedGroceryAccount: { provider, accountId: `sim_${req.user._id}`, connected: true } },
      { new: true }
    ).select('-password');

    res.json({ connected: true, provider, user });
  } catch (err) {
    next(err);
  }
};

const disconnectStoreAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { connectedGroceryAccount: { provider: null, accountId: null, connected: false } },
      { new: true }
    ).select('-password');

    res.json({ connected: false, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, importOrderItems, connectStoreAccount, disconnectStoreAccount };
