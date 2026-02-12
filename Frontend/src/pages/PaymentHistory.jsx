import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Search, Download, Eye, Filter } from 'lucide-react'
import { paymentAPI } from '../utils/api'

const PaymentHistory = () => {
  const { user, isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [payments, setPayments] = useState([])
  const [totalPayments, setTotalPayments] = useState(0)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    fetchPayments()
  }, [currentPage, statusFilter, user])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }

      let response
      if (isAdmin) {
        response = await paymentAPI.getAllPayments(params)
      } else {
        response = await paymentAPI.getPaymentsByUser(user?.id || user?._id)
      }

      console.log('Payment Response:', response.data)
      setPayments(response.data.data || [])
      setTotalPayments(response.data.count || 0)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Apply search filter on client side
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.user?.shopName?.toLowerCase().includes(searchLower) ||
      payment.user?.name?.toLowerCase().includes(searchLower) ||
      payment._id?.toLowerCase().includes(searchLower)
    )
  })

  // Pagination
  const totalPages = Math.ceil(totalPayments / itemsPerPage)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
      case 'overdue':
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
    }
  }

  const getMethodBadge = (method) => {
    if (!method) return null
    
    const methodConfig = {
      'cash': {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-400',
        label: 'Cash'
      },
      'bank_transfer': {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-800 dark:text-purple-400',
        label: 'Bank Transfer'
      }
    }

    const config = methodConfig[method] || methodConfig['cash']

    return (
      <span className={`px-2 py-1 text-xs rounded-md font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment History</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isAdmin ? 'View all payment transactions' : 'Track your payment history'}
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-11"
                placeholder="Search by shop, name, or payment ID..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="input pl-11"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `Showing ${filteredPayments.length} of ${totalPayments} payments`}
          </p>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading payments...</div>
          ) : (
            <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Payment ID
                </th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Shop / User
                  </th>
                )}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Month
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
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">
                        {payment._id?.slice(-6) || 'N/A'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {payment.user?.shopName || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.user?.name || 'Unknown'}
                          </p>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div className="font-medium">
                        {payment.month || `${new Date(payment.createdAt).toLocaleString('default', { month: 'long' })} ${new Date(payment.createdAt).getFullYear()}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {getMethodBadge(payment.paymentMethod || payment.method)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payment.receiptFile || payment.receiptUrl ? (
                        <button 
                          onClick={() => window.open(`http://localhost:5000/${payment.receiptFile || payment.receiptUrl}`, '_blank')}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistory
