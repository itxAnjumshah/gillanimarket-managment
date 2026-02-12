// ============================================
// PAYMENT CONTROLLER
// ============================================
// Handles payment-related operations

const Payment = require('../models/Payment');
const User = require('../models/User');

/**
 * @route   GET /api/payments
 * @desc    Get all payments (Admin only)
 * @access  Private/Admin
 */
exports.getAllPayments = async (req, res) => {
  try {
    const { status, month, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (month) query.month = month;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate('user', 'name email shopName phone monthlyRent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/payments/user/:userId
 * @desc    Get payments for a specific user
 * @access  Private
 */
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    const payments = await Payment.find({ user: userId })
      .populate('user', 'name email shopName phone monthlyRent')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/payments/bill-summary/:userId
 * @desc    Get bill summary for a user
 * @access  Private
 */
exports.getBillSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all payments for this user
    const payments = await Payment.find({ user: userId });

    const verifiedPayments = payments.filter(p => p.status === 'verified');
    const pendingPayments = payments.filter(p => p.status === 'pending');

    const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        monthlyRent: user.monthlyRent,
        totalPaid,
        totalPending,
        dueDate: user.dueDate,
        shopName: user.shopName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   POST /api/payments/manual
 * @desc    Create a manual payment entry (Admin only)
 * @access  Private/Admin
 */
exports.createManualPayment = async (req, res) => {
  try {
    const { userId, amount, month, paymentMethod, notes } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create payment
    const payment = await Payment.create({
      user: userId,
      amount,
      month,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      status: 'verified', // Manual entries are auto-verified
      verifiedBy: req.user.id,
      verifiedAt: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   POST /api/payments/upload-receipt
 * @desc    Upload payment receipt (User)
 * @access  Private
 */
exports.uploadReceipt = async (req, res) => {
  try {
    const { amount, month, notes } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a receipt file'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      amount,
      month,
      paymentMethod: 'cash',
      receiptFile: req.file.path,
      notes: notes || '',
      status: 'pending' // Needs admin verification
    });

    res.status(201).json({
      success: true,
      message: 'Receipt uploaded successfully. Pending verification.',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   PUT /api/payments/:id/verify
 * @desc    Verify or reject a payment (Admin only)
 * @access  Private/Admin
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use "verified" or "rejected"'
      });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = Date.now();

    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment ${status} successfully`,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics (Admin only)
 * @access  Private/Admin
 */
exports.getPaymentStats = async (req, res) => {
  try {
    const allPayments = await Payment.find();

    const verifiedPayments = allPayments.filter(p => p.status === 'verified');
    const pendingPayments = allPayments.filter(p => p.status === 'pending');

    const totalCollected = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    // Get current month stats
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const currentMonthPayments = allPayments.filter(p => p.month === currentMonth);
    const monthlyCollected = currentMonthPayments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalCollected,
        totalPending,
        monthlyCollected,
        verifiedCount: verifiedPayments.length,
        pendingCount: pendingPayments.length,
        rejectedCount: allPayments.filter(p => p.status === 'rejected').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete a payment record (Admin only)
 * @access  Private/Admin
 */
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
