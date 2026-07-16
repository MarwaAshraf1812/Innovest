import React from 'react'
import { Calendar, CreditCard, Check, X, ShieldAlert } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import RoleBadge from './RoleBadge'
import { API_URL } from '../../../config/api'

export default function MemberCard({ user, onApprove, onReject, actionLoading }) {
  const docUrl = user.documents ? `${API_URL}/uploads/${user.documents}` : null
  const rawDate = user.created_at || user.createdAt
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'N/A'
  const targetId = user.id || user._id

  return (
    <Card className="p-6 border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-black text-lg shrink-0">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 text-base">{user.first_name} {user.last_name}</h4>
            <span className="text-xs text-slate-400 font-semibold">(@{user.username})</span>
            <RoleBadge role={user.role} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
            <span>{user.email}</span>
            {user.phone && <span>• {user.phone}</span>}
            {user.country && <span>• {user.country}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-semibold pt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Registered: {formattedDate}
            </span>
            {user.national_id && (
              <span className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                ID: {user.national_id}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        {docUrl ? (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-4 py-2.5 rounded-xl hover:bg-primary-100 transition-all text-center flex items-center justify-center gap-2"
          >
            <ShieldAlert className="h-4 w-4" />
            View Document
          </a>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl text-center">
            No Document
          </span>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-initial text-rose-600 hover:bg-rose-50 border-rose-200"
            onClick={() => onReject(targetId)}
            disabled={actionLoading === targetId}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-initial"
            onClick={() => onApprove(targetId)}
            loading={actionLoading === targetId}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
