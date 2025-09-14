// =============================================
// MAIN SERVER FILE (server.js)
// =============================================
// This is the main entry point of your backend application.
// It sets up Express server, middleware, and routes.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const registerRoute = require('./routes/register');

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE SETUP
// =============================================

// Security headers
app.use(helmet());

// CORS setup - allows your frontend to communicate with backend
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://eventsroobaroo-dotcom.github.io/ROOBAROO./'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false
};
app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// =============================================
// API ROUTES
// =============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ROOBAROO Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Registration endpoint
app.use('/api', registerRoute);

// =============================================
// ERROR HANDLING
// =============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Available endpoints: GET /api/health, POST /api/register'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 ROOBAROO Backend server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Register endpoint: http://localhost:${PORT}/api/register`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
