const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema(
  {
    fridge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fridge',
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: null,
    },
    quantity: {
      amount: { type: Number, default: 1 },
      unit: { type: String, default: 'item' },
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    shelf: {
      type: String,
      enum: ['top', 'middle', 'bottom', 'drawer', 'door'],
      default: 'middle',
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      sugar: Number,
      fiber: Number,
      sodium: Number,
      servingSize: String,
      vitamins: [String],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ['dairy', 'meat', 'produce', 'grains', 'beverages', 'condiments', 'frozen', 'other'],
      default: 'other',
    },
    importSource: {
      type: String,
      enum: ['manual', 'scan', 'grocery_import'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FridgeItem', fridgeItemSchema);
