import React from 'react'

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-4 text-slate-400 flex items-center pointer-events-none">
            {leftIcon}
          </span>
        )}
        
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full bg-slate-50/80 text-slate-950 placeholder-slate-400 rounded-xl px-4 py-3 text-sm border transition-all duration-350 focus:outline-none focus:bg-white disabled:opacity-50 disabled:pointer-events-none
            ${leftIcon ? 'pl-11' : ''} 
            ${rightIcon ? 'pr-11' : ''} 
            ${
              error 
                ? 'border-rose-350 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15'
            }
          `}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-4 text-slate-400 flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className="text-[11px] font-medium text-rose-500 mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-450 mt-0.5">{helperText}</span>
      ) : null}
    </div>
  )
}
