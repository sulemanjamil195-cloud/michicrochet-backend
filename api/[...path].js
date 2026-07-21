// // Vercel serverless entry point.
// const app = require('../app');
// const { sequelize } = require('../models');

// sequelize.authenticate()
//   .then(() => console.log('✅ DB connected'))
//   .catch(err => console.error('❌ DB connection failed:', err));

// module.exports = app;

const app = require("../app");

console.log("✅ API FUNCTION LOADED");

module.exports = app;