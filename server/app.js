const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const fridgeRoutes = require('./routes/fridge');
const scannerRoutes = require('./routes/scanner');
const groceryRoutes = require('./routes/grocery');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/grocery', groceryRoutes);
app.use(errorHandler);

module.exports = app;
