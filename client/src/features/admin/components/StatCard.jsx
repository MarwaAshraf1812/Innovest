import React from 'react'
import Card from '../../../components/ui/Card'

export default function StatCard({ icon: Icon, value, label, trend, trendColor }) {
  return (
    <Card className="p-6 flex items-center justify-between border-slate-200/80">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
          {trend && (
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${trendColor}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200/40 flex items-center justify-center text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  )
}
