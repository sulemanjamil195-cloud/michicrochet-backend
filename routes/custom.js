const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    createCustomRequest,
    getMyCustomRequests,
    getAllCustomRequests,
    getCustomRequestById,
    updateCustomRequest,
    cancelOwnCustomRequest,
    deleteCustomRequest,
} = require('../controllers/customRequestController');

router.post('/', authMiddleware, createCustomRequest);
router.get('/me', authMiddleware, getMyCustomRequests);
router.patch('/:id/cancel', authMiddleware, cancelOwnCustomRequest);

router.get('/', authMiddleware, adminMiddleware, getAllCustomRequests);
router.get('/:id', authMiddleware, getCustomRequestById);
router.put('/:id', authMiddleware, adminMiddleware, updateCustomRequest);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCustomRequest);

module.exports = router;
