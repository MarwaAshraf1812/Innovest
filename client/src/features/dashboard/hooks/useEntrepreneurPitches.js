import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../config/api'

export default function useEntrepreneurPitches(currentUser) {
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPitch, setEditingPitch] = useState(null) // null for create, project object for edit
  const [selectedProject, setSelectedProject] = useState(null) // for project details view modal

  // Form Fields
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [field, setField] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [offer, setOffer] = useState('')
  const [target, setTarget] = useState('')
  const [file, setFile] = useState(null)

  const fetchPitches = async () => {
    if (!currentUser?.id) return
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/project/user/${currentUser.id}`)
      setPitches(res.data || [])
    } catch (err) {
      if (err.response?.status === 404) {
        setPitches([])
      } else {
        console.error('Error fetching user pitches:', err)
        setPitches([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPitches()
  }, [currentUser])

  const openCreateModal = () => {
    setEditingPitch(null)
    setProjectName('')
    setDescription('')
    setField('')
    setBudget('')
    setDeadline('')
    setOffer('')
    setTarget('')
    setFile(null)
    setError(null)
    setSuccess(null)
    setIsModalOpen(true)
  }

  const openEditModal = (pitch) => {
    setEditingPitch(pitch)
    setProjectName(pitch.project_name || '')
    setDescription(pitch.description || '')
    setField(pitch.field || '')
    setBudget(pitch.budget || '')
    setDeadline(pitch.deadline || '')
    setOffer(pitch.offer || '')
    setTarget(pitch.target || '')
    setFile(null)
    setError(null)
    setSuccess(null)
    setIsModalOpen(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault()
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingPitch) {
        // Update: PUT request (FormData if file attached, JSON otherwise)
        if (file) {
          const formData = new FormData()
          formData.append('project_name', projectName)
          formData.append('description', description)
          formData.append('field', field)
          formData.append('budget', budget)
          formData.append('deadline', deadline)
          if (offer) formData.append('offer', offer)
          if (target) formData.append('target', target)
          formData.append('documents', file)

          await axios.put(`${API_URL}/project/${editingPitch.project_id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          const payload = {
            project_name: projectName,
            description: description,
            field: field,
            budget: Number(budget),
            deadline: deadline,
            offer: offer ? Number(offer) : null,
            target: target ? Number(target) : null
          }
          await axios.put(`${API_URL}/project/${editingPitch.project_id}`, payload)
        }
        setSuccess('Pitch updated successfully!')
      } else {
        // Create: POST request with FormData
        const formData = new FormData()
        formData.append('project_name', projectName)
        formData.append('description', description)
        formData.append('field', field)
        formData.append('budget', budget)
        formData.append('deadline', deadline)
        if (offer) formData.append('offer', offer)
        if (target) formData.append('target', target)
        if (file) {
          formData.append('documents', file)
        }

        await axios.post(`${API_URL}/project`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setSuccess('Pitch submitted successfully under review!')
      }

      setTimeout(() => {
        setIsModalOpen(false)
        fetchPitches()
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process pitch request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this pitch?')) return
    try {
      await axios.delete(`${API_URL}/project/${projectId}`)
      fetchPitches()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project')
    }
  }

  // Pagination calculation
  const totalItems = pitches.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPitches = pitches.slice(startIndex, startIndex + itemsPerPage)

  return {
    pitches,
    loading,
    actionLoading,
    error,
    success,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedPitches,
    isModalOpen,
    setIsModalOpen,
    editingPitch,
    selectedProject,
    setSelectedProject,
    projectName,
    setProjectName,
    description,
    setDescription,
    field,
    setField,
    budget,
    setBudget,
    deadline,
    setDeadline,
    offer,
    setOffer,
    target,
    setTarget,
    file,
    openCreateModal,
    openEditModal,
    handleFileChange,
    handleFormSubmit,
    handleDelete
  }
}
