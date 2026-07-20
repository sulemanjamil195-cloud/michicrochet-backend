const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    getProducts,
    getHotsellingProducts,
    getCategories,
    getTypes,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/hotselling', getHotsellingProducts);
router.get('/categories', getCategories);
router.get('/types', getTypes);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
