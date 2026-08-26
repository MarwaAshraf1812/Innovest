import React from 'react'

export function LogoIcon({ className = "h-7 w-7 text-primary-600" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
      <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
      <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({
  showText = true,
  iconClassName = "h-7 w-7 text-primary-600",
  textClassName = "font-extrabold text-xl tracking-tight text-slate-900",
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none' : ''}`}
    >
      <LogoIcon className={iconClassName} />
      {showText && (
        <span className={textClassName}>
          Innovest
        </span>
      )}
    </div>
  )
}
