import React from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/shared/Footer'
import RegisterForm from '../features/auth/components/RegisterForm'

export default function RegisterPage({ onNavigate, currentUser, onLogout }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col py-12 selection:bg-primary-500 selection:text-white text-slate-800">
      
      {/* Navbar */}
      <Navbar 
        activePage="register"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Form Area */}
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden py-16 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.03),transparent)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />
        <RegisterForm onNavigate={onNavigate} />
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

    </div>
  )
}
