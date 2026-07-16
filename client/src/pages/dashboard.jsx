import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// Layout
import AdminSidebar from '../features/admin/components/AdminSidebar'
import AdminNavbar  from '../features/admin/components/AdminNavbar'
import CreateEntityModal from '../features/admin/components/CreateEntityModal'

// Admin Views
import AdminDashboardView   from '../features/admin/components/AdminDashboard'
import SubAdminsView        from '../features/admin/components/SubAdminsView'
import MembersView          from '../features/admin/components/MembersView'
import CommunitiesView      from '../features/admin/components/CommunitiesView'
import SettingsView         from '../features/admin/components/SettingsView'
import MessagesView         from '../features/admin/components/MessagesView'

// Member Views
import MemberDashboardView   from '../features/dashboard/components/MemberDashboardView'
import EntrepreneurPitchesView from '../features/dashboard/components/EntrepreneurPitchesView'
import ExplorePitchesView    from '../features/dashboard/components/ExplorePitchesView'
import InvestorInvestmentsView from '../features/dashboard/components/InvestorInvestmentsView'
import ExploreInvestorsView  from '../features/dashboard/components/ExploreInvestorsView'
import UserProfileView from '../features/dashboard/components/UserProfileView'
import EventsView from '../features/events/components/EventsView'

// RBAC Hook
import useAuthRole from '../features/admin/hooks/useAuthRole'

export default function DashboardPage({ onNavigate, currentUser, onLogout, initialProfileId }) {
  const { role, isSuperAdmin, isStaff } = useAuthRole()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab]     = useState(initialProfileId ? 'profile' : 'dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewingUserId, setViewingUserId] = useState(initialProfileId || null)
  const [chatInitialUser, setChatInitialUser] = useState(null)

  // Listen to profile parameter updates from path /profile/:id
  useEffect(() => {
    if (initialProfileId) {
      setViewingUserId(initialProfileId)
      setActiveTab('profile')
    } else {
      setActiveTab('dashboard')
      setViewingUserId(null)
    }
  }, [initialProfileId])

  // Close sidebar on user change
  useEffect(() => {
    setChatInitialUser(null)
    setSidebarOpen(false)
  }, [currentUser])

  // Close sidebar on wider screens so it doesn't stay open after resize
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => { if (e.matches) setSidebarOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleSetTab = useCallback((tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)   // always close mobile drawer on navigation
    if (tab === 'dashboard') {
      onNavigate('dashboard')
    }
  }, [onNavigate])

  const handleViewUserProfile = useCallback((userId) => {
    if (userId) {
      setViewingUserId(userId);
      setActiveTab('profile');
      navigate(`/profile/${userId}`);
    }
  }, [navigate]);

  const renderView = () => {
    if (activeTab === 'profile' && viewingUserId) {
      return (
        <UserProfileView
          userId={viewingUserId}
          onBack={() => {
            setViewingUserId(null);
            setActiveTab('dashboard');
            onNavigate('dashboard');
          }}
          onChat={(targetUser) => {
            setChatInitialUser(targetUser);
            setActiveTab('messages');
          }}
        />
      );
    }

    // 1. Guard against sub-admins view (Super Admin only)
    if (activeTab === 'sub-admins' && !isSuperAdmin) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Access Denied</p>
          <p className="text-xs text-slate-500">Only Super Administrators can manage administration staff.</p>
        </div>
      )
    }

    // 2. Guard against members view (Staff only)
    if (activeTab === 'members' && !isStaff) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Access Denied</p>
          <p className="text-xs text-slate-500">This section is restricted to administration staff.</p>
        </div>
      )
    }

    // 3. Guard founder-only views
    if (activeTab === 'my-pitches' && role !== 'ENTREPRENEUR') {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Access Denied</p>
          <p className="text-xs text-slate-500">Only Entrepreneurs can access this section.</p>
        </div>
      )
    }

    // 4. Guard investor-only views
    if (activeTab === 'my-investments' && role !== 'INVESTOR') {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Access Denied</p>
          <p className="text-xs text-slate-500">Only Investors can access this section.</p>
        </div>
      )
    }

    if (activeTab === 'dashboard') {
      return isStaff
        ? <AdminDashboardView />
        : <MemberDashboardView currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} onViewProfile={handleViewUserProfile} />
    }

    const views = {
      'sub-admins'       : <SubAdminsView />,
      'members'          : <MembersView onViewProfile={handleViewUserProfile} />,
      'communities'      : <CommunitiesView currentUser={currentUser} onViewProfile={handleViewUserProfile} />,
      'events'           : <EventsView currentUser={currentUser} />,
      'settings'         : <SettingsView currentUser={currentUser} />,
      'messages'         : (
        <MessagesView
          currentUser={currentUser}
          initialContact={chatInitialUser}
          clearInitialContact={() => setChatInitialUser(null)}
          onViewProfile={handleViewUserProfile}
        />
      ),
      'my-pitches'       : <EntrepreneurPitchesView currentUser={currentUser} />,
      'explore-investors': <ExploreInvestorsView onViewProfile={handleViewUserProfile} />,
      'explore-pitches'  : <ExplorePitchesView onViewProfile={handleViewUserProfile} />,
      'my-investments'   : <InvestorInvestmentsView onViewProfile={handleViewUserProfile} />,
    }
    return views[activeTab] ?? (isStaff ? <AdminDashboardView /> : <MemberDashboardView currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} onViewProfile={handleViewUserProfile} />)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">

      {/* ─── Mobile backdrop overlay ─────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─────────────────────────────────────────────── */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        currentUser={currentUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ─── Main column ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminNavbar
          currentUser={currentUser}
          onLogout={onLogout}
          setActiveTab={handleSetTab}
          onAddResource={() => setIsModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* scrollable content area */}
        <main className={`flex-1 overflow-x-hidden ${activeTab === 'messages' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {activeTab === 'messages' ? (
            // Messages takes the full available space with no padding wrapper
            <div className="h-full">
              {renderView()}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
              {renderView()}
            </div>
          )}
        </main>
      </div>

      <CreateEntityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
