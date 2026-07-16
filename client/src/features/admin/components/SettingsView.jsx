import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Shield, Mail, User, Info, Phone, Globe, BookOpen, Layers, Save, CheckCircle } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useAuth } from '../../../context/AuthContext'
import { API_URL } from '../../../config/api'

const API = API_URL

export default function SettingsView({ currentUser }) {
  const { checkAuth } = useAuth()
  
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role)
  
  // Local state for editable fields
  const [firstName, setFirstName] = useState(currentUser?.first_name || '')
  const [lastName, setLastName]   = useState(currentUser?.last_name || '')
  const [phone, setPhone]         = useState(currentUser?.phone || '')
  const [country, setCountry]     = useState(currentUser?.country || '')
  const [experience, setExperience] = useState(currentUser?.experience || '')
  const [preferences, setPreferences] = useState(
    currentUser?.investment_preferences?.join(', ') || ''
  )
  
  // UI states
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: string }

  // Sync state if currentUser changes
  useEffect(() => {
    setFirstName(currentUser?.first_name || '')
    setLastName(currentUser?.last_name || '')
    setPhone(currentUser?.phone || '')
    setCountry(currentUser?.country || '')
    setExperience(currentUser?.experience || '')
    setPreferences(currentUser?.investment_preferences?.join(', ') || '')
  }, [currentUser])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
      }

      if (!isAdmin) {
        payload.phone = phone
        payload.country = country
        payload.experience = experience
        if (currentUser?.role === 'INVESTOR') {
          payload.investment_preferences = preferences
            .split(',')
            .map(p => p.trim())
            .filter(Boolean)
        }
      }

      const endpoint = isAdmin
        ? `${API}/admin/${currentUser.admin_id || currentUser.id}`
        : `${API}/user/${currentUser.id}`

      const { data } = await axios.put(endpoint, payload)
      
      // Update session details in App state
      await checkAuth()
      
      setMessage({
        type: 'success',
        text: data.message || 'Profile updated successfully!',
      })
    } catch (err) {
      console.error(err)
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profile & Workspace Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Manage credentials, configure profile preferences, and view platform permissions</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-250/30'
            : 'bg-rose-50 text-rose-800 border-rose-250/30'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <Info className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 bg-white border-slate-200" hoverable={false}>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary-500" />
              General Information
            </h3>

            {/* Read-Only Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Username</span>
                <p className="text-xs font-bold text-slate-700">{currentUser?.username || '—'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Email Address</span>
                <p className="text-xs font-bold text-slate-700">{currentUser?.email || '—'}</p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label="Last Name"
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
              />
            </div>

            {!isAdmin && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Country"
                    id="country"
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    leftIcon={<Globe className="h-4 w-4" />}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="experience" className="text-xs font-bold text-slate-600 block">
                    Bio / Experience Background
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-400">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <textarea
                      id="experience"
                      rows={3}
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400 leading-relaxed"
                      placeholder="Describe your corporate background, previous ventures, or startup goals..."
                    />
                  </div>
                </div>

                {currentUser?.role === 'INVESTOR' && (
                  <Input
                    label="Investment Preferences (Comma-separated sectors)"
                    id="preferences"
                    type="text"
                    value={preferences}
                    onChange={e => setPreferences(e.target.value)}
                    leftIcon={<Layers className="h-4 w-4" />}
                    placeholder="e.g. Biotech, Cleantech, FinTech, SaaS"
                  />
                )}
              </>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" loading={saving} leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Roles & Audit Info */}
        <div className="space-y-6">
          
          {/* Permissions Audit Card */}
          <Card className="p-6 space-y-4 bg-white border-slate-200" hoverable={false}>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" />
              Role & Permissions
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                <span>Account Role:</span>
                <span className="text-primary-600 uppercase bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                  {currentUser?.role || 'MEMBER'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                <span>Vetting Status:</span>
                <span className={`uppercase border px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  currentUser?.is_verified || isAdmin
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    : 'text-amber-600 bg-amber-50 border-amber-100'
                }`}>
                  {currentUser?.is_verified || isAdmin ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Assigned Scope Keys</span>
              <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-1.5 bg-slate-50 border border-slate-150 rounded-xl">
                {(currentUser?.permissions || []).map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono text-[9px] font-bold">
                    {p}
                  </span>
                ))}
                {(currentUser?.permissions || []).length === 0 && (
                  <span className="text-[10px] text-slate-400 italic">No special scopes assigned</span>
                )}
              </div>
            </div>
          </Card>

          {/* System Info */}
          <Card className="p-6 bg-slate-50 border-slate-200 flex gap-3.5" hoverable={false}>
            <Info className="h-5 w-5 text-slate-400 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Workspace Security Notice</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Critical account settings (usernames, email addresses, verification status, and workspace permission scopes) are locked. These can only be changed by a Super Administrator.
              </p>
            </div>
          </Card>

        </div>

      </form>

    </div>
  )
}
