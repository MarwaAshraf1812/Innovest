import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bell,
  MessageCircle,
  ShieldAlert,
  Megaphone,
  CheckCheck,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import NotificationItem from './NotificationItem';

// ─── Channel filter tabs ─────────────────────────────────────────────────────
const CHANNEL_TABS = [
  { id: 'all',            label: 'All',        icon: Bell },
  { id: 'directMessage',  label: 'Messages',   icon: MessageCircle },
  { id: 'communityAlert', label: 'Community',  icon: ShieldAlert },
  { id: 'system',         label: 'System',     icon: Megaphone },
];

/**
 * NotificationDropdown — full-featured notification centre panel.
 *
 * Rendered as an absolute overlay anchored to the bell button.
 * Receives already-computed state from the `useNotifications` hook
 * so it stays a pure presentational + action component.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {Array}    notifications    – full list from useNotifications
 * @param {number}   unreadCount
 * @param {Object}   byChannel        – pre-segmented lists
 * @param {boolean}  loading
 * @param {boolean}  connected        – WebSocket live status
 * @param {Function} onMarkRead
 * @param {Function} onMarkAllRead
 * @param {Function} onRefresh
 */
export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  byChannel = {},
  loading = false,
  connected = false,
  onMarkRead,
  onMarkAllRead,
  onRefresh,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, [isRefreshing, onRefresh]);

  if (!isOpen) return null;

  // Determine visible list
  const visibleList = activeTab === 'all'
    ? notifications
    : (byChannel[activeTab] ?? []);

  const tabUnread = (tabId) => {
    if (tabId === 'all') return unreadCount;
    return (byChannel[tabId] ?? []).filter((n) => !n.read).length;
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      aria-modal="true"
      id="notification-dropdown"
      className={[
        'absolute right-0 top-full mt-2 z-[60]',
        'w-[360px] max-w-[calc(100vw-1rem)]',
        'bg-white rounded-2xl border border-slate-200',
        'shadow-xl shadow-slate-900/10',
        'flex flex-col overflow-hidden',
        'animate-in fade-in slide-in-from-top-2 duration-200',
      ].join(' ')}
      style={{ maxHeight: 'min(520px, 80vh)' }}
    >

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Notifications</h2>
          {unreadCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Live indicator */}
          <span
            title={connected ? 'Live – receiving real-time updates' : 'Offline – polling for updates'}
            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={connected
              ? { color: '#16a34a', background: '#f0fdf4', borderColor: '#bbf7d0' }
              : { color: '#64748b', background: '#f8fafc', borderColor: '#e2e8f0' }}
          >
            {connected
              ? <Wifi className="h-2.5 w-2.5" />
              : <WifiOff className="h-2.5 w-2.5" />}
            {connected ? 'Live' : 'Offline'}
          </span>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            title="Refresh notifications"
            aria-label="Refresh notifications"
            className="flex items-center justify-center h-6 w-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all as read"
              aria-label="Mark all notifications as read"
              className="flex items-center justify-center h-6 w-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors border-none bg-transparent cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Channel Tabs ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 shrink-0 overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Notification channels"
      >
        {CHANNEL_TABS.map(({ id, label, icon: Icon }) => {
          const count = tabUnread(id);
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`notification-panel-${id}`}
              id={`notification-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold',
                'transition-all duration-150 border-none cursor-pointer whitespace-nowrap shrink-0',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-500 bg-transparent hover:bg-slate-100 hover:text-slate-700',
              ].join(' ')}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {label}
              {count > 0 && (
                <span className={[
                  'h-4 min-w-4 px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center tabular-nums',
                  isActive ? 'bg-white/30 text-white' : 'bg-primary-100 text-primary-700',
                ].join(' ')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Notification List ─────────────────────────────────────── */}
      <div
        id={`notification-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`notification-tab-${activeTab}`}
        className="flex-1 overflow-y-auto divide-y divide-slate-50"
      >
        {loading && notifications.length === 0 ? (
          /* Skeleton loading state */
          <div className="space-y-px py-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-2 bg-slate-100 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleList.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600">All caught up!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeTab === 'all'
                  ? "You don't have any notifications yet."
                  : `No ${CHANNEL_TABS.find(t => t.id === activeTab)?.label ?? ''} notifications.`}
              </p>
            </div>
          </div>
        ) : (
          /* Rendered list */
          <div role="list" aria-label="Notification items">
            {visibleList.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={onMarkRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-t border-slate-100 shrink-0">
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Showing {visibleList.length} notification{visibleList.length !== 1 ? 's' : ''}
          {unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
        </p>
      </div>
    </div>
  );
}
