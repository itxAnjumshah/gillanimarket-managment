import { useState, useEffect } from 'react'
import { FileText, Download, Filter, Calendar } from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { paymentAPI, rentAPI, userAPI } from '../utils/api'

const Reports = () => {
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalDue: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0
  })
  const [payments, setPayments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [paymentStatsRes, paymentsRes, usersRes] = await Promise.all([
        paymentAPI.getPaymentStats(),
        paymentAPI.getAllPayments(),
        userAPI.getAllUsers()
      ])

      setStats(paymentStatsRes.data.data)
      setPayments(paymentsRes.data.data.payments || [])
      setUsers(usersRes.data.data.users || [])
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Payment status data for pie chart
  const paymentStatusData = [
    { name: 'Paid', value: stats.paidCount, color: '#10b981' },
    { name: 'Pending', value: stats.pendingCount, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdueCount, color: '#ef4444' }
  ]

  // Monthly trend data
  const monthlyTrendData = [
    { month: 'Aug', paid: 6200, due: 800 },
    { month: 'Sep', paid: 6800, due: 500 },
    { month: 'Oct', paid: 6500, due: 1200 },
    { month: 'Nov', paid: 7200, due: 600 },
    { month: 'Dec', paid: 6900, due: 900 },
    { month: 'Jan', paid: 5300, due: 1600 }
  ]

  // Top users by payment
  const topUsers = users
    .map(user => {
      const userPayments = payments.filter(p => p.user?._id === user._id && p.status === 'paid')
      const totalPaid = userPayments.reduce((sum, p) => sum + p.amount, 0)
      return { ...user, totalPaid }
    })
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 5)

  // Defaulters list
  const defaulters = payments
    .filter(p => p.status === 'overdue')
    .map(p => ({
      ...p,
      user: users.find(u => u._id === p.user?._id)
    }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-gray-500">Loading report data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive payment and revenue insights
          </p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Report Type</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input pl-11"
              >
                <option value="overview">Overview</option>
                <option value="payments">Payment Analysis</option>
                <option value="users">User Performance</option>
                <option value="defaulters">Defaulters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input pl-11"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Filter By</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="input pl-11">
                <option value="all">All Shops</option>
                <option value="shop101">Shop #101</option>
                <option value="shop102">Shop #102</option>
                <option value="shop103">Shop #103</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold mb-2">{formatCurrency(stats.totalPaid)}</p>
          <p className="text-xs text-green-600">↑ 12.5% from last month</p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Collection Rate</p>
          <p className="text-2xl font-bold mb-2">
            {payments.length > 0 ? ((stats.paidCount / payments.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-green-600">↑ 3.2% from last month</p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Payment Time</p>
          <p className="text-2xl font-bold mb-2">3.2 days</p>
          <p className="text-xs text-green-600">↓ 0.8 days improvement</p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Outstanding</p>
          <p className="text-2xl font-bold mb-2">{formatCurrency(stats.totalDue)}</p>
          <p className="text-xs text-red-600">↑ {stats.overdueCount} overdue</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold mb-6">Payment Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="paid"
                stroke="#10b981"
                strokeWidth={2}
                name="Paid"
              />
              <Line
                type="monotone"
                dataKey="due"
                stroke="#ef4444"
                strokeWidth={2}
                name="Due"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users & Defaulters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Paying Users */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Top Paying Shops</h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.shopName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(user.totalPaid)}</p>
                  <p className="text-xs text-gray-500">Total Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defaulters List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Overdue Payments</h3>
          <div className="space-y-4">
            {defaulters.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No overdue payments
              </p>
            ) : (
              defaulters.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <div>
                    <p className="font-medium">{payment.user?.shopName || 'Unknown Shop'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.month || new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{formatCurrency(payment.amount)}</p>
                    <span className="text-xs text-red-600">Overdue</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-6">Detailed Payment Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Shop</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Monthly Rent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Paid (YTD)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Due</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Performance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userPaidPayments = payments.filter(p => p.user?._id === user._id && p.status === 'paid')
                const userDuePayments = payments.filter(p => p.user?._id === user._id && p.status !== 'paid')
                const totalPaid = userPaidPayments.reduce((sum, p) => sum + p.amount, 0)
                const totalDue = userDuePayments.reduce((sum, p) => sum + p.amount, 0)
                const userPaymentsTotal = payments.filter(p => p.user?._id === user._id).length
                const performance = userPaymentsTotal > 0 ? (userPaidPayments.length / userPaymentsTotal) * 100 : 0

                return (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.shopName}</p>
                        <p className="text-sm text-gray-500">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(user.monthlyRent)}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{formatCurrency(totalPaid)}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">{formatCurrency(totalDue)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              performance >= 80 ? 'bg-green-500' : performance >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{performance.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
