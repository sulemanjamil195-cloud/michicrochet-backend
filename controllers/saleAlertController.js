const saleAlertService = require('../services/saleAlertService');

function handleError(res, error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
}

async function subscribe(req, res) {
    try {
        const { status, message, subscriber } = await saleAlertService.subscribe(req.body?.email);
        return res.status(status).json({ message, subscriber });
    } catch (error) {
        return handleError(res, error);
    }
}

async function getSubscribers(req, res) {
    try {
        const subscribers = await saleAlertService.getSubscribers();
        return res.json(subscribers);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getSubscriberById(req, res) {
    try {
        const subscriber = await saleAlertService.getSubscriberById(req.params.id);
        return res.json(subscriber);
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateSubscriber(req, res) {
    try {
        const subscriber = await saleAlertService.updateSubscriber(req.params.id, req.body.email);
        return res.json(subscriber);
    } catch (error) {
        return handleError(res, error);
    }
}

async function deleteSubscriber(req, res) {
    try {
        await saleAlertService.deleteSubscriber(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error);
    }
}

async function notifySale(req, res) {
    try {
        const result = await saleAlertService.notifySale(req.body || {});
        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    subscribe,
    getSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber,
    notifySale,
};
