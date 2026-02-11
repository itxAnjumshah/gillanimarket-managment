const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock users data
const users = [
  {
    _id: '1',
    email: 'admin@shop.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'admin',
    name: 'Admin User',
    shopNumber: 'Admin',
    isActive: true
  },
  {
    _id: '2', 
    email: 'user@shop.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // user123
    role: 'user',
    name: 'Test User',
    shopNumber: 'Shop-001',
    isActive: true
  }
];

// Simple password verification (for demo)
const verifyPassword = (plaintext, hashed) => {
  // For demonstration, we'll accept admin123 and user123
  return (plaintext === 'admin123' || plaintext === 'user123');
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, 'shop-rent-secret-key-2024', { expiresIn: '30d' });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          shopNumber: user.shopNumber,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user profile
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'shop-rent-secret-key-2024');
    const user = users.find(u => u._id === decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        shopNumber: user.shopNumber,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Mock data endpoints
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users.map(u => ({
      _id: u._id,
      email: u.email,
      role: u.role,
      name: u.name,
      shopNumber: u.shopNumber,
      isActive: u.isActive
    }))
  });
});

app.get('/api/rent', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server running' });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log('✅ Mock server running on port ' + PORT);
  console.log('📝 Demo credentials:');
  console.log('   Admin: admin@shop.com / admin123');
  console.log('   User: user@shop.com / user123');
});