import React from 'react'

export default function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm animate-in fade-in duration-300">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        {desc && <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{desc}</p>}
      </div>
    </div>
  )
}
