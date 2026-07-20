const customRequestService = require('../services/customRequestService');

function handleError(res, error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
}

async function createCustomRequest(req, res) {
    try {
        const customRequest = await customRequestService.createCustomRequest(req.user.id, req.body);
        return res.status(201).json(customRequest);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getMyCustomRequests(req, res) {
    try {
        const customRequests = await customRequestService.getMyCustomRequests(req.user.id);
        return res.json(customRequests);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getAllCustomRequests(req, res) {
    try {
        const customRequests = await customRequestService.getAllCustomRequests();
        return res.json(customRequests);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getCustomRequestById(req, res) {
    try {
        const customRequest = await customRequestService.getCustomRequestById(req.params.id, req.user);
        return res.json(customRequest);
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateCustomRequest(req, res) {
    try {
        const customRequest = await customRequestService.updateCustomRequest(req.params.id, req.body.status);
        return res.json(customRequest);
    } catch (error) {
        return handleError(res, error);
    }
}

async function cancelOwnCustomRequest(req, res) {
    try {
        const customRequest = await customRequestService.cancelOwnCustomRequest(req.params.id, req.user.id);
        return res.json(customRequest);
    } catch (error) {
        return handleError(res, error);
    }
}

async function deleteCustomRequest(req, res) {
    try {
        await customRequestService.deleteCustomRequest(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    createCustomRequest,
    getMyCustomRequests,
    getAllCustomRequests,
    getCustomRequestById,
    updateCustomRequest,
    cancelOwnCustomRequest,
    deleteCustomRequest,
};
