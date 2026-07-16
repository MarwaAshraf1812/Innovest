import React, { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import Button from './Button'

export default function Navbar({
  currentUser = null,
  activePage = 'home',
  onNavigate,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'features', label: 'Features' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
  ]

  const handleLinkClick = (id) => {
    if (activePage === 'home') {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      if (onNavigate) {
        onNavigate('home')
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 150)
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-md border border-slate-200/40 rounded-full shadow-lg shadow-slate-200/5 px-6 py-2.5 flex items-center justify-between pointer-events-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleLinkClick('home')}>
          <svg className="h-7 w-7 text-primary-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Innovest
          </span>
        </div>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="px-4 py-2 rounded-full text-[14px] font-semibold text-slate-650 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-350 transition-all cursor-pointer"
                title="Dashboard"
              >
                <Shield className="h-4.5 w-4.5" />
              </button>
              <div className="text-right leading-none">
                <p className="text-xs font-bold text-slate-800">{currentUser.username}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold mt-0.5">{currentUser.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-50 cursor-pointer transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 cursor-pointer transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-5 py-2.5 hover:shadow-md hover:shadow-primary-600/10 font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-3xl p-4 space-y-3 shadow-lg pointer-events-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <div className="space-y-3 px-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">{currentUser.username}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{currentUser.role}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Button variant="ghost" size="md" className="w-full justify-start" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="md" className="w-full" onClick={() => onNavigate('register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
