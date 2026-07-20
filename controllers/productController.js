const productService = require('../services/productService');

function handleError(res, error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
}

async function getProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        return res.json(products);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getHotsellingProducts(req, res) {
    try {
        const products = await productService.getHotsellingProducts();
        return res.json(products);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getCategories(req, res) {
    try {
        const categories = await productService.getCategories();
        return res.json(categories);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getTypes(req, res) {
    try {
        const types = await productService.getTypes();
        return res.json(types);
    } catch (error) {
        return handleError(res, error);
    }
}

async function searchProducts(req, res) {
    try {
        const products = await productService.searchProducts(req.query.query);
        return res.json(products);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getProductById(req, res) {
    try {
        const product = await productService.getProductById(req.params.id);
        return res.json(product);
    } catch (error) {
        return handleError(res, error);
    }
}

async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).json(product);
    } catch (error) {
        return handleError(res, error);
    }
}

async function updateProduct(req, res) {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        return res.json(product);
    } catch (error) {
        return handleError(res, error);
    }
}

async function deleteProduct(req, res) {
    try {
        await productService.deleteProduct(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    getProducts,
    getHotsellingProducts,
    getCategories,
    getTypes,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
