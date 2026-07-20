const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    getOrders,
    getMyOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

router.get('/me', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminMiddleware, getOrders);
router.get('/:id', authMiddleware, adminMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, adminMiddleware, updateOrder);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;
