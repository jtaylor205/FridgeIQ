const mongoose = require('mongoose');

const fridgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'My Fridge',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['editor', 'viewer'], default: 'editor' },
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FridgeItem',
      },
    ],
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fridge', fridgeSchema);
