const FridgeItem = require('../models/FridgeItem');

const getExpirationAlerts = async (req, res, next) => {
  try {
    const now = new Date();
    const oneWeekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const items = await FridgeItem.find({
      fridge: req.user.fridge,
      expirationDate: { $ne: null, $lte: oneWeekOut },
    }).populate('addedBy', 'name');

    const expired = items.filter((i) => i.expirationDate < now);
    const today = items.filter((i) => {
      const d = i.expirationDate;
      return d >= now && d < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    });
    const tomorrow = items.filter((i) => {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
      return i.expirationDate >= start && i.expirationDate < end;
    });
    const thisWeek = items.filter((i) => {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
      return i.expirationDate >= start && i.expirationDate <= oneWeekOut;
    });

    res.json({ expired, today, tomorrow, thisWeek });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExpirationAlerts };
