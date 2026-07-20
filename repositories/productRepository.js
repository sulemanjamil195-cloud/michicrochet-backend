const { Product } = require('../models');
const { Op } = require('sequelize');

async function findAll() {
    return Product.findAll();
}

async function findHotselling() {
    return Product.findAll({ where: { isHotselling: true } });
}

async function findDistinctCategories() {
    return Product.findAll({ attributes: ['category'], group: ['category'], raw: true });
}

async function findDistinctTypes() {
    return Product.findAll({ attributes: ['type'], group: ['type'], raw: true });
}

async function searchByName(query) {
    return Product.findAll({ where: { name: { [Op.like]: `%${query}%` } } });
}

async function findById(id) {
    return Product.findByPk(id);
}

async function create(data) {
    return Product.create(data);
}

async function updateById(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
}

async function deleteById(id) {
    return Product.destroy({ where: { id } });
}

module.exports = {
    findAll,
    findHotselling,
    findDistinctCategories,
    findDistinctTypes,
    searchByName,
    findById,
    create,
    updateById,
    deleteById,
};
