const { sequelize, Order, OrderItem, Product } = require('../models');

const orderInclude = {
    model: OrderItem,
    as: 'orderItems',
    include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'imageUrl', 'category'] }],
};

async function findAll() {
    return Order.findAll({ include: [orderInclude], order: [['createdAt', 'DESC']] });
}

async function findByUserId(userId) {
    return Order.findAll({ where: { userId }, include: [orderInclude], order: [['createdAt', 'DESC']] });
}

async function findById(id) {
    return Order.findByPk(id, { include: [orderInclude] });
}

async function findProductsByIds(ids, transaction) {
    return Product.findAll({ where: { id: ids }, transaction });
}

/**
 * Creates an order + its order items in one transaction, decrementing stock as it goes.
 * Throws PRODUCT_NOT_FOUND or INSUFFICIENT_STOCK errors for the service layer to translate.
 */
async function createWithItems({ userId, StripeId, type, itemsByProductId }) {
    const order = await sequelize.transaction(async (t) => {
        const productIds = [...itemsByProductId.keys()];
        const products = await findProductsByIds(productIds, t);

        if (products.length !== productIds.length) {
            throw Object.assign(new Error('PRODUCT_NOT_FOUND'), {});
        }

        let totalPrice = 0;
        const orderItemRows = [];

        for (const product of products) {
            const quantity = itemsByProductId.get(product.id);
            if (product.stock < quantity) {
                throw Object.assign(new Error('INSUFFICIENT_STOCK'), {
                    productId: product.id,
                    available: product.stock,
                });
            }
            totalPrice += product.price * quantity;
            orderItemRows.push({ productId: product.id, quantity, price: product.price });
        }

        const newOrder = await Order.create(
            { userId, totalPrice, status: 'pending', StripeId, type: type || 'premade' },
            { transaction: t }
        );

        await OrderItem.bulkCreate(
            orderItemRows.map((row) => ({ ...row, orderId: newOrder.id })),
            { transaction: t }
        );

        for (const product of products) {
            const quantity = itemsByProductId.get(product.id);
            await product.decrement('stock', { by: quantity, transaction: t });
        }

        return newOrder;
    });

    return findById(order.id);
}

async function updateById(id, data) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.update(data);
    return findById(id);
}

async function deleteWithItems(id) {
    const order = await Order.findByPk(id);
    if (!order) return null;

    await sequelize.transaction(async (t) => {
        await OrderItem.destroy({ where: { orderId: id }, transaction: t });
        await order.destroy({ transaction: t });
    });
    return true;
}

module.exports = {
    findAll,
    findByUserId,
    findById,
    createWithItems,
    updateById,
    deleteWithItems,
};
