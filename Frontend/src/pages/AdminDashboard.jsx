import { useState, useEffect } from 'react'
import {
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import StatCard from '../components/StatCard'
import { paymentAPI, rentAPI } from '../utils/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRent: 0,
    totalPaid: 0,
    totalDue: 0,
    overdueCount: 0,
    paidCount: 0,
    pendingCount: 0
  })
  const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [paymentStatsRes, rentStatsRes, paymentsRes] = await Promise.all([
        paymentAPI.getPaymentStats(),
        rentAPI.getRentStats(),
        paymentAPI.getAllPayments({ status: 'paid', limit: 5 })
      ])

      setStats({
        ...paymentStatsRes.data.data,
        ...rentStatsRes.data.data
      })
      setRecentPayments(paymentsRes.data.data.payments || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { month: 'Aug', collected: stats.totalPaid * 0.9, pending: stats.totalDue * 0.5 },
    { month: 'Sep', collected: stats.totalPaid * 0.95, pending: stats.totalDue * 0.3 },
    { month: 'Oct', collected: stats.totalPaid * 0.92, pending: stats.totalDue * 0.7 },
    { month: 'Nov', collected: stats.totalPaid * 1.05, pending: stats.totalDue * 0.4 },
    { month: 'Dec', collected: stats.totalPaid * 0.98, pending: stats.totalDue * 0.6 },
    { month: 'Jan', collected: stats.totalPaid, pending: stats.totalDue }
  ]

  const paymentStatusData = [
    { name: 'Paid', value: stats.paidCount, color: '#10b981' },
    { name: 'Pending', value: stats.pendingCount, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdueCount, color: '#ef4444' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor all shop rentals and payments
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Monthly Rent"
          value={formatCurrency(stats.totalRent)}
          subtitle={`${stats.activeUsers} active shops`}
          color="primary"
        />
        <StatCard
          icon={CheckCircle}
          title="Total Collected"
          value={formatCurrency(stats.totalPaid)}
          subtitle="This month"
          trend={12.5}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Pending/Due"
          value={formatCurrency(stats.totalDue)}
          subtitle={`${stats.pendingCount} pending payments`}
          color="orange"
        />
        <StatCard
          icon={AlertCircle}
          title="Overdue Payments"
          value={stats.overdueCount}
          subtitle="Requires attention"
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              <Bar dataKey="collected" fill="#0ea5e9" name="Collected" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
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

      {/* Recent Payments Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Payments</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent payments</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Payment ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Shop / User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      {payment._id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {payment.user?.shopName || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.user?.name || 'Unknown'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-sm">
                        {payment.method || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
