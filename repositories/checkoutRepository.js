const { Order } = require('../models');

async function findById(id) {
    return Order.findByPk(id);
}

async function markConfirmed(id, StripeId) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    return order.update({ status: 'confirmed', StripeId });
}

module.exports = { findById, markConfirmed };
