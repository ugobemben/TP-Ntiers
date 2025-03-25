const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const conversationRoutes = require('./routes/conversationRoutes');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/conversations', conversationRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Mon ChatGPT' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'production' ? 'Quelque chose s\'est mal passé' : err.message,
  });
});

module.exports = app;