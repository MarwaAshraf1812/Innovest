import React, { useMemo } from 'react';
import {
  MessageCircle,
  ShieldAlert,
  Megaphone,
  CheckCircle2,
  XCircle,
  Bell,
  UserCheck,
  Users,
  TrendingUp,
} from 'lucide-react';

// ─── Icon + colour mapping per notification type ───────────────────────────────
const TYPE_CONFIG = {
  // Direct Messages
  directMessage: {
    icon: MessageCircle,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconColor: 'text-blue-500',
    label: 'Direct Message',
  },
  newMessage: {
    icon: MessageCircle,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconColor: 'text-blue-500',
    label: 'New Message',
  },
  // Community alerts
  communityJoinApproved: {
    icon: UserCheck,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-500',
    label: 'Community Approved',
  },
  communityJoinRejected: {
    icon: XCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconColor: 'text-rose-500',
    label: 'Community Declined',
  },
  communityKick: {
    icon: XCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconColor: 'text-rose-500',
    label: 'Removed from Community',
  },
  newJoinRequest: {
    icon: Users,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-amber-500',
    label: 'Join Request',
  },
  // System / account
  registrationApproved: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-500',
    label: 'Account Approved',
  },
  pitchApproved: {
    icon: TrendingUp,
    bg: 'bg-primary-50',
    border: 'border-primary-100',
    iconColor: 'text-primary-600',
    label: 'Pitch Approved',
  },
  pitchRejected: {
    icon: XCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconColor: 'text-rose-500',
    label: 'Pitch Declined',
  },
  systemAnnouncement: {
    icon: Megaphone,
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-500',
    label: 'Announcement',
  },
  adminAlert: {
    icon: ShieldAlert,
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconColor: 'text-orange-500',
    label: 'Admin Alert',
  },
};

const FALLBACK_CONFIG = {
  icon: Bell,
  bg: 'bg-slate-50',
  border: 'border-slate-150',
  iconColor: 'text-slate-400',
  label: 'Notification',
};

function formatRelativeTime(isoString) {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * NotificationItem — atomic notification card.
 *
 * @param {Object}   notification  – The notification object from useNotifications.
 * @param {Function} onMarkRead    – Called with notificationId when the user marks it read.
 */
export default function NotificationItem({ notification, onMarkRead }) {
  const config = useMemo(
    () => TYPE_CONFIG[notification.type] ?? FALLBACK_CONFIG,
    [notification.type]
  );

  const { icon: Icon, bg, border, iconColor, label } = config;
  const isUnread = !notification.read;
  const message = notification.data?.message || notification.data?.text || 'Platform update';
  const time = formatRelativeTime(notification.createdAt);

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (isUnread && onMarkRead) onMarkRead(notification._id);
  };

  return (
    <div
      className={[
        'group relative flex items-start gap-3 px-4 py-3.5',
        'transition-all duration-150 cursor-default',
        isUnread
          ? 'bg-primary-50/40 hover:bg-primary-50/70'
          : 'hover:bg-slate-50/80',
      ].join(' ')}
      role="listitem"
      aria-label={`${label}: ${message}`}
    >
      {/* Unread indicator strip */}
      {isUnread && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-0.5 rounded-r-full bg-primary-500"
        />
      )}

      {/* Category icon */}
      <div
        aria-hidden="true"
        className={[
          'h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5',
          bg,
          border,
        ].join(' ')}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p
          className={[
            'text-xs font-semibold leading-tight truncate',
            isUnread ? 'text-slate-900' : 'text-slate-700',
          ].join(' ')}
        >
          {label}
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
          {message}
        </p>
        <p className="text-[10px] text-slate-400 font-medium">{time}</p>
      </div>

      {/* Mark-read action */}
      {isUnread && (
        <button
          onClick={handleMarkRead}
          title="Mark as read"
          className={[
            'opacity-0 group-hover:opacity-100 flex items-center justify-center',
            'h-6 w-6 rounded-md text-slate-400',
            'hover:text-primary-600 hover:bg-primary-100',
            'transition-all duration-150 shrink-0 border-none bg-transparent cursor-pointer',
          ].join(' ')}
          aria-label="Mark notification as read"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
