import React from 'react'

export default function Alert({ type, text }) {
  const isError = type === 'error'
  return (
    <div className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-top-4 duration-300
      ${isError 
        ? 'bg-rose-50 border-rose-150 text-rose-700 shadow-sm shadow-rose-500/5' 
        : 'bg-emerald-50 border-emerald-150 text-emerald-700 shadow-sm shadow-emerald-500/5'}`}
    >
      <div className={`h-2 w-2 rounded-full ${isError ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-ping'}`} />
      <span>{text}</span>
    </div>
  )
}
