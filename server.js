// Local development entry point. Vercel uses api/index.js instead.
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Connect to the database, then start the server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync(); // Creates tables if they don't exist (local dev only)
  })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Database connection failed:', err));
