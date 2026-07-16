import React from 'react'

export default function RoleDropdown({ currentRole, onChange, disabled }) {
  const roles = ['ENTREPRENEUR', 'INVESTOR']

  return (
    <select
      value={currentRole}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="bg-slate-50 border border-slate-200 text-slate-705 text-xs font-semibold rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {roles.map(r => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  )
}
