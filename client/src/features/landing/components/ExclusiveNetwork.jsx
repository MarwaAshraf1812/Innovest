import React from 'react'
import { CheckCircle2, ShieldCheck, HelpCircle, Users2, Landmark } from 'lucide-react'

export default function ExclusiveNetwork({ onNavigate, currentUser }) {
  return (
    <section className="py-24 border-b border-slate-100 bg-gradient-to-b from-white to-[#f8fafc] relative overflow-hidden">
      
      {/* Background soft decorative gradient blur */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Premium Content & Benefits Checklist */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100/80 shadow-sm">
                Connect with local sponsors
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Join Our Exclusive Investment Network
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Legislative structures and strict verification guidelines ensure secure investor or entrepreneur matching options when you join this dynamic community. Get access to verified pitch decks, financial sheets, and direct proposal modules.
            </p>

            {/* Structured benefits checklist */}
            <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
              {[
                { title: "Vetted Deal Flow", desc: "Detailed due diligence with verified, approved project proposals.", icon: <ShieldCheck className="h-5 w-5 text-primary-600" /> },
                { title: "Secure Direct Match", desc: "Encrypted channels for direct communication with verified sponsors.", icon: <Landmark className="h-5 w-5 text-primary-600" /> },
                { title: "No Intermediary Fees", desc: "100% direct founder-to-investor match, free of third-party cuts.", icon: <Users2 className="h-5 w-5 text-primary-600" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-left">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-primary-50 border border-primary-100/60 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={() => currentUser ? onNavigate('communities') : onNavigate('register')}
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 py-3 font-bold hover:shadow-lg hover:shadow-primary-600/15 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                Join our Community
              </button>
              
              <button 
                onClick={() => currentUser ? onNavigate('explore') : onNavigate('login')}
                className="bg-white border border-slate-200 text-slate-800 rounded-full px-6 py-3 font-bold hover:bg-slate-50 shadow-md shadow-slate-100 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                Discover Projects
              </button>
            </div>
          </div>

          {/* Right Column: Premium Image Wrapper with overlap badge */}
          <div className="lg:col-span-6 flex justify-center relative">
            
            {/* Interactive Badge Overlapping Image */}
            <div className="absolute -top-4 -left-4 sm:left-4 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl flex items-center gap-3.5 z-20 hover:scale-105 transition-transform duration-300">
              <div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-extrabold text-slate-900">100% Safe</p>
                <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Vetted Profiles</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-slate-200/60 bg-white p-2.5 shadow-2xl shadow-slate-200/80 max-w-lg w-full group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-550" />
              <img 
                src="/exclusive_network.png" 
                alt="Global Business Matching" 
                className="rounded-2xl w-full object-cover aspect-[4/3] group-hover:scale-[1.01] transition-transform duration-550" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
