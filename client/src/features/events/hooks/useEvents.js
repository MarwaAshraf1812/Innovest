import { useState, useEffect, useCallback } from 'react'
import { eventService } from '../services/eventService'

/**
 * useEvents
 *
 * Manages event list state + broadcast action.
 * Optionally scoped to a community.
 *
 * @param {Object} opts
 * @param {string|null} opts.communityId – scope to a single community, or null for platform-wide
 * @param {boolean}     opts.isAdmin     – gate broadcast capability
 */
export function useEvents({ communityId = null, isAdmin = false } = {}) {
  const [events, setEvents]         = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastError, setBroadcastError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = communityId
        ? await eventService.getCommunityEvents(communityId)
        : await eventService.getPlatformEvents()
      setEvents(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [communityId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  /**
   * broadcastEvent(eventData)
   * Admin-only action: creates the event and re-fetches the list.
   */
  const broadcastEvent = useCallback(async (eventData) => {
    if (!isAdmin) throw new Error('Only administrators can broadcast events.')
    setBroadcasting(true)
    setBroadcastError(null)
    try {
      const result = await eventService.broadcastEvent({ ...eventData, community_id: communityId })
      // Optimistically prepend
      setEvents(prev => [result?.page || result, ...prev])
      await fetchEvents()
      return result
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to broadcast event.'
      setBroadcastError(msg)
      throw new Error(msg)
    } finally {
      setBroadcasting(false)
    }
  }, [isAdmin, communityId, fetchEvents])

  return {
    events,
    loading,
    error,
    broadcasting,
    broadcastError,
    broadcastEvent,
    refreshEvents: fetchEvents,
  }
}
