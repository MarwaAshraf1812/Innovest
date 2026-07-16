import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API_URL } from '../../../config/api'

/**
 * Membership status constants mirroring the DB enum.
 */
export const MEMBERSHIP_STATUS = {
  APPROVED: 'APPROVED',
  PENDING:  'PENDING',
  REJECTED: 'REJECTED',
  NONE:     'NONE',
}

/**
 * Post workflow status constants mirroring the CommunityPages.page_status enum.
 */
export const POST_STATUS = {
  PENDING:  'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

// ─── REST helpers ──────────────────────────────────────────────────────────────
const postWorkflowApi = {
  /** Fetch all PENDING pages across every community (admin only). */
  async getPendingQueue() {
    const { data } = await axios.get(`${API_URL}/community-pages/pending-pages`)
    return data?.data || []
  },

  /** Approve a single pending post. */
  async approvePost(communityId, pageId) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}/approve/${pageId}`)
    return data
  },

  /** Reject a single pending post. */
  async rejectPost(communityId, pageId) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}/reject/${pageId}`)
    return data
  },

  /** Submit a new post to a community (creates in PENDING state). */
  async submitPost(communityId, postData) {
    const { data } = await axios.post(`${API_URL}/community/${communityId}`, postData)
    return data
  },
}

// ─── Main hook ─────────────────────────────────────────────────────────────────
/**
 * usePostWorkflow
 *
 * Centralises all state and side-effects for the community content pipeline:
 *   • Resolves the calling user's membership status for a given community.
 *   • Provides submit / approve / reject actions.
 *   • Manages the admin-facing pending approval queue.
 *
 * @param {Object} opts
 * @param {string|null} opts.communityId   – The active community's ID.
 * @param {Object|null} opts.currentUser   – Authenticated user object.
 * @param {string[]}    opts.myMemberships – Raw CommunityUsers records for the user.
 * @param {Function}    [opts.onPostsRefresh] – Called after a successful approve/reject so the feed re-fetches.
 */
export function usePostWorkflow({ communityId, currentUser, myMemberships = [], onPostsRefresh }) {
  // ── Derived membership for this specific community ─────────────────────────
  const memberRecord = communityId
    ? myMemberships.find(m => m.community_id === communityId)
    : null

  const membershipStatus = memberRecord?.member_status ?? MEMBERSHIP_STATUS.NONE

  const isStaff     = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role)
  const isMember    = isStaff || membershipStatus === MEMBERSHIP_STATUS.APPROVED
  const isPending   = !isStaff && membershipStatus === MEMBERSHIP_STATUS.PENDING
  const isRejected  = membershipStatus === MEMBERSHIP_STATUS.REJECTED

  /**
   * Gates:
   *   canPost    – can submit new content
   *   canComment – can leave comments on posts
   *   canView    – can view the feed at all
   */
  const canPost    = isMember && !isPending
  const canComment = isMember && !isPending
  const canView    = isStaff || isMember || isPending

  // ── Post submission ────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  const submitPost = useCallback(async (postData) => {
    if (!communityId || !canPost) return
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)
    try {
      const result = await postWorkflowApi.submitPost(communityId, postData)
      setSubmitSuccess('Post submitted! It will appear once an admin approves it.')
      return result
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit post.'
      setSubmitError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }, [communityId, canPost])

  const clearSubmitState = useCallback(() => {
    setSubmitError(null)
    setSubmitSuccess(null)
  }, [])

  // ── Admin approval queue ───────────────────────────────────────────────────
  const [queue, setQueue] = useState([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null) // pageId being actioned

  const fetchQueue = useCallback(async () => {
    if (!isStaff) return
    setQueueLoading(true)
    setQueueError(null)
    try {
      const items = await postWorkflowApi.getPendingQueue()
      setQueue(items)
    } catch (err) {
      // 404 just means empty queue
      if (err.response?.status === 404) {
        setQueue([])
      } else {
        setQueueError(err.response?.data?.message || 'Failed to load approval queue.')
      }
    } finally {
      setQueueLoading(false)
    }
  }, [isStaff])

  // Load queue on mount / when staff status changes
  useEffect(() => {
    if (isStaff) fetchQueue()
  }, [isStaff, fetchQueue])

  const approvePost = useCallback(async (pendingItem) => {
    setActionLoading(pendingItem.page_id)
    try {
      await postWorkflowApi.approvePost(pendingItem.community_id, pendingItem.page_id)
      setQueue(prev => prev.filter(p => p.page_id !== pendingItem.page_id))
      onPostsRefresh?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not approve post.')
    } finally {
      setActionLoading(null)
    }
  }, [onPostsRefresh])

  const rejectPost = useCallback(async (pendingItem) => {
    setActionLoading(pendingItem.page_id)
    try {
      await postWorkflowApi.rejectPost(pendingItem.community_id, pendingItem.page_id)
      setQueue(prev => prev.filter(p => p.page_id !== pendingItem.page_id))
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject post.')
    } finally {
      setActionLoading(null)
    }
  }, [])

  return {
    // Membership
    membershipStatus,
    isMember,
    isPending,
    isRejected,
    isStaff,

    // Gate flags
    canPost,
    canComment,
    canView,

    // Post submission
    submitting,
    submitError,
    submitSuccess,
    submitPost,
    clearSubmitState,

    // Approval queue (admin)
    queue,
    queueLoading,
    queueError,
    actionLoading,
    approvePost,
    rejectPost,
    refreshQueue: fetchQueue,
  }
}
