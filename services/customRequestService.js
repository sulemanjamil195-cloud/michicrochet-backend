const customRequestRepository = require('../repositories/customRequestRepository');

const ALLOWED_CATEGORIES = new Set(['hat', 'bag', 'sweater']);
const ALLOWED_SIZES = new Set(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'cancelled']);

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function notFound(message = 'Custom request not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}

async function createCustomRequest(userId, { category, size, color, extraNotes, estimatedPrice }) {
    if (!ALLOWED_CATEGORIES.has(category)) throw badRequest('category must be hat, bag, or sweater');
    if (!ALLOWED_SIZES.has(size)) throw badRequest('size must be XS, S, M, L, XL, or XXL');
    if (typeof color !== 'string' || !color.trim()) throw badRequest('color is required');

    const price = Number(estimatedPrice);
    if (!Number.isFinite(price) || price < 0) throw badRequest('estimatedPrice must be a non-negative number');

    return customRequestRepository.create({
        userId,
        category,
        size,
        color: color.trim(),
        extraNotes: extraNotes ?? null,
        estimatedPrice: price,
        status: 'pending',
    });
}

async function getMyCustomRequests(userId) {
    return customRequestRepository.findByUserId(userId);
}

async function getAllCustomRequests() {
    return customRequestRepository.findAll();
}

async function getCustomRequestById(id, user) {
    const customRequest = await customRequestRepository.findById(id);
    if (!customRequest) throw notFound();
    if (!user.isAdmin && customRequest.userId !== user.id) throw notFound();
    return customRequest;
}

async function updateCustomRequest(id, status) {
    if (status === undefined) throw badRequest('status is required');
    if (!ALLOWED_STATUSES.has(status)) throw badRequest('status must be pending, confirmed, or cancelled');

    const updated = await customRequestRepository.updateById(id, { status });
    if (!updated) throw notFound();
    return updated;
}

async function cancelOwnCustomRequest(id, userId) {
    const customRequest = await customRequestRepository.findById(id);
    if (!customRequest) throw notFound();
    if (customRequest.userId !== userId) throw notFound();
    if (customRequest.status !== 'pending') throw badRequest('Only pending requests can be cancelled');

    return customRequestRepository.updateById(id, { status: 'cancelled' });
}

async function deleteCustomRequest(id) {
    const deleted = await customRequestRepository.deleteById(id);
    if (!deleted) throw notFound();
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
