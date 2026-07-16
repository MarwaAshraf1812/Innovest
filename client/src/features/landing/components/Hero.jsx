import React from 'react'
import { ArrowRight, Sparkles, ShieldCheck, Check, Layers, UserCheck, Activity } from 'lucide-react'

export default function Hero({ onNavigate }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 border-b border-slate-100 bg-[#f8fafc] bg-[linear-gradient(to_right,#f1f5f9_1.5px,transparent_1.5px),linear-gradient(to_bottom,#f1f5f9_1.5px,transparent_1.5px)] bg-[size:6rem_6rem]">
      
      {/* Decorative radial gradients for ambient depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[5%] w-[550px] h-[550px] bg-gradient-to-tr from-primary-600/5 to-indigo-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-[5%] w-[400px] h-[400px] bg-primary-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Wording & Core Proposition */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Info */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50/80 text-xs font-bold text-primary-600 border border-primary-100 shadow-sm mx-auto lg:mx-0">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              The Matchmaking Hub for Early-Stage Capital
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Visionary Capital <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 bg-clip-text text-transparent">
                Meets Vetted Innovation.
              </span>
            </h1>
            
            {/* Descriptive Pitch Subtext */}
            <p className="text-slate-650 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Innovest simplifies early negotiations. We connect vetted startups directly with local sponsors and angel networks using secure, criteria-based matching parameters.
            </p>
            
            {/* CTA Pill Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={() => onNavigate('explore')}
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-7 py-3.5 font-bold hover:shadow-lg hover:shadow-primary-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                Explore Active Pitches
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <button 
                onClick={() => onNavigate('register')}
                className="bg-white border border-slate-200 text-slate-800 rounded-full px-7 py-3.5 font-bold hover:bg-slate-50 shadow-md shadow-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                Pitch Your Vision
              </button>
            </div>

            {/* Core Verification Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
              {[
                { title: "Vetted Verification", desc: "Rigorous admin checklist" },
                { title: "Direct Contact", desc: "No middleman brokerage" },
                { title: "Encrypted Data", desc: "Role-based deck access" }
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-left justify-center lg:justify-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{feat.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Premium "Match Flow Dashboard" Live Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl p-5 space-y-4 hover:shadow-primary-600/5 hover:-translate-y-1 transition-all duration-300">
              
              {/* Card Title Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-primary-600 animate-pulse" />
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Live Match Activity</span>
                </div>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Real-time Active
                </span>
              </div>

              {/* Match Card 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-150 relative overflow-hidden space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">SolarFlow Grid</h4>
                    <p className="text-[10px] text-slate-450 font-bold">Cleantech · Seed Stage</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full">
                    94% Score
                  </span>
                </div>
                
                {/* Horizontal compatibility indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    <span>Sponsor Alignment</span>
                    <span>94% matched</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-600 h-full w-[94%]" />
                  </div>
                </div>
              </div>

              {/* Live Match Feed timeline */}
              <div className="space-y-3 pt-2">
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Recent Expressions</h5>
                
                <div className="space-y-2.5">
                  {[
                    { label: "Sponsor Matched", details: "Venture group aligned with Quantum Biotech", time: "Just now" },
                    { label: "Deck Access Granted", details: "Alpha Robotics shared pitch document", time: "12m ago" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="h-6 w-6 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                        <Layers className="h-3 w-3" />
                      </div>
                      <div className="space-y-0.5 leading-tight">
                        <p className="font-bold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-500">{item.details}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold ml-auto shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Vetted Badge */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-slate-650 font-bold">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Encrypted proposal matching enabled.</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
