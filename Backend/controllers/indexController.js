// Root controller (welcome/health-like endpoints)

exports.getApiRoot = (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Shop Rent Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      rent: '/api/rent',
      payments: '/api/payments',
    },
  });
};

