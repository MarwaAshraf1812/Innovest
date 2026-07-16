import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admins, setAdmins] = useState([])
  const [members, setMembers] = useState([])
  const [pendingMembers, setPendingMembers] = useState([])
  const [communities, setCommunities] = useState([])
  const [pendingPages, setPendingPages] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch admin list
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin`)
      setAdmins(res.data || [])
    } catch (err) {
      console.error('Fetch admins error:', err)
    }
  }

  // Fetch member list
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user`)
      setMembers(res.data || [])
    } catch (err) {
      console.error('Fetch members error:', err)
    }
  }

  // Fetch pending registration requests
  const fetchPendingMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/pending-users`)
      setPendingMembers(res.data || [])
    } catch (err) {
      console.error('Fetch pending users error:', err)
    }
  }

  // Fetch communities
  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${API_URL}/community`)
      setCommunities(res.data?.communities || res.data || [])
    } catch (err) {
      console.error('Fetch communities error:', err)
    }
  }

  // Fetch pending page submissions
  const fetchPendingPages = async () => {
    try {
      const res = await axios.get(`${API_URL}/community/community-pages/pending-pages`)
      setPendingPages(res.data?.data || [])
    } catch (err) {
      console.error('Fetch pending pages error:', err)
      setPendingPages([])
    }
  }

  // Register new sub-admin
  const createAdmin = async (adminData) => {
    const res = await axios.post(`${API_URL}/admin/register`, adminData)
    await fetchAdmins()
    return res.data
  }

  // Manually add new member
  const createMember = async (memberFormData) => {
    const res = await axios.post(`${API_URL}/user/register`, memberFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    await fetchMembers()
    await fetchPendingMembers()
    return res.data
  }

  // Create new community discussion board
  const createCommunity = async (commData) => {
    const res = await axios.post(`${API_URL}/community`, commData)
    await fetchCommunities()
    return res.data
  }

  // Delete administrator account
  const deleteAdmin = async (adminId) => {
    await axios.delete(`${API_URL}/admin/${adminId}`)
    await fetchAdmins()
  }

  // Delete member account
  const deleteMember = async (userId) => {
    await axios.delete(`${API_URL}/user/${userId}`)
    await fetchMembers()
    await fetchPendingMembers()
  }

  // Approve pending registration
  const approveMember = async (userId) => {
    await axios.put(`${API_URL}/user/approve-user/${userId}`)
    await fetchPendingMembers()
    await fetchMembers()
  }

  // Reject pending registration
  const rejectMember = async (userId) => {
    await axios.put(`${API_URL}/user/reject-user/${userId}`)
    await fetchPendingMembers()
    await fetchMembers()
  }

  // Delete community discussion board
  const deleteCommunity = async (commId) => {
    await axios.delete(`${API_URL}/community/${commId}`)
    await fetchCommunities()
  }

  // Approve pending community page
  const approvePage = async (communityId, pageId) => {
    await axios.post(`${API_URL}/community/${communityId}/approve/${pageId}`)
    await fetchPendingPages()
  }

  // Reject pending community page
  const rejectPage = async (communityId, pageId) => {
    await axios.post(`${API_URL}/community/${communityId}/reject/${pageId}`)
    await fetchPendingPages()
  }

  return (
    <AdminContext.Provider value={{
      admins,
      members,
      pendingMembers,
      communities,
      pendingPages,
      loading,
      setLoading,
      fetchAdmins,
      fetchMembers,
      fetchPendingMembers,
      fetchCommunities,
      fetchPendingPages,
      createAdmin,
      createMember,
      createCommunity,
      deleteAdmin,
      deleteMember,
      approveMember,
      rejectMember,
      deleteCommunity,
      approvePage,
      rejectPage
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
