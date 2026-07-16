import { useState, useCallback } from 'react'
import { communityService } from '../services/community.service'

export function useCommunityModeration(communityId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMembers = useCallback(async () => {
    if (!communityId) return
    setLoading(true)
    setError(null)
    try {
      const data = await communityService.getCommunityMembers(communityId)
      setMembers(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load community members')
    } finally {
      setLoading(false)
    }
  }, [communityId])

  const toggleMemberActiveStatus = async (userId, currentIsActive) => {
    setError(null)
    try {
      await communityService.updateMemberActiveStatus(communityId, userId, !currentIsActive)
      setMembers((prev) =>
        prev.map((m) => {
          const mUserId = typeof m.user_id === 'object' ? (m.user_id.id || m.user_id._id) : m.user_id;
          if (mUserId === userId) {
            return { ...m, is_active: !currentIsActive };
          }
          return m;
        })
      )
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update member status';
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  const removeMember = async (userId) => {
    setError(null)
    try {
      await communityService.removeMemberFromCommunity(communityId, userId)
      setMembers((prev) =>
        prev.filter((m) => {
          const mUserId = typeof m.user_id === 'object' ? (m.user_id.id || m.user_id._id) : m.user_id;
          return mUserId !== userId;
        })
      )
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to remove member';
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  return {
    members,
    loading,
    error,
    fetchMembers,
    toggleMemberActiveStatus,
    removeMember,
  }
}
