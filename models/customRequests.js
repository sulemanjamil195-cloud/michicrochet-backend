const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomRequest = sequelize.define("CustomRequest", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM("hat", "bag", "sweater"),
        allowNull: false
    },
   size: {
    type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL"),
    allowNull: false
   },
   color: {
    type: DataTypes.STRING,
    allowNull: false
   },
   extraNotes: {
    type: DataTypes.TEXT,
    allowNull: true
   },
 status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    allowNull: false,
    defaultValue: "pending"
   },
   estimatedPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
   }
});

module.exports = CustomRequest;