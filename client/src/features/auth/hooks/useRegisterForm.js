import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

export default function useRegisterForm(onNavigate) {
  const { register } = useAuth()
  
  // Pipeline Step State
  const [step, setStep] = useState(1)

  // Registration Form States
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [role, setRole] = useState('ENTREPRENEUR')
  const [nationalId, setNationalId] = useState('')
  const [documentFile, setDocumentFile] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [regError, setRegError] = useState(null)
  const [regSuccess, setRegSuccess] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0])
    }
  }

  // Basic client-side validation per step
  const isStep1Valid = () => {
    return firstName.trim().length >= 3 && 
           lastName.trim().length >= 3 && 
           phone.trim().length >= 10 && 
           country.trim().length >= 3
  }

  const isStep2Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return username.trim().length >= 3 && 
           emailRegex.test(email) && 
           password.length >= 3
  }

  const isStep3Valid = () => {
    return nationalId.trim().length >= 3
  }

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2)
    } else if (step === 2 && isStep2Valid()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!isStep3Valid()) {
      setRegError('Please provide your National ID for verification.')
      return
    }
    
    setLoading(true)
    setRegError(null)
    setRegSuccess(null)

    // Build FormData payload
    const formData = new FormData()
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('phone', phone)
    formData.append('role', role.toUpperCase())
    formData.append('country', country)
    formData.append('national_id', nationalId)
    
    if (documentFile) {
      formData.append('documents', documentFile)
    }

    try {
      const msg = await register(formData)
      setRegSuccess(msg || 'Registration submitted! Awaiting administrator approval.')
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please check your data.')
    } finally {
      setLoading(false)
    }
  }

  return {
    step,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    country,
    setCountry,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    nationalId,
    setNationalId,
    documentFile,
    handleFileChange,
    loading,
    regError,
    regSuccess,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    handleNextStep,
    handlePrevStep,
    handleSubmit
  }
}
