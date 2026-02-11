// ============================================
// RENT ROUTES
// ============================================
// Routes for rent management

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controller functions
const {
  getAllRents,
  getRentByUser,
  updateRent,
  getRentStats
} = require('../controllers/rentController');

/**
 * Rent Routes
 */

// Get all rents (Admin only)
router.get('/', protect, authorize('admin'), getAllRents);

// Get rent statistics (Admin only)
router.get('/stats', protect, authorize('admin'), getRentStats);

// Get rents for a specific user (User can see own, Admin can see all)
router.get('/user/:userId', protect, getRentByUser);

// Update rent (Admin only)
router.put('/:id', protect, authorize('admin'), updateRent);

// Export router
module.exports = router;
