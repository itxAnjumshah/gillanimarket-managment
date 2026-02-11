// ============================================
// DATABASE SEEDER
// ============================================
// Usage:
//   npm run seed           -> create admin user (if not exists)
//   npm run seed -- --destroy  -> delete all users (danger)

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');

const getArg = (name) => process.argv.includes(name);

const run = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Seeder aborted: database is not connected.');
    process.exit(1);
  }

  if (getArg('--destroy')) {
    await User.deleteMany({});
    console.log('✅ Deleted all users.');
    await mongoose.connection.close(false);
    process.exit(0);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
  const adminName = process.env.SEED_ADMIN_NAME || 'Admin';
  const adminPhone = process.env.SEED_ADMIN_PHONE || '0000000000';
  const adminShopName = process.env.SEED_ADMIN_SHOP || 'Admin Shop';
  const adminMonthlyRent = Number(process.env.SEED_ADMIN_MONTHLY_RENT || 0);
  const adminDueDate = Number(process.env.SEED_ADMIN_DUE_DATE || 5);

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      shopName: adminShopName,
      monthlyRent: adminMonthlyRent,
      dueDate: adminDueDate,
      role: 'admin',
      status: 'active'
    });

    console.log(`✅ Admin created: ${adminEmail}`);
    console.log('⚠️  Change the default password after first login.');
  }

  await mongoose.connection.close(false);
  process.exit(0);
};

run().catch(async (err) => {
  console.error('❌ Seeder failed:', err?.message || err);
  try {
    await mongoose.connection.close(false);
  } catch (_) {}
  process.exit(1);
});

