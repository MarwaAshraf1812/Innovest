import React from 'react'

export default function RoleBadge({ role }) {
  const isInvestor = role === 'INVESTOR'
  const isAdmin = role === 'ADMIN'
  const isSubAdmin = role === 'SUBADMIN'

  let cls = 'text-amber-700 bg-amber-50 border-amber-100'
  if (isAdmin) cls = 'text-rose-700 bg-rose-50 border-rose-100'
  else if (isSubAdmin) cls = 'text-indigo-700 bg-indigo-50 border-indigo-100'
  else if (isInvestor) cls = 'text-emerald-700 bg-emerald-50 border-emerald-100'

  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${cls}`}>
      {role}
    </span>
  )
}
