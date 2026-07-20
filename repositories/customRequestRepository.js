const { CustomRequest } = require('../models');

async function findByUserId(userId) {
    return CustomRequest.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
}

async function findAll() {
    return CustomRequest.findAll({ order: [['createdAt', 'DESC']] });
}

async function findById(id) {
    return CustomRequest.findByPk(id);
}

async function create(data) {
    return CustomRequest.create(data);
}

async function updateById(id, data) {
    const customRequest = await CustomRequest.findByPk(id);
    if (!customRequest) return null;
    return customRequest.update(data);
}

async function deleteById(id) {
    const customRequest = await CustomRequest.findByPk(id);
    if (!customRequest) return null;
    await customRequest.destroy();
    return true;
}

module.exports = { findByUserId, findAll, findById, create, updateById, deleteById };
