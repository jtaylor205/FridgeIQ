const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const fridgeRoutes = require('./routes/fridge');
const scannerRoutes = require('./routes/scanner');
const expirationRoutes = require('./routes/expiration');
const mealRoutes = require('./routes/meals');
const groceryRoutes = require('./routes/grocery');

const app = express();

// TEMP: Manual trigger for expiration emails (for testing)
const User = require('./models/User');
const FridgeItem = require('./models/FridgeItem');
const sendEmail = require('./utils/sendEmail');
app.post('/api/test/send-expiration-emails', async (req, res) => {
	try {
		const users = await User.find({ 'notificationPreferences.emailAlerts': true }).populate('fridge');
		let sent = 0;
		for (const user of users) {
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
				sent++;
			}
		}
		res.json({ message: `Sent ${sent} expiration emails.` });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/expiration', expirationRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/grocery', groceryRoutes);

app.use(errorHandler);

module.exports = app;
