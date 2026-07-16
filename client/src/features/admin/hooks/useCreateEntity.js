import { useState } from 'react'
import { useAdmin } from '../../../context/AdminContext'

export default function useCreateEntity(onClose) {
  const { createAdmin, createMember, createCommunity } = useAdmin()
  const [activeType, setActiveType] = useState('community') // 'community', 'admin', 'member'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // 1. Community Form States
  const [commName, setCommName] = useState('')
  const [commDesc, setCommDesc] = useState('')
  const [commTags, setCommTags] = useState('')
  const [commImage, setCommImage] = useState('')

  // 2. Admin Form States
  const [adminUname, setAdminUname] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPass, setAdminPass] = useState('')

  // 3. Member Form States
  const [mFirst, setMFirst] = useState('')
  const [mLast, setMLast] = useState('')
  const [mUname, setMUname] = useState('')
  const [mEmail, setMEmail] = useState('')
  const [mPhone, setMPhone] = useState('')
  const [mCountry, setMCountry] = useState('')
  const [mNid, setMNid] = useState('')
  const [mPass, setMPass] = useState('')
  const [mRole, setMRole] = useState('ENTREPRENEUR')
  const [mFile, setMFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMFile(e.target.files[0])
    }
  }

  const resetAllStates = () => {
    setError(null)
    setSuccess(null)
    // reset community
    setCommName('')
    setCommDesc('')
    setCommTags('')
    setCommImage('')
    // reset admin
    setAdminUname('')
    setAdminEmail('')
    setAdminPass('')
    // reset member
    setMFirst('')
    setMLast('')
    setMUname('')
    setMEmail('')
    setMPhone('')
    setMCountry('')
    setMNid('')
    setMPass('')
    setMFile(null)
  }

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (activeType === 'community') {
        const parsedTags = commTags ? commTags.split(',').map(t => t.trim()).filter(Boolean) : []
        await createCommunity({
          community_name: commName,
          description: commDesc,
          image_url: commImage || 'https://i.ibb.co/6WtQfMm/default.png',
          tags: parsedTags
        })
        setSuccess('Community created successfully!')
      } else if (activeType === 'admin') {
        await createAdmin({
          username: adminUname,
          email: adminEmail,
          password: adminPass
        })
        setSuccess('Administrator registered successfully!')
      } else if (activeType === 'member') {
        const formData = new FormData()
        formData.append('first_name', mFirst)
        formData.append('last_name', mLast)
        formData.append('username', mUname)
        formData.append('email', mEmail)
        formData.append('password', mPass)
        formData.append('phone', mPhone)
        formData.append('role', mRole)
        formData.append('country', mCountry)
        formData.append('national_id', mNid)
        if (mFile) {
          formData.append('documents', mFile)
        }
        await createMember(formData)
        setSuccess('Member account registered successfully!')
      }

      setTimeout(() => {
        resetAllStates()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete action')
    } finally {
      setLoading(false)
    }
  }

  return {
    activeType,
    setActiveType,
    loading,
    error,
    setError,
    success,
    setSuccess,
    commName,
    setCommName,
    commDesc,
    setCommDesc,
    commTags,
    setCommTags,
    commImage,
    setCommImage,
    adminUname,
    setAdminUname,
    adminEmail,
    setAdminEmail,
    adminPass,
    setAdminPass,
    mFirst,
    setMFirst,
    mLast,
    setMLast,
    mUname,
    setMUname,
    mEmail,
    setMEmail,
    mPhone,
    setMPhone,
    mCountry,
    setMCountry,
    mNid,
    setMNid,
    mPass,
    setMPass,
    mRole,
    setMRole,
    mFile,
    handleFileChange,
    resetAllStates,
    handleFormSubmit
  }
}
