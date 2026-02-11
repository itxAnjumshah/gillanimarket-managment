// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
// This protects routes that require login

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect Routes - Check if user is logged in
 * This middleware runs before protected route handlers
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if account is active
    if (req.user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive'
      });
    }

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.'
    });
  }
};

/**
 * Authorize Roles - Check if user has required role
 * Usage: authorize('admin') or authorize('admin', 'user')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
