// ============================================
// USER ROUTES
// ============================================
// Routes for user management (Admin only)

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controller functions
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMasterData
} = require('../controllers/userController');

/**
 * All routes require authentication and admin role
 */

// Master data route - must be before /:id to avoid conflict
router.get('/master', protect, authorize('admin'), getMasterData);

router.route('/')
  .get(protect, authorize('admin'), getAllUsers)     // Get all users
  .post(protect, authorize('admin'), createUser);    // Create new user

router.route('/:id')
  .get(protect, authorize('admin'), getUser)         // Get single user
  .put(protect, authorize('admin'), updateUser)      // Update user
  .delete(protect, authorize('admin'), deleteUser);  // Delete user

// Export router
module.exports = router;
