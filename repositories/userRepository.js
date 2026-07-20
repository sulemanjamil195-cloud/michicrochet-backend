const { User } = require('../models');

async function findByEmail(email) {
    return User.findOne({ where: { email } });
}

async function findById(id) {
    return User.findByPk(id);
}

async function create(data) {
    return User.create(data);
}

module.exports = { findByEmail, findById, create };
