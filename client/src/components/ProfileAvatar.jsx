import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileAvatar({ userId, role = 'ENTREPRENEUR', imageUrl, initials, className = 'h-10 w-10' }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.stopPropagation()
    if (!userId) return
    // Navigate for Entrepreneur and Investor roles
    if (['ENTREPRENEUR', 'INVESTOR'].includes(role)) {
      navigate(`/profile/${userId}`)
    }
  }

  const isClickable = ['ENTREPRENEUR', 'INVESTOR'].includes(role) && userId

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block rounded-full overflow-hidden border border-slate-202 bg-slate-50 shrink-0 select-none transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:scale-105 hover:border-primary-500 hover:shadow-sm' : ''} ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className={`h-full w-full bg-primary-100 text-primary-700 font-extrabold items-center justify-center text-xs
          ${imageUrl ? 'hidden' : 'flex'}`}
      >
        {initials || 'U'}
      </div>
    </div>
  )
}
