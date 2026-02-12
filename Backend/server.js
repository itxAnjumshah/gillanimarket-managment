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
const indexRoutes = require('./routes/indexRoutes');
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

// ============================================
// ROUTES
// ============================================

// Mount API routes
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/users', userRoutes);        // User management routes
app.use('/api/rent', rentRoutes);         // Rent management routes
app.use('/api/payments', paymentRoutes);  // Payment management routes

// Root/welcome route (must be after API routes)
app.use('/', indexRoutes);

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

// Start server immediately so it doesn't appear stuck; connect DB in background
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
