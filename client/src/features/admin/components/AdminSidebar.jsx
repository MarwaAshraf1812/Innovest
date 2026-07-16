import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  LayoutDashboard, ShieldCheck, Users, Globe,
  Settings, Mail, FolderOpen, Search, Briefcase, X, TrendingUp, CalendarDays
} from 'lucide-react'
import { API_URL } from '../../../config/api'
import useAuthRole from '../hooks/useAuthRole'

const MENU = {
  ADMIN: [
    { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
    { id: 'sub-admins', label: 'Sub-Admins',       icon: ShieldCheck },
    { id: 'members',    label: 'Members',          icon: Users },
    { id: 'communities',label: 'Communities',      icon: Globe },
    { id: 'events',     label: 'Events',           icon: CalendarDays },
    { id: 'settings',   label: 'Settings',         icon: Settings },
    { id: 'messages',   label: 'Messages',         icon: Mail },
  ],
  INVESTOR: [
    { id: 'dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
    { id: 'explore-pitches', label: 'Explore Pitches',  icon: Search },
    { id: 'my-investments',  label: 'My Investments',   icon: Briefcase },
    { id: 'communities',     label: 'Communities',      icon: Globe },
    { id: 'events',          label: 'Events',           icon: CalendarDays },
    { id: 'settings',        label: 'Settings',         icon: Settings },
    { id: 'messages',        label: 'Messages',         icon: Mail },
  ],
  ENTREPRENEUR: [
    { id: 'dashboard',        label: 'Dashboard',         icon: LayoutDashboard },
    { id: 'my-pitches',       label: 'My Pitches',        icon: FolderOpen },
    { id: 'explore-investors',label: 'Explore Investors', icon: TrendingUp },
    { id: 'communities',      label: 'Communities',       icon: Globe },
    { id: 'events',           label: 'Events',            icon: CalendarDays },
    { id: 'settings',         label: 'Settings',          icon: Settings },
    { id: 'messages',         label: 'Messages',          icon: Mail },
  ],
}

const PORTAL_LABEL = {
  ADMIN: 'Admin Portal',
  SUPER_ADMIN: 'Admin Portal',
  SUB_ADMIN: 'Admin Portal',
  INVESTOR: 'Investor Portal',
  ENTREPRENEUR: 'Founder Portal',
}

export default function AdminSidebar({ activeTab, setActiveTab, currentUser, sidebarOpen, setSidebarOpen }) {
  const { role, isSuperAdmin, isStaff } = useAuthRole()
  
  const menuKey = isSuperAdmin ? 'ADMIN' : (isStaff ? 'ADMIN' : role)
  let items = MENU[menuKey] || MENU.ENTREPRENEUR

  // Strict RBAC: hide sub-admins tab entirely from Admins and Sub-Admins
  if (!isSuperAdmin) {
    items = items.filter(item => item.id !== 'sub-admins')
  }

  const [joinedCommunities, setJoinedCommunities] = useState([])

  useEffect(() => {
    if (!currentUser?.id || isStaff) return
    const fetchJoined = async () => {
      try {
        // Use memberships endpoint — comm.users contains enriched objects, not plain IDs
        const membershipsRes = await axios.get(`${API_URL}/community/memberships/my`)
        const memberships = membershipsRes.data || []
        const approvedIds = new Set(
          memberships
            .filter(m => m.member_status === 'APPROVED')
            .map(m => m.community_id)
        )
        if (approvedIds.size === 0) {
          setJoinedCommunities([])
          return
        }
        const commRes = await axios.get(`${API_URL}/community`)
        const all = commRes.data?.communities || commRes.data || []
        setJoinedCommunities(all.filter(c => approvedIds.has(c.community_id)))
      } catch (e) {
        console.error('Sidebar: failed to load joined communities', e)
      }
    }
    fetchJoined()
    const interval = setInterval(fetchJoined, 8000)
    return () => clearInterval(interval)
  }, [currentUser, isStaff])

  return (
    <>
      {/* Sidebar panel — fixed on all sizes, but hidden off-screen on mobile */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-200',
          'transition-transform duration-300 ease-in-out',
          'md:static md:translate-x-0 md:z-auto md:shrink-0 md:h-screen',
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        ].join(' ')}
      >
        {/* ── Brand header ─────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <TrendingUp className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <p className="text-sm font-extrabold text-slate-900 tracking-tight">Innovest</p>
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">
                {PORTAL_LABEL[role] || 'Member Portal'}
              </p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* ── Nav items ────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-150 cursor-pointer border-none text-left',
                  active
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                <Icon className={['h-4.5 w-4.5 shrink-0', active ? 'text-primary-600' : 'text-slate-400'].join(' ')} />
                <span>{label}</span>
              </button>
            )
          })}

          {/* Joined Communities section */}
          {!isStaff && joinedCommunities.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 select-none">Joined Communities</p>
              <div className="space-y-0.5">
                {joinedCommunities.map(comm => (
                  <button
                    key={comm.community_id}
                    onClick={() => {
                      setActiveTab('communities')
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('select-community', { detail: comm }))
                      }, 50)
                      setSidebarOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-605 hover:bg-slate-50 hover:text-slate-900 text-left border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <div className="h-5 w-5 rounded bg-primary-100 flex items-center justify-center text-primary-750 text-[9px] font-black shrink-0">
                      {comm.community_name[0].toUpperCase()}
                    </div>
                    <span className="truncate flex-grow">{comm.community_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* ── Footer ───────────────────────────── */}
        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium text-center">Innovest v1.2</p>
        </div>
      </aside>
    </>
  )
}
