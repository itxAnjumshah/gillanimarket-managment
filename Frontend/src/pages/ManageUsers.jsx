import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react'
import { userAPI } from '../utils/api'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    monthlyRent: '',
    dueDate: '',
    status: 'active'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Fetching users...')
      const response = await userAPI.getAllUsers()
      console.log('Backend response:', response.data)
      
      // Backend returns data directly as array, not data.users
      const allUsers = response.data.data || []
      console.log('All users:', allUsers)
      
      // Filter out admin users
      const regularUsers = allUsers.filter(user => user.role !== 'admin')
      console.log('Regular users (non-admin):', regularUsers)
      
      setUsers(regularUsers)
      setFilteredUsers(regularUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      console.error('Error details:', error.response?.data)
      setError('Failed to fetch users: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      shopName: user.shopName,
      monthlyRent: user.monthlyRent,
      dueDate: user.dueDate || 5,
      status: user.status
    })
    setShowEditModal(true)
    setError('')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await userAPI.updateUser(editingUser._id, editFormData)
      setSuccess('User updated successfully!')
      setShowEditModal(false)
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating user:', error)
      setError(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await userAPI.deleteUser(userToDelete._id)
      setSuccess('User deleted successfully!')
      setShowDeleteModal(false)
      setUserToDelete(null)
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error deleting user:', error)
      setError(error.response?.data?.message || 'Failed to delete user')
      setShowDeleteModal(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View, edit, and manage all shop owners
          </p>
        </div>
        <a
          href="/admin/add-user"
          className="btn btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </a>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-11"
            placeholder="Search by name, email, shop, or phone..."
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `Showing ${filteredUsers.length} of ${users.length} users`}
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Shop Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Monthly Rent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.shopName}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p>{user.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(user.monthlyRent || 0)}
                    </td>
                    <td className="py-3 px-4">{user.dueDate || 5}th of month</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Shop Name *</label>
                    <input
                      type="text"
                      name="shopName"
                      value={editFormData.shopName}
                      onChange={handleEditChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Monthly Rent ($) *</label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={editFormData.monthlyRent}
                      onChange={handleEditChange}
                      className="input"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Due Date (Day of Month) *</label>
                    <select
                      name="dueDate"
                      value={editFormData.dueDate}
                      onChange={handleEditChange}
                      className="input"
                      required
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Status *</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditChange}
                      className="input"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-center mb-2">Delete User</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
