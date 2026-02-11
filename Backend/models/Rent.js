// ============================================
// RENT MODEL
// ============================================
// This stores rent information for each user

const mongoose = require('mongoose');

// Define the Rent Schema
const rentSchema = new mongoose.Schema(
  {
    // Reference to the User who pays this rent
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to User model
      required: true
    },

    // Monthly rent amount
    amount: {
      type: Number,
      required: [true, 'Please provide rent amount'],
      min: 0
    },

    // Month and year for this rent (e.g., "2024-02")
    period: {
      type: String,
      required: true
    },

    // Day when rent is due
    dueDate: {
      type: Number,
      required: true,
      min: 1,
      max: 31
    },

    // Status of the rent
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Create index for faster queries
rentSchema.index({ user: 1, period: 1 });

// Export the Rent model
module.exports = mongoose.model('Rent', rentSchema);
