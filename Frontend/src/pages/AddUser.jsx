import { useState, useEffect } from 'react'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { userAPI } from '../utils/api'

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    monthlyRent: '',
    dueDate: '5'
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    fetchRecentUsers()
  }, [])

  const fetchRecentUsers = async () => {
    try {
      const response = await userAPI.getAllUsers({ limit: 3 })
      setRecentUsers(response.data.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required'
    }

    if (!formData.monthlyRent) {
      newErrors.monthlyRent = 'Monthly rent is required'
    } else if (formData.monthlyRent <= 0) {
      newErrors.monthlyRent = 'Monthly rent must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      await userAPI.createUser(formData)
      setSuccess(true)

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        shopName: '',
        monthlyRent: '',
        dueDate: '5'
      })

      // Refresh recent users list
      fetchRecentUsers()

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error creating user:', error)
      const errorMessage = error.response?.data?.message || 'Failed to add user'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New User</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new shop owner account
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">User added successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {errors.submit && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{errors.submit}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@shop.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Minimum 6 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Shop Name/Number *</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className={`input ${errors.shopName ? 'border-red-500' : ''}`}
                  placeholder="Shop #101"
                />
                {errors.shopName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.shopName}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Monthly Rent ($) *</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  className={`input ${errors.monthlyRent ? 'border-red-500' : ''}`}
                  placeholder="1500"
                  min="0"
                  step="0.01"
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.monthlyRent}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Due Date (Day of Month)</label>
                <select
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  shopName: '',
                  monthlyRent: '',
                  dueDate: '5'
                })
                setErrors({})
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding User...
                </span>
              ) : (
                'Add User'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Users */}
      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
        <div className="space-y-3">
          {recentUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users yet</p>
          ) : (
            recentUsers.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.shopName} • {user.email}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  ${user.monthlyRent}/mo
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AddUser
