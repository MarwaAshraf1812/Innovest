import { useState, useEffect, useCallback } from 'react'
import { communityService } from '../services/community.service'

export function useCommunity(currentUser) {
  const [communities, setCommunities] = useState([])
  const [myMemberships, setMyMemberships] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCommunities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await communityService.getCommunities()
      setCommunities(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch communities')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMyMemberships = useCallback(async () => {
    if (!currentUser || currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') {
      return
    }
    try {
      const data = await communityService.getMyMemberships()
      setMyMemberships(data)
    } catch (err) {
      console.error('Failed to fetch memberships:', err)
    }
  }, [currentUser])

  useEffect(() => {
    loadCommunities()
    loadMyMemberships()
  }, [loadCommunities, loadMyMemberships])

  const joinCommunity = async (communityId) => {
    try {
      await communityService.joinCommunity(communityId)
      await loadMyMemberships()
      return { success: true }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to join community')
    }
  }

  const deleteCommunity = async (communityId) => {
    try {
      await communityService.deleteCommunity(communityId)
      await loadCommunities()
      return { success: true }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete community')
    }
  }

  const createCommunity = async (communityData) => {
    try {
      const data = await communityService.createCommunity(communityData)
      await loadCommunities()
      return data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create community')
    }
  }

  return {
    communities,
    myMemberships,
    loading,
    error,
    refreshCommunities: loadCommunities,
    refreshMemberships: loadMyMemberships,
    joinCommunity,
    deleteCommunity,
    createCommunity
  }
}
