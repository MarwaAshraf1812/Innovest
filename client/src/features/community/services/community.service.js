import axios from 'axios'
import { API_URL } from '../../../config/api'

export const communityService = {
  async getCommunities() {
    const { data } = await axios.get(`${API_URL}/community`)
    return data?.communities || data || []
  },

  async getMyMemberships() {
    const { data } = await axios.get(`${API_URL}/community/memberships/my`)
    return data || []
  },

  async getCommunityPages(communityId) {
    const { data } = await axios.get(`${API_URL}/community/${communityId}/pages`)
    return data?.pages || []
  },

  async createCommunity(communityData) {
    const { data } = await axios.post(`${API_URL}/community`, communityData)
    return data
  },

  // ── Post workflow ────────────────────────────────────────────────────────
  /** Submit a new post — lands in PENDING state on the server. */
  async submitPost(communityId, postData) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}`, postData)
    return data
  },

  /** Admin: fetch all pending posts across all communities. */
  async getPendingPosts() {
    const { data } = await axios.get(`${API_URL}/community-pages/pending-pages`)
    return data?.data || []
  },

  /** Admin: approve a pending post. */
  async approvePost(communityId, pageId) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}/approve/${pageId}`)
    return data
  },

  /** Admin: reject a pending post. */
  async rejectPost(communityId, pageId) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}/reject/${pageId}`)
    return data
  },

  // ── Community management ─────────────────────────────────────────────────
  async deleteCommunity(communityId) {
    const { data } = await axios.delete(`${API_URL}/community/${communityId}`)
    return data
  },

  async joinCommunity(communityId) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}/join`)
    return data
  },

  async getCommunityMembers(communityId) {
    const { data } = await axios.get(`${API_URL}/community/${communityId}/users`)
    return data || []
  },

  async updateMemberActiveStatus(communityId, userId, isActive) {
    const { data } = await axios.put(`${API_URL}/community/${communityId}/users/${userId}/status`, { is_active: isActive })
    return data
  },

  async removeMemberFromCommunity(communityId, userId) {
    const { data } = await axios.delete(`${API_URL}/community/${communityId}/users/${userId}`)
    return data
  },
}

