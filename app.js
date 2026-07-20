require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const { handleStripeWebhook } = require('./routes/checkout');
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware: teach Express to understand JSON requests
app.use(express.json());

// Allow only your deployed frontend to call this API
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. https://michicrochet.vercel.app
}));

// Routes — each file handles a group of related URLs
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/custom-orders', require('./routes/custom'));
app.use('/api/checkout',      require('./routes/checkout'));
app.use('/api/sale-alerts',   require('./routes/email'));
app.use('/api/emails',        require('./routes/email'));

// Error handler MUST come last — catches any errors from above routes
app.use(errorHandler);

module.exports = app;
