// ============================================
// USER CONTROLLER
// ============================================
// Handles user management operations (CRUD)

const User = require('../models/User');

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { role, status, search } = req.query;

    // Build query object
    let query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    // Search in name, email, or shopName
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users from database
    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Private/Admin
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin only)
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, monthlyRent, dueDate, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: password || 'user123', // Default password
      phone,
      shopName,
      monthlyRent,
      dueDate: dueDate || 5,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
 * @route   PUT /api/users/:id
 * @desc    Update user information
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, shopName, monthlyRent, dueDate, status } = req.body;

    // Find user
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (shopName) user.shopName = shopName;
    if (monthlyRent !== undefined) user.monthlyRent = monthlyRent;
    if (dueDate !== undefined) user.dueDate = dueDate;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   GET /api/users/master
 * @desc    Get complete master data of all users with payments
 * @access  Private/Admin
 */
exports.getMasterData = async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    
    // Get all users except admins
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');

    // Get all payments and populate user data
    const allPayments = await Payment.find().populate('user', 'name email shopName');

    // Build comprehensive data for each user
    const masterData = await Promise.all(users.map(async (user) => {
      // Get user's payments
      const userPayments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });

      // Calculate totals
      const totalPaid = userPayments
        .filter(p => p.status === 'paid' || p.status === 'verified')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalPending = userPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalRejected = userPayments
        .filter(p => p.status === 'rejected')
        .reduce((sum, p) => sum + p.amount, 0);

      // Calculate dues (simplified - can be enhanced)
      const monthsPassed = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30));
      const totalDue = (user.monthlyRent || 0) * Math.max(monthsPassed, 1);
      const balance = totalDue - totalPaid;

      return {
        // User Information
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        role: user.role,
        status: user.status,
        
        // Financial Information
        monthlyRent: user.monthlyRent,
        dueDate: user.dueDate,
        totalPaid,
        totalPending,
        totalRejected,
        totalDue,
        balance,
        
        // Account Information
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        
        // Payment Records
        totalPayments: userPayments.length,
        verifiedPayments: userPayments.filter(p => p.status === 'verified' || p.status === 'paid').length,
        pendingPayments: userPayments.filter(p => p.status === 'pending').length,
        rejectedPayments: userPayments.filter(p => p.status === 'rejected').length,
        
        // Recent Payment History (last 5)
        recentPayments: userPayments.slice(0, 5).map(payment => ({
          paymentId: payment._id,
          month: payment.month,
          amount: payment.amount,
          status: payment.status,
          method: payment.paymentMethod,
          date: payment.paymentDate || payment.createdAt,
          receiptFile: payment.receiptFile,
          notes: payment.notes
        })),
        
        // All Payments (complete history)
        allPayments: userPayments.map(payment => ({
          paymentId: payment._id,
          month: payment.month,
          amount: payment.amount,
          status: payment.status,
          method: payment.paymentMethod,
          date: payment.paymentDate || payment.createdAt,
          receiptFile: payment.receiptFile,
          notes: payment.notes,
          verifiedBy: payment.verifiedBy,
          verifiedAt: payment.verifiedAt
        }))
      };
    }));

    // Summary statistics
    const summary = {
      totalUsers: masterData.length,
      activeUsers: masterData.filter(u => u.status === 'active').length,
      inactiveUsers: masterData.filter(u => u.status === 'inactive').length,
      totalRentCollected: masterData.reduce((sum, u) => sum + u.totalPaid, 0),
      totalPendingAmount: masterData.reduce((sum, u) => sum + u.totalPending, 0),
      totalOutstandingBalance: masterData.reduce((sum, u) => sum + Math.max(u.balance, 0), 0),
      totalPayments: allPayments.length,
      verifiedPayments: allPayments.filter(p => p.status === 'verified' || p.status === 'paid').length,
      pendingPayments: allPayments.filter(p => p.status === 'pending').length,
      rejectedPayments: allPayments.filter(p => p.status === 'rejected').length
    };

    res.status(200).json({
      success: true,
      message: 'Master data retrieved successfully',
      summary,
      data: masterData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
