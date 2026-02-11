// ============================================
// MAIN SERVER FILE
// ============================================
// This is the entry point of the application

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rentRoutes = require('./routes/rentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// ============================================
// INITIALIZE APP
// ============================================

// Create Express application
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS (allows frontend to connect)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded receipts)
app.use('/uploads', express.static('uploads'));

// Log all requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Shop Rent Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      rent: '/api/rent',
      payments: '/api/payments'
    }
  });
});

// Health check (useful even when DB is down)
app.get('/health', (req, res) => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const readyState = mongoose.connection?.readyState ?? 0;

  res.status(200).json({
    ok: true,
    uptimeSeconds: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    db: {
      status: readyStateMap[readyState] || 'unknown',
      readyState
    }
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/users', userRoutes);        // User management routes
app.use('/api/rent', rentRoutes);         // Rent management routes
app.use('/api/payments', paymentRoutes);  // Payment management routes

// ============================================
// ERROR HANDLING
// ============================================

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Warn about missing required environment variables (without printing secrets)
  const requiredEnv = ['JWT_SECRET', 'JWT_EXPIRE', 'MONGODB_URI'];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length) {
    console.warn(`⚠️  Missing environment variables: ${missingEnv.join(', ')}`);
    console.warn('   Some endpoints may fail until these are set in your `.env` file.');
  }

  // Connect to MongoDB database (with retry). In development it will NOT kill the server on failure.
  const dbConnected = await connectDB();
  app.locals.dbConnected = dbConnected;

  const server = app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 Server is running!');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🩺 Health: http://localhost:${PORT}/health`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log('========================================');
  });

  const shutdown = async (reason, err) => {
    if (err) console.error(err);
    console.log(`\nShutting down (${reason})...`);
    server.close(() => {
      mongoose.connection.close(false).finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (err) => shutdown('unhandledRejection', err));
  process.on('uncaughtException', (err) => shutdown('uncaughtException', err));
};

start();
