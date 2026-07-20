const orderRepository = require('../repositories/orderRepository');

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function notFound(message = 'Order not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}

async function getOrders() {
    return orderRepository.findAll();
}

async function getMyOrders(userId) {
    return orderRepository.findByUserId(userId);
}

async function getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw notFound();
    return order;
}

async function createOrder(userId, { items, StripeId, type }) {
    if (!StripeId || typeof StripeId !== 'string') {
        throw badRequest('StripeId is required');
    }
    if (!Array.isArray(items) || items.length === 0) {
        throw badRequest('items must be a non-empty array of { productId, quantity }');
    }

    const itemsByProductId = new Map();
    for (const line of items) {
        const productId = Number(line.productId);
        const quantity = Number(line.quantity);
        if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(quantity) || quantity < 1) {
            throw badRequest('Each item needs positive integer productId and quantity');
        }
        itemsByProductId.set(productId, (itemsByProductId.get(productId) || 0) + quantity);
    }

    try {
        return await orderRepository.createWithItems({ userId, StripeId, type, itemsByProductId });
    } catch (error) {
        if (error.message === 'PRODUCT_NOT_FOUND') {
            throw badRequest('One or more products were not found');
        }
        if (error.message === 'INSUFFICIENT_STOCK') {
            const err = badRequest('Insufficient stock for one or more items');
            err.productId = error.productId;
            err.available = error.available;
            throw err;
        }
        throw error;
    }
}

async function updateOrder(id, data) {
    const { userId, totalPrice, status, StripeId, type } = data;
    const payload = {};
    if (userId !== undefined) payload.userId = userId;
    if (totalPrice !== undefined) payload.totalPrice = totalPrice;
    if (status !== undefined) payload.status = status;
    if (StripeId !== undefined) payload.StripeId = StripeId;
    if (type !== undefined) payload.type = type;

    const updated = await orderRepository.updateById(id, payload);
    if (!updated) throw notFound();
    return updated;
}

async function deleteOrder(id) {
    const deleted = await orderRepository.deleteWithItems(id);
    if (!deleted) throw notFound();
}

module.exports = {
    getOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
