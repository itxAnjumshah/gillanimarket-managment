import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react'

const BillView = () => {
  const { user } = useAuth()
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBillSummary()
  }, [user])

  const fetchBillSummary = async () => {
    try {
      setLoading(true)
      const userId = user?.id || user?._id
      const response = await api.get(`/payments/bill-summary/${userId}`)
      
      if (response.data.success) {
        setBillData(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bill information')
      console.error('Error fetching bill:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      paid: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        icon: <CheckCircle size={14} />,
        label: 'Paid'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: <Clock size={14} />,
        label: 'Pending'
      },
      overdue: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: <XCircle size={14} />,
        label: 'Overdue'
      },
      failed: {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-800 dark:text-gray-300',
        icon: <XCircle size={14} />,
        label: 'Failed'
      }
    }

    const badge = badges[status] || badges.pending

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Rent Bill Summary
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your monthly rent and payment history
        </p>
      </div>

      {/* Shop Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Shop Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Shop Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {billData?.user?.shopName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Owner Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {billData?.user?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {billData?.user?.phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Bill Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Rent */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Monthly Rent</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(billData?.monthlyRent)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign size={32} />
            </div>
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(billData?.totalPaid)}
              </p>
              <p className="text-green-100 text-xs mt-1">
                ({billData?.paymentCount || 0} payments)
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle size={32} />
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Verification</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(billData?.totalPending)}
              </p>
              <p className="text-yellow-100 text-xs mt-1">
                ({billData?.pendingCount || 0} pending)
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Receipt size={24} />
            Payment History
          </h2>
        </div>

        <div className="overflow-x-auto">
          {billData?.recentPayments?.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {billData.recentPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.paymentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {payment.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {payment.paymentMethod?.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.receiptUrl ? (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          <FileText size={16} />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No receipt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No payment history available
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Your payment records will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Payment Information
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              This system shows read-only bill information and payment history. 
              To make a payment, please contact the administrator or upload your receipt 
              through the "Upload Receipt" page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillView
