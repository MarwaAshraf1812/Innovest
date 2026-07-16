import React from 'react'

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = false,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${
          hoverable 
            ? 'hover:bg-white hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60' 
            : ''
        }
        ${
          glow 
            ? 'border-primary-400/30 shadow-md shadow-primary-500/5' 
            : 'border-slate-200/70'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
