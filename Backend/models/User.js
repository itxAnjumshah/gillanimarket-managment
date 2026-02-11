// ============================================
// USER MODEL
// ============================================
// This defines the structure of User data in database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema (like a blueprint)
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },

    // User's email (must be unique)
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },

    // User's password (will be encrypted)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Don't return password by default
    },

    // User's phone number
    phone: {
      type: String,
      required: [true, 'Please provide a phone number']
    },

    // Shop name or number
    shopName: {
      type: String,
      required: [true, 'Please provide a shop name']
    },

    // Monthly rent amount
    monthlyRent: {
      type: Number,
      required: [true, 'Please provide monthly rent'],
      min: 0
    },

    // Day of month when rent is due (1-31)
    dueDate: {
      type: Number,
      default: 5,
      min: 1,
      max: 31
    },

    // Role: 'admin' or 'user'
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    // Account status
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
  }
);

// MIDDLEWARE: Encrypt password before saving to database
userSchema.pre('save', async function () {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) return;

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// METHOD: Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
