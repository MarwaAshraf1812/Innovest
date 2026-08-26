import React from 'react'
import { ArrowRight } from 'lucide-react'
import Card from '../../../components/ui/Card'

export default function CommunityCallouts({ onNavigate, currentUser }) {
  return (
    <section className="py-20 border-b border-slate-100 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            Next Steps
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Join Our Thriving Investment Community</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { title: "Entrepreneur Hub", action: "Create Project", desc: "Submit your project outlines, pitch milestones, and targets to receive investment reviews.", id: "register" },
            { title: "Investor Lounge", action: "Explore Opportunities", desc: "Query, sort, and search verified pitches and direct matching categories.", id: "explore" },
            { title: "Real-time systems", action: "Join Channel", desc: "Leverage instant notification pipelines powered by WebSocket protocols.", id: "explore" },
            { title: "Community pages", action: "Go to Hub", desc: "Align with group projects and comment on modular reports in dedicated community forums.", id: "communities" }
          ].map((hub, idx) => (
            <Card key={idx} className="p-6 flex justify-between items-start gap-6 border-slate-200/80">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{hub.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{hub.desc}</p>
                <button 
                  onClick={() => currentUser ? onNavigate(hub.id) : onNavigate(hub.id === 'register' ? 'register' : 'login')}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5 pt-2 cursor-pointer bg-transparent border-none p-0"
                >
                  {hub.action}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
