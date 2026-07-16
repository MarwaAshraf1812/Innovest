import axios from 'axios'
import { API_URL } from '../../../config/api'

/**
 * eventService
 * REST layer for event CRUD and notification broadcasting.
 * Events are stored as community pages of type EVENT, or as
 * standalone alert records — we keep both paths available.
 */
export const eventService = {
  /**
   * Broadcast a new event.
   * Creates a CommunityPage (page_type = EVENT) and, upon success,
   * emits a server-side notification to every targeted audience member.
   */
  async broadcastEvent(eventData) {
    // Build page payload compatible with the existing pages endpoint
    const payload = {
      title       : eventData.title,
      content     : eventData.description || '',
      page_type   : 'EVENT',
      tags        : eventData.tags || [],
      location    : eventData.location || undefined,
      // Serialise extra event fields as JSON in meta
      event_meta  : {
        date     : eventData.date,
        time     : eventData.time,
        links    : eventData.links || [],
        audiences: eventData.audiences || ['ALL'],
      },
    }

    // If bound to a specific community, post to that community's pages endpoint
    if (eventData.community_id) {
      const { data } = await axios.post(
        `${API_URL}/community/${eventData.community_id}`,
        payload,
      )
      return data
    }

    // Platform-wide event (admin only) — post to a generic events endpoint if available
    const { data } = await axios.post(`${API_URL}/events`, payload)
    return data
  },

  /** Fetch all events for a given community (approved only for members). */
  async getCommunityEvents(communityId) {
    const { data } = await axios.get(`${API_URL}/community/${communityId}/pages`)
    const pages = data?.pages || []
    return pages.filter(p => p.page_type === 'EVENT')
  },

  /** Fetch platform-wide (non-community) events. */
  async getPlatformEvents() {
    try {
      const { data } = await axios.get(`${API_URL}/events`)
      return data?.events || data || []
    } catch {
      return []
    }
  },
}
