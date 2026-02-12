import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  DollarSign,
  CheckCircle,
  AlertCircle,
  Receipt,
  Upload,
  Calendar
} from 'lucide-react'
import StatCard from '../components/StatCard'
import { paymentAPI } from '../utils/api'

const UserDashboard = () => {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const userId = user?.id || user?._id
      const response = await paymentAPI.getPaymentsByUser(userId)
      console.log('User Dashboard Payments:', response.data)
      setPayments(response.data.data || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthlyRent = user?.monthlyRent || 0
  const paidPayments = payments.filter(p => p.status === 'paid')
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue')
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">My Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your rent payments and manage your shop
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="Monthly Rent"
          value={formatCurrency(monthlyRent)}
          subtitle="Due on 5th of every month"
          color="primary"
        />
        <StatCard
          icon={CheckCircle}
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          subtitle={`${paidPayments.length} payments made`}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          title="Amount Due"
          value={formatCurrency(totalDue)}
          subtitle={totalDue > 0 ? 'Payment required' : 'All paid up!'}
          color={totalDue > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/user/bill"
            className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Receipt className="w-6 h-6 text-primary-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold">View Bill</p>
              <p className="text-sm text-gray-500">Check rent & dues</p>
            </div>
          </Link>

          <Link
            to="/user/upload-receipt"
            className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Upload className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold">Upload Receipt</p>
              <p className="text-sm text-gray-500">Cash payment proof</p>
            </div>
          </Link>

          <Link
            to="/user/payment-history"
            className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <Calendar className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold">View History</p>
              <p className="text-sm text-gray-500">All transactions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Payment Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-6">Payment Status</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No payments yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Month
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 font-medium">
                      {payment.month || `${new Date(payment.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(payment.createdAt).getFullYear()}`}
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-4 text-sm">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payment.status !== 'paid' && (
                        <Link
                          to="/user/upload-receipt"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Pay Now →
                        </Link>
                      )}
                      {payment.status === 'paid' && payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          View Receipt
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Shop Info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shop Name</p>
            <p className="font-medium">{user?.shopName || 'Shop #101'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Rent</p>
            <p className="font-medium">{formatCurrency(monthlyRent)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
