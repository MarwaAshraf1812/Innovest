import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear()

  const links = {
    platform: [
      { label: 'Explore Pitches', id: 'explore' },
      { label: 'Communities', id: 'communities' },
      { label: 'Proposals', id: 'proposals' },
    ],
    company: [
      { label: 'About Us', id: 'about' },
      { label: 'Privacy Policy', id: 'privacy' },
      { label: 'Terms of Service', id: 'terms' },
    ]
  }

  const handleLinkClick = (id) => {
    if (onNavigate) {
      if (id === 'about' || id === 'privacy' || id === 'terms') {
        onNavigate('home')
      } else {
        onNavigate(id)
      }
    }
  }

  return (
    <footer className="border-t border-slate-200/60 bg-slate-50 py-16 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleLinkClick('home')}>
              <svg className="h-7 w-7 text-primary-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
                <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
                <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Innovest</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500 font-semibold">
              A secure, modular, and real-time platform connecting entrepreneurs and investors globally. Simplifying the pitch, community alignment, and investment proposal workflows.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-550 hover:text-slate-800 hover:scale-105 transition-all shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-555 hover:text-slate-800 hover:scale-105 transition-all shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-555 hover:text-slate-800 hover:scale-105 transition-all shadow-sm">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {links.platform.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => handleLinkClick(link.id)}
                    className="hover:text-primary-600 text-slate-500 hover:underline transition-all text-xs text-left cursor-pointer bg-transparent border-none p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-4">Legal & Info</h4>
            <ul className="space-y-2.5">
              {links.company.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => handleLinkClick(link.id)}
                    className="hover:text-primary-600 text-slate-500 hover:underline transition-all text-xs text-left cursor-pointer bg-transparent border-none p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/60 my-6" />

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Innovest Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 font-semibold text-slate-400">
            <span>Powered by React + Vite + Tailwind v4</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
