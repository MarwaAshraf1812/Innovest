import React, { useState, useEffect } from 'react'
import { Shield, Plus, X, Trash2, Mail, Lock, User, ShieldCheck, Calendar } from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'
import useAuthRole from '../hooks/useAuthRole'

export default function SubAdminsView() {
  const { isSuperAdmin } = useAuthRole()
  const { admins, fetchAdmins, createAdmin, deleteAdmin } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  // Pagination
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(admins.length / PAGE_SIZE)
  const paged = admins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins().finally(() => setLoading(false))
    }
  }, [isSuperAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      await createAdmin({ username, email, password, role: 'ADMIN' })
      setFormSuccess('Administrator account created successfully.')
      setUsername('')
      setEmail('')
      setPassword('')
      setTimeout(() => {
        setShowForm(false)
        setFormSuccess(null)
      }, 1800)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create administrator.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (adminId) => {
    if (!window.confirm('Remove this administrator?')) return
    try {
      await deleteAdmin(adminId)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove administrator.')
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-105">
          <ShieldCheck className="h-6 w-6 text-rose-500" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Access Denied</p>
        <p className="text-xs text-slate-400 max-w-sm">
          You do not have permission to view or manage platform administrators.
        </p>
      </div>
    )
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Platform Admins</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage platform moderators and administrators</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors cursor-pointer border-none whitespace-nowrap shrink-0"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 w-full">
          <h3 className="text-sm font-bold text-slate-900">Register New Administrator</h3>

          {formError && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              {formSuccess}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                id="aUsername"
                type="text"
                required
                placeholder="moderator_sam"
                value={username}
                onChange={e => setUsername(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email"
                id="aEmail"
                type="email"
                required
                placeholder="sam@innovest.co"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
            
            <Input
              label="Password"
              id="aPassword"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Button type="submit" variant="primary" loading={formLoading} className="w-full font-semibold">
              Create Administrator
            </Button>
          </form>
        </div>
      )}

      {/* Grid of admin cards */}
      {admins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ShieldCheck className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No administrators yet</p>
          <p className="text-xs text-slate-400">Add your first admin using the button above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map(admin => (
              <div key={admin.admin_id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
                      <Shield className="h-4.5 w-4.5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
                        {admin.first_name || 'System'} {admin.last_name || 'Staff'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">@{admin.username}</p>
                    </div>
                  </div>

                  {admin.username !== 'admin' ? (
                    <button
                      onClick={() => handleDelete(admin.admin_id)}
                      className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
                      title="Remove administrator"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic shrink-0 mt-1">Protected</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>Joined {new Date(admin.createdAt || admin.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border
                    ${admin.role === 'SUPER_ADMIN'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-primary-50 text-primary-700 border-primary-200'
                    }`}
                  >
                    {admin.role}
                  </span>
                  {admin.admin_state && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-slate-50 text-slate-600 border-slate-200">
                      {admin.admin_state}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
            totalItems={admins.length}
          />
        </>
      )}
    </div>
  )
}
