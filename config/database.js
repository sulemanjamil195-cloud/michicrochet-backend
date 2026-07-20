require('dotenv').config();
const { Sequelize } = require("sequelize");
// Explicit require so bundlers (Vercel's build tracer, webpack, esbuild, etc.)
// can statically detect that 'pg' is needed. Sequelize normally loads the
// Postgres driver dynamically, which these bundlers can't see, causing
// "Please install pg package manually" at runtime even though it's installed.
const pg = require("pg");

const sequelize = new Sequelize(process.env.Database_URL, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;