const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SaleAlert = sequelize.define("SaleAlert", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
   subscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
   }
   
});

module.exports = SaleAlert;