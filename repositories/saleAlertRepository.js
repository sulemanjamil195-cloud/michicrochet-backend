const { SaleAlert } = require('../models');

async function findOrCreateByEmail(email) {
    return SaleAlert.findOrCreate({ where: { email }, defaults: { email, userId: null } });
}

async function findAll() {
    return SaleAlert.findAll({ order: [['subscribedAt', 'DESC']] });
}

async function findAllEmails() {
    return SaleAlert.findAll({ attributes: ['email'] });
}

async function findById(id) {
    return SaleAlert.findByPk(id);
}

async function updateById(id, data) {
    const subscriber = await SaleAlert.findByPk(id);
    if (!subscriber) return null;
    return subscriber.update(data);
}

async function deleteById(id) {
    return SaleAlert.destroy({ where: { id } });
}

module.exports = { findOrCreateByEmail, findAll, findAllEmails, findById, updateById, deleteById };
