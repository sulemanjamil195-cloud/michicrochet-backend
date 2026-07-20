const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });
    return generateToken(user.id);
}

async function login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    return generateToken(user.id);
}

module.exports = { register, login };
