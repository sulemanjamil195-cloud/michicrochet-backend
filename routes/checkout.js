const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { handleStripeWebhook, createCheckoutSession } = require('../controllers/checkoutController');

router.post('/create-session', authMiddleware, createCheckoutSession);

module.exports = router;
module.exports.handleStripeWebhook = handleStripeWebhook;
