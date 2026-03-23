const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fridge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fridge',
    },
    sharedFridges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fridge',
      },
    ],
    notificationPreferences: {
      emailAlerts: { type: Boolean, default: true },
      daysBeforeExpiration: { type: Number, default: 3 },
    },
    connectedGroceryAccount: {
      provider: { type: String, default: null },
      accountId: { type: String, default: null },
      connected: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
