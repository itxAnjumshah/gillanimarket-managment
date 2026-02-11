// ============================================
// RENT CONTROLLER
// ============================================
// Handles rent-related operations

const Rent = require('../models/Rent');
const User = require('../models/User');

/**
 * @route   GET /api/rent
 * @desc    Get all rent records (Admin only)
 * @access  Private/Admin
 */
exports.getAllRents = async (req, res) => {
  try {
    // Get all rents and populate user information
    const rents = await Rent.find()
      .populate('user', 'name email shopName')
      .sort({ period: -1 });

    res.status(200).json({
      success: true,
      count: rents.length,
      data: rents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/rent/user/:userId
 * @desc    Get rent records for a specific user
 * @access  Private
 */
exports.getRentByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this data'
      });
    }

    const rents = await Rent.find({ user: userId })
      .populate('user', 'name email shopName')
      .sort({ period: -1 });

    res.status(200).json({
      success: true,
      count: rents.length,
      data: rents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   PUT /api/rent/:id
 * @desc    Update rent information
 * @access  Private/Admin
 */
exports.updateRent = async (req, res) => {
  try {
    const { amount, status } = req.body;

    let rent = await Rent.findById(req.params.id);

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: 'Rent record not found'
      });
    }

    // Update fields
    if (amount !== undefined) rent.amount = amount;
    if (status) rent.status = status;

    await rent.save();

    res.status(200).json({
      success: true,
      message: 'Rent updated successfully',
      data: rent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/rent/stats
 * @desc    Get rent statistics (Admin only)
 * @access  Private/Admin
 */
exports.getRentStats = async (req, res) => {
  try {
    // Get all users
    const allUsers = await User.find({ role: 'user' });
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.status === 'active').length;

    // Calculate total monthly rent
    const totalRent = allUsers.reduce((sum, user) => sum + user.monthlyRent, 0);

    // Get current month rents
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthRents = await Rent.find({ period: currentPeriod });

    const paidRents = currentMonthRents.filter(r => r.status === 'paid');
    const pendingRents = currentMonthRents.filter(r => r.status === 'pending');
    const overdueRents = currentMonthRents.filter(r => r.status === 'overdue');

    const totalCollected = paidRents.reduce((sum, rent) => sum + rent.amount, 0);
    const totalPending = pendingRents.reduce((sum, rent) => sum + rent.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalRent,
        totalCollected,
        totalPending,
        paidCount: paidRents.length,
        pendingCount: pendingRents.length,
        overdueCount: overdueRents.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
