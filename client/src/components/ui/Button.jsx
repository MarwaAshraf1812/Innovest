import React from 'react'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-wide rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/10 hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5 border border-primary-600',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 hover:-translate-y-0.5',
    outline: 'bg-transparent hover:bg-primary-50 text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    glass: 'bg-white/70 backdrop-blur-md hover:bg-white/90 text-slate-850 border border-slate-200/80 hover:border-primary-400 hover:shadow-md',
  }

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  )
}
