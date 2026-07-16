import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAdmin } from '../../../context/AdminContext'
import { API_URL } from '../../../config/api'

export default function useAdminDashboard() {
  const {
    pendingMembers,
    members,
    communities,
    pendingPages,
    loading: contextLoading,
    fetchPendingMembers,
    fetchMembers,
    fetchCommunities,
    fetchPendingPages,
    approveMember,
    rejectMember,
    approvePage,
    rejectPage
  } = useAdmin()

  const [underReviewProjects, setUnderReviewProjects] = useState([])
  const [projectsCount, setProjectsCount] = useState(0)
  const [pendingCommunityJoins, setPendingCommunityJoins] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [memberAction, setMemberAction] = useState(null)
  const [pageAction, setPageAction] = useState(null)
  const [projectAction, setProjectAction] = useState(null)
  const [communityJoinAction, setCommunityJoinAction] = useState(null)
  
  const [message, setMessage] = useState(null)
  const [queueTab, setQueueTab] = useState('members')
  const [previewPage, setPreviewPage] = useState(null)

  const fetchProjects = async () => {
    try {
      // 1. Fetch pitches under review
      const resPending = await axios.get(`${API_URL}/project/status/under-review`)
      setUnderReviewProjects(resPending.data || [])

      // 2. Fetch all pitches to count the approved/vetted ones
      const resAll = await axios.get(`${API_URL}/project?pagination={"limit":200}`)
      const allProjects = resAll.data?.projects || resAll.data || []
      const vetted = allProjects.filter(p => p.approved === 'approved')
      setProjectsCount(vetted.length)
    } catch (err) {
      console.error('Error fetching admin projects:', err)
    }
  }

  const fetchCommunityJoins = async () => {
    try {
      const res = await axios.get(`${API_URL}/community/users/pending-users`)
      const list = res.data || []
      // Map response to the format expected by CommunityJoinCard
      const formatted = list.map(item => ({
        user_id: item.user_id,
        community_id: item.community_id,
        first_name: item.user?.first_name || 'Unknown',
        last_name: item.user?.last_name || '',
        username: item.user?.username || '',
        community_name: item.community?.community_name || item.community_id,
        requested_at: item.createdAt || new Date()
      }))
      setPendingCommunityJoins(formatted)
    } catch (err) {
      if (err.response?.status === 404) {
        setPendingCommunityJoins([])
      } else {
        console.error('Error fetching pending community joins:', err)
      }
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchPendingMembers(),
          fetchMembers(),
          fetchCommunities(),
          fetchPendingPages(),
          fetchProjects(),
          fetchCommunityJoins()
        ])
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  const handleApproveMember = async (userId) => {
    setMemberAction(userId)
    setMessage(null)
    try {
      await approveMember(userId)
      setMessage({ type: 'success', text: 'Member registration approved successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to approve member' })
    } finally {
      setMemberAction(null)
    }
  }

  const handleRejectMember = async (userId) => {
    setMemberAction(userId)
    setMessage(null)
    try {
      await rejectMember(userId)
      setMessage({ type: 'success', text: 'Member registration rejected successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reject member' })
    } finally {
      setMemberAction(null)
    }
  }

  const handlePageApprove = async (communityId, pageId) => {
    setPageAction(pageId)
    setMessage(null)
    try {
      await approvePage(communityId, pageId)
      setMessage({ type: 'success', text: 'Page report approved successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to approve page report' })
    } finally {
      setPageAction(null)
    }
  }

  const handlePageReject = async (communityId, pageId) => {
    setPageAction(pageId)
    setMessage(null)
    try {
      await rejectPage(communityId, pageId)
      setMessage({ type: 'success', text: 'Page report rejected successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reject page report' })
    } finally {
      setPageAction(null)
    }
  }

  const handleProjectApprove = async (projectId) => {
    setProjectAction(projectId)
    setMessage(null)
    try {
      await axios.put(`${API_URL}/project/approve/${projectId}`)
      setMessage({ type: 'success', text: 'Startup pitch approved successfully' })
      await fetchProjects()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to approve project' })
    } finally {
      setProjectAction(null)
    }
  }

  const handleProjectReject = async (projectId) => {
    setProjectAction(projectId)
    setMessage(null)
    try {
      await axios.put(`${API_URL}/project/reject/${projectId}`)
      setMessage({ type: 'success', text: 'Startup pitch rejected successfully' })
      await fetchProjects()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reject project' })
    } finally {
      setProjectAction(null)
    }
  }

  const handleCommunityJoinApprove = async (communityId, userId) => {
    setCommunityJoinAction(userId)
    setMessage(null)
    try {
      await axios.get(`${API_URL}/community/${communityId}/approve-user/${userId}`)
      setMessage({ type: 'success', text: 'Community join request approved' })
      await fetchCommunityJoins()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to approve join request' })
    } finally {
      setCommunityJoinAction(null)
    }
  }

  const handleCommunityJoinReject = async (communityId, userId) => {
    setCommunityJoinAction(userId)
    setMessage(null)
    try {
      await axios.delete(`${API_URL}/community/${communityId}/reject-user/${userId}`)
      setMessage({ type: 'success', text: 'Community join request rejected' })
      await fetchCommunityJoins()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reject join request' })
    } finally {
      setCommunityJoinAction(null)
    }
  }

  return {
    pendingMembers,
    members,
    communities,
    pendingPages,
    projectsCount,
    underReviewProjects,
    pendingCommunityJoins,
    loading: loading || contextLoading,
    memberAction,
    pageAction,
    projectAction,
    communityJoinAction,
    message,
    queueTab,
    setQueueTab,
    previewPage,
    setPreviewPage,
    handleApproveMember,
    handleRejectMember,
    handlePageApprove,
    handlePageReject,
    handleProjectApprove,
    handleProjectReject,
    handleCommunityJoinApprove,
    handleCommunityJoinReject
  }
}
