require('dotenv').config();
const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log(process.env.Database_URL);

const sequelize = new Sequelize(process.env.Database_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;