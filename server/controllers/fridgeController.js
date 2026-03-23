const Fridge = require('../models/Fridge');
const FridgeItem = require('../models/FridgeItem');

const getFridge = async (req, res, next) => {
  try {
    const fridge = await Fridge.findById(req.user.fridge)
      .populate({ path: 'items', populate: { path: 'addedBy', select: 'name' } })
      .populate('members.user', 'name email');

    if (!fridge) return res.status(404).json({ message: 'Fridge not found' });

    res.json(fridge);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const item = await FridgeItem.create({
      ...req.body,
      fridge: req.user.fridge,
      addedBy: req.user._id,
    });

    await Fridge.findByIdAndUpdate(req.user.fridge, { $push: { items: item._id } });

    const populated = await item.populate('addedBy', 'name');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await FridgeItem.findOneAndUpdate(
      { _id: req.params.id, fridge: req.user.fridge },
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await FridgeItem.findOneAndDelete({
      _id: req.params.id,
      fridge: req.user.fridge,
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    await Fridge.findByIdAndUpdate(req.user.fridge, { $pull: { items: item._id } });

    res.json({ message: 'Item removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFridge, addItem, updateItem, deleteItem };
