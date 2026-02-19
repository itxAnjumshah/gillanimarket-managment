import { useState, useEffect } from 'react'
import { DollarSign, Search, Edit2, CheckCircle, AlertCircle } from 'lucide-react'
import { userAPI, rentAPI } from '../utils/api'

const SetRent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRent, setNewRent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true)
      const response = await userAPI.getAllUsers()
      // Backend returns data directly as array, not data.users
      setUsers(response.data.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
    } finally {
      setFetchingUsers(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setNewRent(user.monthlyRent.toString())
    setSuccess(false)
    setError('')
  }

  const handleUpdateRent = async () => {
    if (!newRent || parseFloat(newRent) <= 0) {
      setError('Please enter a valid rent amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      await userAPI.updateUser(selectedUser._id, {
        monthlyRent: parseFloat(newRent)
      })
      
      setSuccess(true)

      // Update the local user's rent
      setUsers(users.map(u => 
        u._id === selectedUser._id 
          ? { ...u, monthlyRent: parseFloat(newRent) } 
          : u
      ))

      // Reset after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        setSelectedUser(null)
        setNewRent('')
      }, 2000)
    } catch (error) {
      console.error('Error updating rent:', error)
      setError(error.response?.data?.message || 'Failed to update rent')
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

  return (
    <div className="max-w-5xl">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Set Monthly Rent</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update monthly rent for shop owners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <div className="card p-6">
          <div className="mb-4">
            <label className="label">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-11"
                placeholder="Search by name, shop, or email..."
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {fetchingUsers ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Loading users...
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No users found
              </p>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedUser?._id === user._id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {user.shopName}
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {formatCurrency(user.monthlyRent)}/mo
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Update Form */}
        <div className="card p-6">
          {!selectedUser ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Edit2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">Select a User</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a user from the list to update their monthly rent
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Update Rent Details</h3>

                {/* User Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                        {selectedUser.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{selectedUser.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUser.shopName}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium ">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Current Rent */}
                <div className="mb-4">
                  <label className="label">Current Monthly Rent</label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedUser.monthlyRent)}
                    </p>
                  </div>
                </div>

                {/* New Rent Input */}
                <div>
                  <label className="label">New Monthly Rent ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={newRent}
                      onChange={(e) => {
                        setNewRent(e.target.value)
                        setError('')
                      }}
                      className={`input pl-11 ${error ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {success && (
                  <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Rent updated successfully!</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setNewRent('')
                    setError('')
                    setSuccess(false)
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRent}
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Rent'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SetRent
