// Mock data file - DEPRECATED
// All components now use real backend API data
// This file is kept for reference only and should not be imported

// To use the application:
// 1. Make sure your backend is running on http://localhost:5000
// 2. Run the seeder to create admin account: cd Backend && npm run seed
// 3. Login with: admin@example.com / admin12345
// 4. All data will be fetched from the real database

export const mockUsers = []
export const mockPayments = []
export const mockRentSettings = []

export const getStatistics = () => ({
  totalUsers: 0,
  activeUsers: 0,
  totalRent: 0,
  totalPaid: 0,
  totalDue: 0,
  overdueCount: 0,
  paidCount: 0,
  pendingCount: 0
})

export const getChartData = () => []
export const getRecentPayments = () => []
