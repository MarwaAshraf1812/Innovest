import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

export default function useLoginForm(onNavigate) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setLoginError(null)
    try {
      await login(email, password)
      onNavigate('dashboard')
    } catch (err) {
      setLoginError(err.message || 'Failed to authenticate')
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    loginError,
    handleSubmit
  }
}
