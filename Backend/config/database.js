// ============================================
// DATABASE CONFIGURATION
// ============================================
// Tries MONGODB_URI (online) first, then local Compass

const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getInt = (value, fallback) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
};

const LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/gillani-market';
const connectOptions = { serverSelectionTimeoutMS: 6000, socketTimeoutMS: 45000 };
const localOptions = { serverSelectionTimeoutMS: 3000, socketTimeoutMS: 15000 };

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const attempts = getInt(process.env.MONGODB_RETRY_ATTEMPTS, 3);
  const delayMs = getInt(process.env.MONGODB_RETRY_DELAY_MS, 2000);

  // Try online (Atlas) first
  if (mongoUri) {
    for (let i = 1; i <= attempts; i++) {
      try {
        await mongoose.connect(mongoUri, connectOptions);
        console.log('Connected to online');
        return true;
      } catch (err) {
        if (i < attempts) await sleep(delayMs);
      }
    }
  }

  // Fallback: local Compass
  try {
    await mongoose.connect(LOCAL_URI, localOptions);
    console.log('Connected to Compass');
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = connectDB;
