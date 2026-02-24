import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SESSION_KEYS = {
  adminUser: 'user_admin',
  adminToken: 'token_admin',
  userUser: 'user_user',
  userToken: 'token_user',
  activeRole: 'active_role'
}

const getPathRole = (pathname) => {
  if (pathname?.startsWith('/admin')) return 'admin'
  if (pathname?.startsWith('/user')) return 'user'
  return null
}

const getTokenForCurrentRoute = () => {
  const pathRole = getPathRole(window.location.pathname)

  if (pathRole === 'admin') {
    return localStorage.getItem(SESSION_KEYS.adminToken)
  }

  if (pathRole === 'user') {
    return localStorage.getItem(SESSION_KEYS.userToken)
  }

  const activeRole = localStorage.getItem(SESSION_KEYS.activeRole)
  if (activeRole === 'admin') {
    return localStorage.getItem(SESSION_KEYS.adminToken)
  }

  if (activeRole === 'user') {
    return localStorage.getItem(SESSION_KEYS.userToken)
  }

  return localStorage.getItem('token')
}

const clearSessionForCurrentRoute = () => {
  const pathRole = getPathRole(window.location.pathname)

  if (pathRole === 'admin') {
    localStorage.removeItem(SESSION_KEYS.adminToken)
    localStorage.removeItem(SESSION_KEYS.adminUser)
    return
  }

  if (pathRole === 'user') {
    localStorage.removeItem(SESSION_KEYS.userToken)
    localStorage.removeItem(SESSION_KEYS.userUser)
    return
  }

  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getTokenForCurrentRoute()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSessionForCurrentRoute()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwords) => api.put('/auth/updatepassword', passwords)
}

// User APIs
export const userAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getMasterData: () => api.get('/users/master')
}

// Rent APIs
export const rentAPI = {
  getAllRents: () => api.get('/rent'),
  getRentByUser: (userId) => api.get(`/rent/user/${userId}`),
  updateRent: (id, rentData) => api.put(`/rent/${id}`, rentData),
  getRentStats: () => api.get('/rent/stats')
}

// Payment APIs
export const paymentAPI = {
  getAllPayments: (params) => api.get('/payments', { params }),
  getPaymentsByUser: (userId) => api.get(`/payments/user/${userId}`),
  getBillSummary: (userId) => api.get(`/payments/bill-summary/${userId}`),
  createManualPayment: (data) => api.post('/payments/manual', data),
  uploadReceipt: (formData) => api.post('/payments/upload-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  verifyPayment: (id, status) => api.put(`/payments/${id}/verify`, { status }),
  getPaymentStats: () => api.get('/payments/stats'),
  deletePayment: (id) => api.delete(`/payments/${id}`)
}

export default api
