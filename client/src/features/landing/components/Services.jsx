import React from 'react'
import { Briefcase, Users, MessageSquare } from 'lucide-react'
import Card from '../../../components/ui/Card'

export default function Services({ id }) {
  return (
    <section id={id} className="py-20 border-b border-slate-100 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            Core Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Connecting Ambitious Entrepreneurs with Visionary Investors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Investment Opportunities", 
              desc: "Discover verified pitches filterable by budget, sector field, and deadline requirements.",
              icon: <Briefcase className="h-6 w-6 text-primary-600" />
            },
            { 
              title: "Professional Networking", 
              desc: "Connect directly inside moderated community channels designed to simplify alignment discussions.",
              icon: <Users className="h-6 w-6 text-primary-600" />
            },
            { 
              title: "Group Discussions", 
              desc: "Join community boards, read modular page reports, and comment on trending market briefs.",
              icon: <MessageSquare className="h-6 w-6 text-primary-600" />
            }
          ].map((srv, idx) => (
            <Card key={idx} className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                {srv.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-lg">{srv.title}</h3>
                <p className="text-slate-650 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
