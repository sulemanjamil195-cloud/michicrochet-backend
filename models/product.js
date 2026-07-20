const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM("hat", "bag", "sweater"),
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
            isCloudinary(value) {
                if (!/^https?:\/\/res\.cloudinary\.com\/.+/i.test(value)) {
                    throw new Error("imageUrl must be a valid Cloudinary URL");
                }
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    isHotselling: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM("premade"),
        allowNull: false,
        defaultValue: "premade"
    }
});

module.exports = Product;