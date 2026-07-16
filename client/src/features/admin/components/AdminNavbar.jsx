import React, { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, User, Plus, Menu } from 'lucide-react'
import useAuthRole from '../hooks/useAuthRole'
import { useNotifications } from '../../notifications/hooks/useNotifications'
import NotificationDropdown from '../../notifications/components/NotificationDropdown'

export default function AdminNavbar({ currentUser, onLogout, setActiveTab, onAddResource, onToggleSidebar }) {
  const { isStaff, role } = useAuthRole()

  // ── Profile dropdown state ─────────────────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const profileRef = useRef(null)

  // ── Notification system ────────────────────────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const {
    notifications,
    unreadCount,
    byChannel,
    loading,
    connected,
    markRead,
    markAllRead,
    refresh,
  } = useNotifications(currentUser?.id)

  // ── Close profile dropdown on outside click ────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setImgErr(false) }, [currentUser])

  const initials = (currentUser?.first_name?.[0] ?? currentUser?.username?.[0] ?? 'U').toUpperCase()

  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-white border-b border-slate-200 z-20">

      {/* Hamburger — mobile only */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <span className="flex-1 text-sm font-bold text-slate-700 tracking-wide truncate">
        {isStaff ? 'Admin Workspace' : 'My Workspace'}
      </span>

      {/* Actions cluster */}
      <div className="flex items-center gap-2">

        {/* Add Resource — admin only */}
        {isStaff && onAddResource && (
          <button
            onClick={onAddResource}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors cursor-pointer border-none whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Resource
          </button>
        )}
        {isStaff && onAddResource && (
          <button
            onClick={onAddResource}
            className="sm:hidden flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors cursor-pointer border-none"
            aria-label="Add resource"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}

        {/* ── Bell / Notification Trigger ───────────────────────────────────── */}
        <div className="relative" ref={notifRef}>
          <button
            id="notification-bell-btn"
            aria-label={`Notifications${unreadCount > 0 ? ` – ${unreadCount} unread` : ''}`}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
            aria-controls="notification-dropdown"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />

            {/* Unread badge */}
            {unreadCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white tabular-nums leading-none ring-2 ring-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : (
              /* Subtle pulsing dot when connected even with 0 unread */
              connected && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"
                />
              )
            )}
          </button>

          <NotificationDropdown
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            byChannel={byChannel}
            loading={loading}
            connected={connected}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onRefresh={refresh}
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />

        {/* Avatar dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer border-none bg-transparent p-0"
            aria-label="Account menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            {/* Name — hidden on xs */}
            <div className="hidden sm:block text-right leading-none">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser?.first_name ?? currentUser?.username ?? 'User'}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {role}
              </p>
            </div>

            {/* Avatar */}
            {!imgErr && currentUser?.profile_image ? (
              <img
                src={currentUser.profile_image}
                alt=""
                onError={() => setImgErr(true)}
                className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 text-xs font-extrabold border border-primary-200 flex items-center justify-center shrink-0 select-none">
                {initials}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50"
            >
              <button
                role="menuitem"
                onClick={() => { setActiveTab('settings'); setProfileOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-none bg-transparent"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                Profile
              </button>
              <div className="my-1 h-px bg-slate-100" />
              <button
                role="menuitem"
                onClick={() => { setProfileOpen(false); onLogout?.() }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
