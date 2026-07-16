import React, { useEffect } from 'react'
import { Users, ShieldAlert } from 'lucide-react'
import { useCommunityModeration } from '../../hooks/useCommunityModeration'
import MemberStatusToggle from './MemberStatusToggle'
import RemoveMemberButton from './RemoveMemberButton'
import Spinner from '../../../../components/Spinner'

export function CommunityMembersManager({ community, currentUser, onViewProfile }) {
  const {
    members,
    loading,
    error,
    fetchMembers,
    toggleMemberActiveStatus,
    removeMember
  } = useCommunityModeration(community?.community_id);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center py-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-primary-650" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Manage Members</h4>
        </div>
        <span className="text-[9px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100 uppercase tracking-wider select-none">
          {members.length} Total
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-semibold rounded-xl flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {members.length === 0 ? (
        <p className="text-[11px] text-slate-400 italic text-center py-2">No members found</p>
      ) : (
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {members.map((member, idx) => {
            const userObj = member.user_id;
            if (!userObj) return null;

            const userId = userObj.id || userObj._id;
            const displayName = `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() || userObj.username;
            const isSelf = userId === currentUser?.id;

            return (
              <div 
                key={member._id || idx} 
                className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-all duration-200"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewProfile?.(userId)}
                    className="h-8 w-8 rounded-full overflow-hidden border border-slate-200/80 select-none cursor-pointer flex items-center justify-center bg-primary-50 text-primary-700 font-bold uppercase p-0 shrink-0 hover:scale-105 transition-transform"
                  >
                    {userObj.profile_image ? (
                      <img src={userObj.profile_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      userObj.first_name?.[0] || userObj.username?.[0] || '?'
                    )}
                  </button>
                  <div className="text-left min-w-0">
                    <button
                      onClick={() => onViewProfile?.(userId)}
                      className="font-bold text-slate-800 hover:text-primary-600 hover:underline cursor-pointer border-none bg-transparent p-0 text-left text-xs block truncate max-w-[85px] sm:max-w-[100px] lg:max-w-[70px] xl:max-w-[100px]"
                    >
                      {displayName}
                    </button>
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {member.role || 'MEMBER'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <MemberStatusToggle
                    isActive={member.is_active}
                    onToggle={() => toggleMemberActiveStatus(userId, member.is_active)}
                    disabled={isSelf}
                  />
                  <RemoveMemberButton
                    username={userObj.username}
                    onRemove={() => removeMember(userId)}
                    disabled={isSelf}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default CommunityMembersManager;
