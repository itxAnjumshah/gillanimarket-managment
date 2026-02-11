// ============================================
// MAIN SERVER FILE
// ============================================
// This is the entry point of the application

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
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

// Connect to MongoDB database
connectDB();

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
    message: err.message || 'Server Error'
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
