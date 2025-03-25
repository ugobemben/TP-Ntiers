require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Synchroniser la base de données et démarrer le serveur
async function startServer() {
  try {
    // Synchroniser la base de données
    await sequelize.sync();
    logger.info('Database synchronized successfully');

    // Démarrer le serveur
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();