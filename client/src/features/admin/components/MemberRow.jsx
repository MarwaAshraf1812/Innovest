import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, CheckCircle2, AlertCircle, Mail, Phone, Globe } from 'lucide-react'
import RoleDropdown from './RoleDropdown'
import ProfileAvatar from '../../../components/ProfileAvatar'

export default function MemberRow({ user, onDelete, onRoleChange, actionLoading }) {
  const [updatingRole, setUpdatingRole] = useState(false)
  const navigate = useNavigate()

  const handleRoleChange = async (newRole) => {
    if (updatingRole) return
    setUpdatingRole(true)
    try {
      await onRoleChange(user.id || user._id, newRole)
    } finally {
      setUpdatingRole(false)
    }
  }

  const handleProfileClick = () => {
    const targetId = user.id || user._id
    if (targetId && ['ENTREPRENEUR', 'INVESTOR'].includes(user.role)) {
      navigate(`/profile/${targetId}`)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-205 p-4 shadow-sm space-y-3 hover:shadow-md hover:border-slate-350 transition-all duration-300 animate-in fade-in">
      {/* Avatar + name */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ProfileAvatar
            userId={user.id || user._id}
            role={user.role}
            imageUrl={user.profile_image}
            initials={user.first_name?.[0]?.toUpperCase()}
            className="h-10 w-10"
          />
          <div className="min-w-0">
            <button
              onClick={handleProfileClick}
              className="text-sm font-semibold text-slate-900 truncate leading-tight text-left hover:text-primary-650 hover:underline cursor-pointer border-none bg-transparent p-0 block w-full"
            >
              {user.first_name} {user.last_name}
            </button>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">@{user.username}</p>
          </div>
        </div>

        <button
          onClick={() => onDelete(user.id || user._id)}
          disabled={actionLoading === (user.id || user._id)}
          className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent disabled:opacity-40"
          title="Delete user"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="col-span-2 bg-slate-50 rounded-lg p-2.5 truncate flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">{user.email}</span>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">{user.phone || '—'}</span>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">{user.country || '—'}</span>
        </div>
      </div>

      {/* Footer / Role selection + Status badge */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-105">
        <div className="flex items-center gap-2">
          <RoleDropdown
            currentRole={user.role}
            onChange={handleRoleChange}
            disabled={updatingRole || actionLoading === (user.id || user._id)}
          />
        </div>

        <div>
          {user.is_verified ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-transparent">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Pending
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
