
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Order = require('./orders');
const OrderItem = require('./orderItems');
const CustomRequest = require('./customRequests');
const SaleAlert = require('./saleAlerts');


User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

CustomRequest.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(CustomRequest, { foreignKey: 'userId', as: 'customRequests' });

SaleAlert.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(SaleAlert, { foreignKey: 'userId', as: 'saleAlerts' });

module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    CustomRequest,
    SaleAlert
};

