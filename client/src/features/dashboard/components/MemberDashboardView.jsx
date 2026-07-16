import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FolderOpen, TrendingUp, Users, ShieldAlert, Briefcase, DollarSign, Bell, Check, Eye } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { API_URL } from '../../../config/api'

export default function MemberDashboardView({ currentUser, onNavigate, onLogout }) {
  const isInvestor = currentUser?.role === 'INVESTOR'
  const [stats, setStats] = useState({ pitchCount: 0, communityCount: 0, investmentCount: 0 })
  const [loadingStats, setLoadingStats] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const { data } = await axios.get(`${API_URL}/user/me/stats`)
      setStats(data)
    } catch (err) {
      console.warn('Failed to load dashboard stats:', err.message)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true)
      const { data } = await axios.get(`${API_URL}/user/notifications`)
      setNotifications(data || [])
    } catch (err) {
      console.warn('Failed to load notifications:', err.message)
    } finally {
      setLoadingNotifs(false)
    }
  }

  useEffect(() => {
    if (!currentUser?.id) return
    fetchStats()
    fetchNotifications()
    
    // Poll notifications every 8 seconds
    const interval = setInterval(fetchNotifications, 8000)
    return () => clearInterval(interval)
  }, [currentUser])

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/user/notifications/mark-all-read`)
      fetchNotifications()
    } catch (err) {
      console.warn('Failed to mark all as read:', err.message)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API_URL}/user/notifications/${id}/read`)
      fetchNotifications()
    } catch (err) {
      console.warn('Failed to mark read:', err.message)
    }
  }

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } catch (e) {
      return 'Recent'
    }
  }

  // Dynamic role-based metrics built from live data
  const metrics = isInvestor ? [
    { label: 'Expressions of Interest', count: loadingStats ? '…' : stats.investmentCount, icon: <Briefcase className="h-5 w-5" />, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { label: 'Communities Joined',      count: loadingStats ? '…' : stats.communityCount,  icon: <Users className="h-5 w-5" />,    color: 'text-blue-600 bg-blue-50 border-blue-100' },
  ] : [
    { label: 'Approved Pitches',   count: loadingStats ? '…' : stats.pitchCount,     icon: <FolderOpen className="h-5 w-5" />,  color: 'text-primary-600 bg-primary-50 border-primary-100' },
    { label: 'Communities Joined', count: loadingStats ? '…' : stats.communityCount, icon: <Users className="h-5 w-5" />,       color: 'text-blue-600 bg-blue-50 border-blue-100' },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Hello, {currentUser?.first_name || currentUser?.username || 'Partner'}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Welcome to your match management control panel. Your account type is <span className="text-primary-600 font-semibold uppercase">{currentUser?.role || 'User'}</span>.
          </p>
        </div>
        <div className="flex gap-2">
          {isInvestor ? (
            <Button variant="primary" size="sm" onClick={() => onNavigate('explore')}>Explore Pitches</Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onNavigate('proposals')}>Submit New Pitch</Button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metrics.map((met, idx) => (
          <Card key={idx} className="p-6 flex items-center justify-between" hoverable={false}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{met.label}</span>
              <p className="text-3xl font-black text-slate-900">{met.count}</p>
            </div>
            <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${met.color}`}>
              {met.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Recent Activity Feed
              {unreadCount > 0 && (
                <span className="h-5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {unreadCount} new
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-primary-600 hover:text-primary-700 cursor-pointer border-none bg-transparent"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {loadingNotifs && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-450 bg-white border border-slate-200 rounded-2xl">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-450 bg-white border border-slate-200 rounded-2xl">
                No recent activity. Everything is quiet.
              </div>
            ) : (
              notifications.map((notif) => {
                const messageText = notif.data?.message || 'New platform update'
                const isUnread = !notif.read
                
                return (
                  <div
                    key={notif._id}
                    className={`p-4 rounded-xl flex justify-between gap-4 border shadow-sm transition-all duration-200 ${
                      isUnread
                        ? 'bg-primary-50/20 border-primary-100'
                        : 'bg-white border-slate-200/80 hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isUnread
                          ? 'bg-primary-50 border-primary-100 text-primary-600'
                          : 'bg-slate-50 border-slate-150 text-slate-400'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1.5`}>
                          {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />}
                          {notif.type === 'registrationApproved' ? 'Registration Approved' :
                           notif.type === 'communityJoinApproved' ? 'Community Joined' :
                           notif.type === 'pitchApproved' ? 'Pitch Approved' :
                           notif.type === 'pitchRejected' ? 'Pitch Rejected' :
                           'Platform Update'}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{messageText}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="text-[9px] font-semibold text-slate-400">{formatTime(notif.createdAt)}</span>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkRead(notif._id)}
                          className="p-1 rounded-md text-slate-400 hover:text-primary-600 hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Security / System status */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Vetting Status</h2>
          
          <Card className="p-6 space-y-4 bg-white border-slate-200" hoverable={false}>
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Account Credentials</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your status is currently set to <span className="text-emerald-600 font-bold uppercase">Verified</span>. You have access to all features.
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full justify-center" onClick={onLogout}>
              Terminate Session
            </Button>
          </Card>
        </div>

      </div>

    </div>
  )
}
