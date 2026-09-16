const express = require('express');
const cors = require('cors');
const errorHandler = require('./presentation/middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server running cleanly' });
});

// Dynamic / Versioned Routes Entry Point
// app.use('/api/v1/polls', require('./presentation/routes/v1/pollRoutes'));

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;