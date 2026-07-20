const checkoutService = require('../services/checkoutService');

async function handleStripeWebhook(req, res) {
    try {
        const result = await checkoutService.handleStripeWebhook(req.body, req.headers['stripe-signature']);
        return res.json(result);
    } catch (error) {
        // Stripe expects plain text on webhook failures, not JSON
        return res.status(error.status || 500).send(error.message || 'Webhook error');
    }
}

async function createCheckoutSession(req, res) {
    try {
        const session = await checkoutService.createCheckoutSession(req.user.id, req.body);
        return res.json(session);
    } catch (error) {
        console.error('Stripe create session error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Could not start checkout' });
    }
}

module.exports = { handleStripeWebhook, createCheckoutSession };
