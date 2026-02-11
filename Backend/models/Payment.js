// ============================================
// PAYMENT MODEL
// ============================================
// This stores all payment transactions

const mongoose = require('mongoose');

// Define the Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    // Reference to the User who made this payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to User model
      required: true
    },

    // Payment amount
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: 0
    },

    // Month and year this payment is for (e.g., "January 2024")
    month: {
      type: String,
      required: true
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank', 'online', 'other'],
      default: 'cash'
    },

    // Receipt file path (if uploaded)
    receiptFile: {
      type: String,
      default: null
    },

    // Additional notes
    notes: {
      type: String,
      default: ''
    },

    // Payment status
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },

    // Date when payment was made
    paymentDate: {
      type: Date,
      default: Date.now
    },

    // Verified by admin (reference to admin user)
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Verification date
    verifiedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create index for faster queries
paymentSchema.index({ user: 1, month: -1 });
paymentSchema.index({ status: 1 });

// Export the Payment model
module.exports = mongoose.model('Payment', paymentSchema);
