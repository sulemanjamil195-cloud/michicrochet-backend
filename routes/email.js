const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    subscribe,
    getSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber,
    notifySale,
} = require('../controllers/saleAlertController');

/** Public: join the sale notification list */
router.post('/subscribe', subscribe);

/** Admin: email every subscriber about a sale (before /:id routes) */
router.post('/notify-sale', authMiddleware, adminMiddleware, notifySale);

router.get('/', authMiddleware, adminMiddleware, getSubscribers);
router.get('/:id', authMiddleware, adminMiddleware, getSubscriberById);
router.put('/:id', authMiddleware, adminMiddleware, updateSubscriber);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSubscriber);

module.exports = router;
