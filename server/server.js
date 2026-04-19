const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');

// Scheduled expiration email imports
const cron = require('node-cron');
const User = require('./models/User');
const FridgeItem = require('./models/FridgeItem');
const sendEmail = require('./utils/sendEmail');

const PORT = process.env.PORT || 5000;
const isVercel = process.env.VERCEL === '1';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    if (!isVercel) {
      // Schedule daily expiration email job at 8:00 AM server time
      cron.schedule('0 8 * * *', async () => {
        console.log('Running daily expiration email job...');
        try {
          // Find all users who want email alerts
          const users = await User.find({ 'notificationPreferences.emailAlerts': true }).populate('fridge');
          for (const user of users) {
            // Find expiring items for this user (default: 3 days, or user setting)
            const days = user.notificationPreferences?.daysBeforeExpiration || 3;
            const now = new Date();
            const soon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            const items = await FridgeItem.find({
              fridge: user.fridge,
              expirationDate: { $ne: null, $lte: soon, $gte: now },
            });
            if (items.length > 0) {
              await sendEmail.sendExpirationAlert({
                to: user.email,
                name: user.name,
                items,
              });
              console.log(`Sent expiration email to ${user.email}`);
            }
          }
        } catch (err) {
          console.error('Error in expiration email job:', err);
        }
      });
    }
  } catch (error) {
    console.error('Failed to start server');
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
