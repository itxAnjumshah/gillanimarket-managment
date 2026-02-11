// ============================================
// AUTHENTICATION ROUTES
// ============================================
// Routes for user authentication

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller functions
const {
  register,
  login,
  getMe,
  updatePassword
} = require('../controllers/authController');

/**
 * Public Routes (No authentication required)
 */
router.post('/register', register);  // Register new user
router.post('/login', login);        // Login user

/**
 * Private Routes (Authentication required)
 */
router.get('/me', protect, getMe);                      // Get current user
router.put('/updatepassword', protect, updatePassword); // Update password

// Export router
module.exports = router;
