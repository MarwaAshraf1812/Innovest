import React from 'react'
import Card from '../../../components/ui/Card'

export default function Testimonials({ id }) {
  const testimonials = [
    { name: "Clara Cruz", role: "Biotech Entrepreneur", desc: "Innovest helped us find our lead investor in less than three weeks without broker fees.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" },
    { name: "Robert Martinez", role: "Venture Partner", desc: "The verification system saves us hundreds of hours of initial due diligence.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
    { name: "Sara Benson", role: "Cleantech Advocate", desc: "Joining the community hub let us align with other matching platforms easily.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120" },
    { name: "James Tan", role: "Tech Angel Investor", desc: "A simple, clean interface that prioritizes metrics and raw project potential.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" }
  ]

  return (
    <section id={id} className="py-20 border-b border-slate-100 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            Testimonials
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Empowering Connections for Innovators</h2>
          <p className="text-slate-500 text-sm">Here is what our actual members are saying</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((test, idx) => (
            <Card key={idx} className="p-6 flex flex-col items-center text-center space-y-4">
              <img 
                src={test.img} 
                alt={test.name} 
                className="h-16 w-16 rounded-full object-cover border-2 border-primary-500/20 shadow-sm" 
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{test.role}</span>
              </div>
              <p className="text-slate-650 text-xs italic leading-relaxed">
                "{test.desc}"
              </p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
