import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

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

const getStoredUserByRole = (role) => {
  const key = role === 'admin' ? SESSION_KEYS.adminUser : SESSION_KEYS.userUser
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const resolveUserFromRoute = () => {
    const pathRole = getPathRole(location.pathname)

    if (pathRole) {
      return getStoredUserByRole(pathRole)
    }

    const activeRole = localStorage.getItem(SESSION_KEYS.activeRole)
    if (activeRole) {
      return getStoredUserByRole(activeRole)
    }

    return getStoredUserByRole('admin') || getStoredUserByRole('user')
  }

  useEffect(() => {
    setUser(resolveUserFromRoute())
    setLoading(false)
  }, [location.pathname])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Real API call
      const response = await authAPI.login({ email, password })

      if (response.data.success) {
        const userData = response.data.data.user
        const token = response.data.data.token
        const role = userData.role
        const userKey = role === 'admin' ? SESSION_KEYS.adminUser : SESSION_KEYS.userUser
        const tokenKey = role === 'admin' ? SESSION_KEYS.adminToken : SESSION_KEYS.userToken

        setUser(userData)
        localStorage.setItem(userKey, JSON.stringify(userData))
        localStorage.setItem(tokenKey, token)
        localStorage.setItem(SESSION_KEYS.activeRole, role)
        return { success: true, user: userData }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    const pathRole = getPathRole(location.pathname)
    const activeRole = pathRole || localStorage.getItem(SESSION_KEYS.activeRole)

    if (activeRole === 'admin') {
      localStorage.removeItem(SESSION_KEYS.adminUser)
      localStorage.removeItem(SESSION_KEYS.adminToken)
    } else if (activeRole === 'user') {
      localStorage.removeItem(SESSION_KEYS.userUser)
      localStorage.removeItem(SESSION_KEYS.userToken)
    }

    const nextUser = getStoredUserByRole('admin') || getStoredUserByRole('user')

    if (nextUser) {
      localStorage.setItem(SESSION_KEYS.activeRole, nextUser.role)
      setUser(nextUser)
    } else {
      localStorage.removeItem(SESSION_KEYS.activeRole)
      setUser(null)
    }
  }

  const getUserForRoles = (allowedRoles = []) => {
    const pathRole = getPathRole(location.pathname)

    if (pathRole && allowedRoles.includes(pathRole)) {
      return getStoredUserByRole(pathRole)
    }

    for (const role of allowedRoles) {
      const roleUser = getStoredUserByRole(role)
      if (roleUser) return roleUser
    }

    return null
  }

  const value = {
    user,
    login,
    logout,
    getUserForRoles,
    loading,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
