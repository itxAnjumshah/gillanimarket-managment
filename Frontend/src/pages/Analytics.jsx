import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { userAPI } from '../utils/api'

const Analytics = () => {
  const [masterData, setMasterData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getMasterData()
      console.log('Master Data:', response.data)
      setMasterData(response.data)
    } catch (error) {
      console.error('Error fetching master data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!masterData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  const { summary, data: users } = masterData

  // Prepare monthly data for charts
  const monthlyData = {}
  users.forEach(user => {
    user.allPayments.forEach(payment => {
      const month = payment.month || new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          totalAmount: 0,
          verified: 0,
          pending: 0,
          rejected: 0,
          count: 0
        }
      }
      
      monthlyData[month].totalAmount += payment.amount
      monthlyData[month].count += 1
      
      if (payment.status === 'verified' || payment.status === 'paid') {
        monthlyData[month].verified += payment.amount
      } else if (payment.status === 'pending') {
        monthlyData[month].pending += payment.amount
      } else if (payment.status === 'rejected') {
        monthlyData[month].rejected += payment.amount
      }
    })
  })

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month)
    const dateB = new Date(b.month)
    return dateA - dateB
  })

  // User-wise data for bar chart
  const userChartData = users.map(user => ({
    name: user.shopName || user.name,
    paid: user.totalPaid,
    pending: user.totalPending,
    balance: Math.max(user.balance, 0)
  })).slice(0, 10) // Top 10 users

  // Status distribution for pie chart
  const statusData = [
    { name: 'Verified', value: summary.verifiedPayments, color: '#10b981' },
    { name: 'Pending', value: summary.pendingPayments, color: '#f59e0b' },
    { name: 'Rejected', value: summary.rejectedPayments, color: '#ef4444' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive view of all users, payments, and financial data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold mt-2">{summary.totalUsers}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {summary.activeUsers} active
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalRentCollected)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {summary.verifiedPayments} payments
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalPendingAmount)}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                {summary.pendingPayments} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding Balance</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalOutstandingBalance)}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Due amount
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="verified" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Verified"
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User-wise Comparison Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Top 10 Users - Payment Breakdown</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={userChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="paid" fill="#10b981" name="Paid" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            <Bar dataKey="balance" fill="#ef4444" name="Balance Due" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed User Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">All Users - Detailed View</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Shop Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Monthly Rent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Total Paid</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Pending</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Payments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium">{user.shopName || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(user.monthlyRent)}</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">
                    {formatCurrency(user.totalPaid)}
                  </td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400 font-semibold">
                    {formatCurrency(user.totalPending)}
                  </td>
                  <td className="py-3 px-4 text-red-600 dark:text-red-400 font-semibold">
                    {formatCurrency(Math.max(user.balance, 0))}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm space-y-1">
                      <p className="text-green-600 dark:text-green-400">✓ {user.verifiedPayments}</p>
                      <p className="text-yellow-600 dark:text-yellow-400">⏳ {user.pendingPayments}</p>
                      <p className="text-red-600 dark:text-red-400">✗ {user.rejectedPayments}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
