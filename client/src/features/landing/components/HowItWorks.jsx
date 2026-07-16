import React from 'react'
import { TrendingUp, User, FileText, Search, BarChart2, MessageSquare, Layers } from 'lucide-react'

export default function HowItWorks({ id }) {
  return (
    <section id={id} className="py-20 border-b border-slate-100 bg-slate-50/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            Workflow Index
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">How INNOVEST Works?</h2>
        </div>

        {/* Workflow block */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-50/80 to-indigo-50/70 border border-primary-100 p-8 sm:p-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Icon / Brand showcase */}
            <div className="flex justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-tr from-primary-200/50 to-indigo-200/30 border border-primary-200 flex items-center justify-center relative shadow-inner">
                <TrendingUp className="h-16 w-16 text-primary-600" />
                <div className="absolute -top-4 -right-4 h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-primary-600">$</span>
                </div>
              </div>
            </div>

            {/* Workflow Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Empowering Connections for Innovators</h3>
              <p className="text-slate-650 text-sm leading-relaxed">
                The platform utilizes a structured 6-step integration method designed to transition startup concepts into vetted opportunities without intermediate fee processing.
              </p>
            </div>

          </div>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 pt-10 border-t border-slate-200">
            {[
              { title: "Client Profiles", desc: "Entrepreneurs and investors complete structured registration profiles.", icon: <User className="h-5 w-5" /> },
              { title: "Proposal Submission", desc: "Submit project drafts, outlines, milestones, and target goals.", icon: <FileText className="h-5 w-5" /> },
              { title: "Project Matching", desc: "Filter through verified opportunities securely aligned with your budget.", icon: <Search className="h-5 w-5" /> },
              { title: "Engagement Tracking", desc: "Review pitch metrics, express interest, and log feedback.", icon: <BarChart2 className="h-5 w-5" /> },
              { title: "Secure Communication", desc: "Receive immediate approvals and socket updates on negotiation states.", icon: <MessageSquare className="h-5 w-5" /> },
              { title: "Modular Operations", desc: "Join community boards, host pages, and track milestones.", icon: <Layers className="h-5 w-5" /> }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-primary-600 shadow-sm">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
