// Quick API Test Script
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🔍 Testing API Endpoints...\n');

    // Test 1: Login as admin
    console.log('1. Testing Admin Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'admin12345'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      const token = loginResponse.data.token;
      console.log('Token received:', token.substring(0, 20) + '...\n');

      // Test 2: Get all users
      console.log('2. Testing Get All Users...');
      const usersResponse = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Users fetched successfully!');
      console.log('Total users:', usersResponse.data.count);
      console.log('Response structure:', Object.keys(usersResponse.data));
      console.log('\nUsers data:');
      console.log(JSON.stringify(usersResponse.data, null, 2));

      if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
        console.log('\n📊 User List:');
        usersResponse.data.data.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.shopName} - $${user.monthlyRent}/mo`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testAPI();
