const authService = require('../services/authService');

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const token = await authService.register({ name, email, password });
        return res.status(201).json({ token });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const token = await authService.login({ email, password });
        return res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

module.exports = { register, login };
