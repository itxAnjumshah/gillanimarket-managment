// ============================================
// DATABASE CONFIGURATION
// ============================================
// This file handles the connection to MongoDB database

const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getInt = (value, fallback) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Connect to MongoDB Database
 * This function establishes connection with the database
 * First tries online connection, then falls back to local MongoDB Compass
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const localMongoUri = "mongodb://localhost:27017/gillani-market";

  if (!mongoUri) {
    console.error('❌ Missing environment variable: MONGODB_URI');
    console.error('   Create a `.env` file or set MONGODB_URI in your environment.');

    // In production, fail fast. In development, let the server start so health checks work.
    if (process.env.NODE_ENV === 'production') process.exit(1);
    return false;
  }

  const attempts = getInt(process.env.MONGODB_RETRY_ATTEMPTS, 3);
  const delayMs = getInt(process.env.MONGODB_RETRY_DELAY_MS, 1000);
  const exitOnFail =
    process.env.EXIT_ON_DB_FAIL === 'true' || process.env.NODE_ENV === 'production';

  const connectOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds
  };

  // First try: Online MongoDB Atlas connection
  console.log('🔄 Trying to connect to MongoDB Atlas (Online)...');
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      const conn = await mongoose.connect(mongoUri, connectOptions);
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      console.log(`📊 Database Name: ${conn.connection.name}`);
      console.log(`🌐 Connection Type: Online (Atlas)`);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`❌ Atlas connection attempt ${i}/${attempts} failed: ${error.message}`);

      if (i < attempts) {
        await sleep(delayMs);
      }
    }
  }

  console.log('\n⚠️  Online connection failed. Trying local MongoDB Compass...');

  // Second try: Local MongoDB Compass connection
  try {
    const conn = await mongoose.connect(localMongoUri, {
      serverSelectionTimeoutMS: 3000, // Shorter timeout for local
      socketTimeoutMS: 15000,
    });
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🏠 Connection Type: Local (Compass)`);
    return true;
  } catch (localError) {
    console.error(`❌ Local MongoDB connection failed: ${localError.message}`);
    
    console.error(`\n⚠️  Both connections failed. Check:`);
    console.error(`   🌐 Online (Atlas):`);
    console.error(`     1. Internet connection is active`);
    console.error(`     2. MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)`);
    console.error(`     3. Database credentials are correct`);
    console.error(`     4. Firewall is not blocking connection`);
    console.error(`\n   🏠 Local (Compass):`);
    console.error(`     1. MongoDB is installed and running locally`);
    console.error(`     2. MongoDB Compass is connected to localhost:27017`);
    console.error(`     3. Local MongoDB service is started\n`);

    if (exitOnFail) process.exit(1);
    return false;
  }
};

// Export the function so we can use it in server.js
module.exports = connectDB;
