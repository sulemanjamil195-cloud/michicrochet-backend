const productRepository = require('../repositories/productRepository');

function notFound(message = 'Product not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}

async function getAllProducts() {
    return productRepository.findAll();
}

async function getHotsellingProducts() {
    return productRepository.findHotselling();
}

async function getCategories() {
    const rows = await productRepository.findDistinctCategories();
    return rows.map((r) => r.category);
}

async function getTypes() {
    const rows = await productRepository.findDistinctTypes();
    return rows.map((r) => r.type);
}

async function searchProducts(query) {
    if (!query || String(query).trim() === '') {
        const err = new Error('Missing search query');
        err.status = 400;
        throw err;
    }
    return productRepository.searchByName(query);
}

async function getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw notFound();
    return product;
}

async function createProduct(data) {
    const { name, price, description, category, imageUrl, stock, isHotselling, type } = data;
    return productRepository.create({ name, price, description, category, imageUrl, stock, isHotselling, type });
}

async function updateProduct(id, data) {
    const { name, price, description, category, imageUrl, stock, isHotselling, type } = data;
    const updated = await productRepository.updateById(id, {
        name, price, description, category, imageUrl, stock, isHotselling, type,
    });
    if (!updated) throw notFound();
    return updated;
}

async function deleteProduct(id) {
    await productRepository.deleteById(id);
}

module.exports = {
    getAllProducts,
    getHotsellingProducts,
    getCategories,
    getTypes,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
