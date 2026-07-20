// Vercel serverless entry point.
const app = require('../app');
const { sequelize } = require('../models');

// Connect once per cold start. We deliberately do NOT call sequelize.sync()
// here — running schema sync on every invocation is unsafe in production.
// Create/update the schema once from your own machine instead (see deploy notes).
sequelize.authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection failed:', err));

module.exports = app;
