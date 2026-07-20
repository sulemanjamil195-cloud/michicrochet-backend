let stripeClient;

function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    if (!stripeClient) stripeClient = require('stripe')(key);
    return stripeClient;
}

module.exports = { getStripe };
