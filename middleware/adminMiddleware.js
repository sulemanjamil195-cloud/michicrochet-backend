const adminMiddleware = async (req, res, next) => {
    const { user } = req;
    if (!user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    return next();
};

module.exports = adminMiddleware;
