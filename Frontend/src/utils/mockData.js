// Mock data for the application

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@shop.com',
    shopName: 'Shop #101',
    phone: '+1234567890',
    monthlyRent: 1500,
    role: 'user',
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@shop.com',
    shopName: 'Shop #102',
    phone: '+1234567891',
    monthlyRent: 1800,
    role: 'user',
    status: 'active',
    joinedDate: '2024-02-10'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@shop.com',
    shopName: 'Shop #103',
    phone: '+1234567892',
    monthlyRent: 2000,
    role: 'user',
    status: 'active',
    joinedDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@shop.com',
    shopName: 'Shop #104',
    phone: '+1234567893',
    monthlyRent: 1600,
    role: 'user',
    status: 'inactive',
    joinedDate: '2024-03-05'
  }
]

export const mockPayments = [
  {
    id: 'PAY001',
    userId: '1',
    userName: 'John Doe',
    shopName: 'Shop #101',
    amount: 1500,
    month: 'January 2025',
    date: '2025-01-05',
    status: 'paid',
    method: 'cash',
    receiptUrl: null
  },
  {
    id: 'PAY002',
    userId: '2',
    userName: 'Jane Smith',
    shopName: 'Shop #102',
    amount: 1800,
    month: 'January 2025',
    date: '2025-01-08',
    status: 'paid',
    method: 'cash',
    receiptUrl: 'https://example.com/receipt.pdf'
  },
  {
    id: 'PAY003',
    userId: '3',
    userName: 'Bob Johnson',
    shopName: 'Shop #103',
    amount: 2000,
    month: 'January 2025',
    date: '2025-01-10',
    status: 'paid',
    method: 'bank_transfer',
    receiptUrl: null
  },
  {
    id: 'PAY004',
    userId: '1',
    userName: 'John Doe',
    shopName: 'Shop #101',
    amount: 1500,
    month: 'February 2025',
    date: null,
    status: 'pending',
    method: null,
    receiptUrl: null
  },
  {
    id: 'PAY005',
    userId: '4',
    userName: 'Alice Williams',
    shopName: 'Shop #104',
    amount: 1600,
    month: 'January 2025',
    date: null,
    status: 'overdue',
    method: null,
    receiptUrl: null
  }
]

export const mockRentSettings = [
  {
    id: '1',
    shopName: 'Shop #101',
    monthlyRent: 1500,
    dueDate: 5,
    userId: '1'
  },
  {
    id: '2',
    shopName: 'Shop #102',
    monthlyRent: 1800,
    dueDate: 5,
    userId: '2'
  },
  {
    id: '3',
    shopName: 'Shop #103',
    monthlyRent: 2000,
    dueDate: 5,
    userId: '3'
  },
  {
    id: '4',
    shopName: 'Shop #104',
    monthlyRent: 1600,
    dueDate: 5,
    userId: '4'
  }
]

// Statistics
export const getStatistics = () => {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(u => u.status === 'active').length

  const totalRent = mockRentSettings.reduce((sum, r) => sum + r.monthlyRent, 0)
  const paidPayments = mockPayments.filter(p => p.status === 'paid')
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = mockPayments.filter(p => p.status === 'pending' || p.status === 'overdue')
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  const overdueCount = mockPayments.filter(p => p.status === 'overdue').length

  return {
    totalUsers,
    activeUsers,
    totalRent,
    totalPaid,
    totalDue,
    overdueCount,
    paidCount: paidPayments.length,
    pendingCount: pendingPayments.length
  }
}

// Chart data
export const getChartData = () => {
  return [
    { month: 'Aug', collected: 6200, pending: 800 },
    { month: 'Sep', collected: 6800, pending: 500 },
    { month: 'Oct', collected: 6500, pending: 1200 },
    { month: 'Nov', collected: 7200, pending: 600 },
    { month: 'Dec', collected: 6900, pending: 900 },
    { month: 'Jan', collected: 5300, pending: 1600 }
  ]
}

export const getRecentPayments = () => {
  return mockPayments
    .filter(p => p.status === 'paid')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
}
