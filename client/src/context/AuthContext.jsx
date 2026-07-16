import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

const AuthContext = createContext(null)

const USER_API_BASE = `${API_URL}/user`

// Set axios to send credentials (cookies) globally
axios.defaults.withCredentials = true

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verify session on page mount
  const checkAuth = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${USER_API_BASE}/verify`)
      if (res.data) {
        setCurrentUser(res.data)
        localStorage.setItem('innovest_user', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Session verification failed, user not logged in.', err.response?.data?.message || err.message)
      setCurrentUser(null)
      localStorage.removeItem('innovest_user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('innovest_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('innovest_user')
      }
    }
    checkAuth()
  }, [])

  // Login handler with admin fallback
  const login = async (usernameOrEmail, password) => {
    try {
      setError(null)
      try {
        // 1. Try normal user login
        const res = await axios.post(`${USER_API_BASE}/login`, {
          username_or_email: usernameOrEmail,
          password: password
        })
        
        if (res.data && res.data.user) {
          const userData = res.data.user
          setCurrentUser(userData)
          localStorage.setItem('innovest_user', JSON.stringify(userData))
          return userData
        }
      } catch (err) {
        // 2. Fall back to admin login if the user wasn't found in normal collection
        const status = err.response?.status
        const msg = err.response?.data?.message || ''
        
        if (status === 404 || msg.toLowerCase().includes('not found')) {
          console.log('User not found in regular users database. Trying Admin login path...')
          const adminRes = await axios.post(`${API_URL}/admin/login`, {
            username_or_email: usernameOrEmail,
            password: password
          })
          if (adminRes.data && adminRes.data.user) {
            const adminData = adminRes.data.user
            setCurrentUser(adminData)
            localStorage.setItem('innovest_user', JSON.stringify(adminData))
            return adminData
          }
        }
        
        // If it's not a 404 or if the admin fallback also throws, propagate the error
        throw err
      }
      throw new Error('Invalid login response')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed'
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  // Register handler using FormData (multipart/form-data)
  const register = async (formData) => {
    try {
      setError(null)
      const res = await axios.post(`${USER_API_BASE}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data?.message || 'Registration successful. Awaiting admin verification.'
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed'
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  // Logout handler
  const logout = async () => {
    try {
      const isAdmin = currentUser && ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)
      const url = isAdmin ? `${API_URL}/admin/logout` : `${USER_API_BASE}/logout`
      await axios.get(url)
    } catch (err) {
      console.warn('Logout API call failed:', err.response?.data?.message || err.message)
    } finally {
      setCurrentUser(null)
      localStorage.removeItem('innovest_user')
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
