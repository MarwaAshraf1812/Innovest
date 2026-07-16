import React from 'react'

export default function Stats() {
  return (
    <section className="py-20 border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Title */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connecting <br className="hidden sm:inline" />
              Entrepreneurs and <br />
              <span className="text-primary-600">Investors</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Innovest removes communication silos. Startups obtain transparency on requirements, while investors gain secure access to vetted documents.
            </p>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { val: "5.5 Million", desc: "Our global active user community" },
              { val: "24 Billion", desc: "Total funds raised through matching" },
              { val: "99%", desc: "Project verification rate" }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 shadow-sm text-center sm:text-left space-y-2">
                <span className="text-3xl font-black text-slate-900 bg-gradient-to-r from-slate-900 to-primary-600 bg-clip-text text-transparent block">
                  {stat.val}
                </span>
                <p className="text-xs text-slate-500 font-semibold leading-normal">{stat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
