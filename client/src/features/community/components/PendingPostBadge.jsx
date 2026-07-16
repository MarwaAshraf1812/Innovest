import React from 'react'
import { Clock, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import { POST_STATUS } from '../hooks/usePostWorkflow'

/**
 * PendingPostBadge
 *
 * A compact inline badge stamped onto a post card to communicate its
 * current workflow status to the author or admin.
 *
 * Props:
 *   status     {string}  – one of POST_STATUS values
 *   showLabel  {boolean} – render a text label alongside the icon (default true)
 *   className  {string}  – extra Tailwind utility classes
 */
export default function PendingPostBadge({ status, showLabel = true, className = '' }) {
  const config = {
    [POST_STATUS.PENDING]: {
      icon: Clock,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-400',
      text: 'text-amber-700',
      label: 'Pending Review',
    },
    [POST_STATUS.APPROVED]: {
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-400',
      text: 'text-emerald-700',
      label: 'Approved',
    },
    [POST_STATUS.REJECTED]: {
      icon: XCircle,
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      dot: 'bg-rose-400',
      text: 'text-rose-700',
      label: 'Not Approved',
    },
  }[status] ?? {
    icon: ShieldAlert,
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    text: 'text-slate-500',
    label: 'Unknown',
  }

  const Icon = config.icon

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold',
        config.bg,
        config.border,
        config.text,
        className,
      ].join(' ')}
      role="status"
      aria-label={`Post status: ${config.label}`}
    >
      {/* Animated dot for PENDING only */}
      {status === POST_STATUS.PENDING ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
        </span>
      ) : (
        <Icon className="h-3 w-3 shrink-0" strokeWidth={2.5} />
      )}
      {showLabel && config.label}
    </span>
  )
}
