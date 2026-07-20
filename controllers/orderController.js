const orderService = require('../services/orderService');

function handleError(res, error) {
    const body = { message: error.message || 'Internal server error' };
    if (error.productId !== undefined) body.productId = error.productId;
    if (error.available !== undefined) body.available = error.available;
    return res.status(error.status || 500).json(body);
}

async function getOrders(req, res) {
    try {
        const orders = await orderService.getOrders();
        return res.json(orders);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getMyOrders(req, res) {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        return res.json(orders);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getOrderById(req, res) {
    try {
        const order = await orderService.getOrderById(req.params.id);
        return res.json(order);
    } catch (error) {
        return handleError(res, error);
    }
}

async function createOrder(req, res) {
    try {
        const order = await orderService.createOrder(req.user.id, req.body);
        return res.status(201).json(order);
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateOrder(req, res) {
    try {
        const order = await orderService.updateOrder(req.params.id, req.body);
        return res.json(order);
    } catch (error) {
        return handleError(res, error);
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.deleteOrder(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    getOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
