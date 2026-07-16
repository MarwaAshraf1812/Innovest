import React from 'react'
import { Users } from 'lucide-react'

export default function ActiveUsersList({ community, onViewProfile }) {
  const members = community?.users || []

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Users className="h-4.5 w-4.5 text-primary-650" />
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Active Community Members</h4>
      </div>

      {members.length === 0 ? (
        <p className="text-[11px] text-slate-400 italic">No members currently in this room</p>
      ) : (
        <div className="space-y-3">
          {members.map((member, idx) => {
            const initial = typeof member === 'string'
              ? member[0]?.toUpperCase() || '?'
              : member.first_name?.[0]?.toUpperCase() || member.username?.[0]?.toUpperCase() || '?'
            const displayName = typeof member === 'object'
              ? `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.username
              : `Member ${idx + 1}`
            const role = typeof member === 'object' ? member.role || 'MEMBER' : 'MEMBER'
            
            const userId = typeof member === 'object' ? (member.id || member._id) : null;

            const handleMemberClick = () => {
              if (userId && onViewProfile) {
                onViewProfile(userId);
              }
            };

            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between gap-3 text-xs p-1.5 rounded-xl transition-all duration-200
                  ${userId && onViewProfile ? 'hover:bg-slate-50 cursor-pointer active:scale-[0.98]' : ''}`}
                onClick={handleMemberClick}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center font-bold text-primary-700 uppercase transition-all duration-200 hover:scale-105 hover:border-primary-300">
                      {initial}
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 hover:text-primary-600 transition-colors">{displayName}</p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{role}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
