import React from 'react'
import RegisterForm from '../features/auth/components/RegisterForm'

export default function RegisterPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[linear-gradient(to_right,#f1f5f9_1.5px,transparent_1.5px),linear-gradient(to_bottom,#f1f5f9_1.5px,transparent_1.5px)] bg-[size:6rem_6rem] flex flex-col selection:bg-primary-500 selection:text-white text-slate-800 relative overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-primary-600/10 via-indigo-500/10 to-blue-400/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Header with Logo only */}
      <header className="px-6 py-6 flex items-center justify-center relative z-20">
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-all hover:scale-105 active:scale-95 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200/60 shadow-sm" 
          onClick={() => onNavigate('home')}
        >
          <svg className="h-7 w-7 text-primary-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Innovest
          </span>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10 pb-16">
        <RegisterForm onNavigate={onNavigate} />
      </main>

    </div>
  )
}
