// ============================================
// PAYMENT ROUTES
// ============================================
// Routes for payment management

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Import controller functions
const {
  getAllPayments,
  getPaymentsByUser,
  getBillSummary,
  createManualPayment,
  uploadReceipt,
  verifyPayment,
  getPaymentStats,
  deletePayment
} = require('../controllers/paymentController');

/**
 * Payment Routes
 */

// Get all payments (Admin only)
router.get('/', protect, authorize('admin'), getAllPayments);

// Get payment statistics (Admin only)
router.get('/stats', protect, authorize('admin'), getPaymentStats);

// Get bill summary for a user
router.get('/bill-summary/:userId', protect, getBillSummary);

// Get payments for a specific user
router.get('/user/:userId', protect, getPaymentsByUser);

// Create manual payment (Admin only)
router.post('/manual', protect, authorize('admin'), createManualPayment);

// Upload receipt with file (User)
router.post('/upload-receipt', protect, upload.single('receipt'), uploadReceipt);

// Verify or reject payment (Admin only)
router.put('/:id/verify', protect, authorize('admin'), verifyPayment);

// Delete payment (Admin only)
router.delete('/:id', protect, authorize('admin'), deletePayment);

// Export router
module.exports = router;
