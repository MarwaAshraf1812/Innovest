import React from 'react'
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LandingPage from '../pages/landing'
import LoginPage from '../pages/login'
import RegisterPage from '../pages/register'
import ExplorePage from '../pages/explore'
import CommunitiesPage from '../pages/communities'
import ProposalsPage from '../pages/proposals'
import DashboardPage from '../pages/dashboard'
import NotFoundPage from '../pages/NotFoundPage'

// Helper wrapper to extract profile ID parameter
function ProfileWrapper({ onNavigate, currentUser, onLogout }) {
  const { id } = useParams()
  return <DashboardPage onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} initialProfileId={id} />
}

export default function AppRoutes() {
  const { currentUser, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleNavigate = (pageId) => {
    if (!currentUser && ['explore', 'communities', 'proposals', 'dashboard'].includes(pageId)) {
      navigate('/login')
      return
    }
    switch (pageId) {
      case 'home':
        navigate('/')
        break
      case 'login':
        navigate('/login')
        break
      case 'register':
        navigate('/register')
        break
      case 'explore':
        navigate('/explore')
        break
      case 'communities':
        navigate('/communities')
        break
      case 'proposals':
        navigate('/proposals')
        break
      case 'dashboard':
        navigate('/dashboard')
        break
      default:
        navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium text-slate-500">Verifying session...</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          )
        }
      />
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          )
        }
      />
      <Route
        path="/register"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          )
        }
      />
      <Route
        path="/explore"
        element={
          currentUser ? (
            <ExplorePage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/communities"
        element={
          currentUser ? (
            <CommunitiesPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/proposals"
        element={
          currentUser ? (
            <ProposalsPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <DashboardPage onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/profile/:id"
        element={
          currentUser ? (
            <ProfileWrapper onNavigate={handleNavigate} currentUser={currentUser} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
    </Routes>
  )
}
