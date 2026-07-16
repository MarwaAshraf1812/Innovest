import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, MapPin, Calendar, FolderOpen, X, CheckCircle2, AlertCircle } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'
import { API_URL } from '../../../config/api'

export default function ExplorePitchesView({ onViewProfile }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [interestStatus, setInterestStatus] = useState({}) // projectId -> 'loading'|'sent'|'duplicate'
  
  const itemsPerPage = 3

  const fetchApprovedProjects = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/project?pagination={"limit":100}`)
      const allProjects = res.data?.projects || []
      const approvedOnly = allProjects.filter(p => p.approved === 'approved')
      setProjects(approvedOnly)
    } catch (err) {
      if (err.response?.status === 404) {
        setProjects([])
      } else {
        console.error('Error fetching explore pitches:', err)
        setProjects([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedProjects()
  }, [])

  const handleExpressInterest = async (projectId) => {
    setInterestStatus(prev => ({ ...prev, [projectId]: 'loading' }))
    try {
      await axios.post(`${API_URL}/project/${projectId}/interest`)
      setInterestStatus(prev => ({ ...prev, [projectId]: 'sent' }))
    } catch (err) {
      const status = err.response?.status
      setInterestStatus(prev => ({ ...prev, [projectId]: status === 409 ? 'duplicate' : 'error' }))
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const filteredPitches = projects.filter(pitch =>
    pitch.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pitch.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pitch.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination calculation
  const totalItems = filteredPitches.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPitches = filteredPitches.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Pitches</h1>
          <p className="text-slate-500 text-xs mt-1">Discover vetted and approved investment opportunities</p>
        </div>
        <div className="w-full sm:max-w-xs">
          <Input
            id="exploreSearch"
            type="text"
            placeholder="Search sector or company..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredPitches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">No Pitches Found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">There are no approved project pitches matching your criteria currently available.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPitches.map((pitch) => {
              const progress = pitch.target && pitch.offer ? Math.min(Math.round((pitch.offer / pitch.target) * 100), 100) : 0
              const isFullyFunded = progress >= 100

              return (
                <Card key={pitch.project_id} className="p-5 flex flex-col justify-between min-h-[280px] shadow-sm border border-slate-200/80" hoverable={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wider">
                        {pitch.field}
                      </span>
                      {isFullyFunded && (
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                          Fully Funded
                        </span>
                      )}
                    </div>
                    {/* Clickable Title opens detailed modal */}
                    <h3 
                      className="text-base font-extrabold text-slate-900 cursor-pointer hover:text-primary-600 hover:underline transition-colors line-clamp-1"
                      onClick={() => setSelectedProject(pitch)}
                      title="Click to view details"
                    >
                      {pitch.project_name}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{pitch.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Budget: ${pitch.budget?.toLocaleString()}</span>
                        {pitch.target && <span>Target: ${pitch.target?.toLocaleString()}</span>}
                      </div>
                      {pitch.target ? (
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isFullyFunded ? 'bg-emerald-500' : 'bg-primary-600'}`} style={{ width: `${progress}%` }} />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Cairo, Egypt</span>
                      <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> {pitch.deadline}</span>
                    </div>

                    <Button 
                      variant={isFullyFunded ? 'outline' : 'primary'} 
                      size="sm" 
                      className="w-full justify-center text-xs h-8"
                      onClick={() => setSelectedProject(pitch)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          onExpressInterest={handleExpressInterest}
          interestStatus={interestStatus[selectedProject?.project_id]}
          onViewProfile={onViewProfile}
        />
      )}

    </div>
  )
}

/* ─── Project Details Modal Component ─────────────────── */
function ProjectDetailsModal({ project, onClose, onExpressInterest, interestStatus, onViewProfile }) {
  const [founder, setFounder] = useState(null)

  useEffect(() => {
    if (project.entrepreneur_id) {
      axios.get(`${API_URL}/user/${project.entrepreneur_id}`)
        .then(res => setFounder(res.data))
        .catch(err => console.error(err))
    }
  }, [project.entrepreneur_id])

  const progress = project.target && project.offer ? Math.min(Math.round((project.offer / project.target) * 100), 100) : 0
  const isFullyFunded = progress >= 100

  const isBusy      = interestStatus === 'loading'
  const alreadySent = interestStatus === 'sent'
  const duplicate   = interestStatus === 'duplicate'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
              {project.field}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
              {project.project_name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About the Project</h4>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Budget</p>
              <p className="text-slate-800 font-bold text-sm mt-0.5">${project.budget?.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Deadline</p>
              <p className="text-slate-800 font-semibold text-sm mt-0.5">{project.deadline}</p>
            </div>
          </div>

          {project.target ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Funding Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${isFullyFunded ? 'bg-emerald-500' : 'bg-primary-600'}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-450">
                <span>Raised: ${project.offer?.toLocaleString() || 0}</span>
                <span>Target: ${project.target?.toLocaleString()}</span>
              </div>
            </div>
          ) : null}

          {founder && (
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project Founder</p>
                <p className="text-slate-800 font-bold text-xs mt-0.5">{founder.first_name} {founder.last_name}</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onViewProfile?.(founder.id);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none"
              >
                View Profile
              </button>
            </div>
          )}

          {project.documents?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documents & Materials</h4>
              <div className="space-y-2">
                {project.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:8000/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <span className="truncate">{doc.split('/').pop()}</span>
                    <span className="text-primary-650 hover:underline">View Document</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
          {(alreadySent || duplicate) && (
            <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
              duplicate
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              {duplicate
                ? 'You have already expressed interest in this project.'
                : 'Expression of interest sent to the entrepreneur!'}
            </div>
          )}
          {interestStatus === 'error' && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Failed to submit interest. Please try again.
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 justify-center text-xs h-9" onClick={onClose}>
              Close
            </Button>
            {!isFullyFunded && !alreadySent && !duplicate && (
              <Button
                variant="primary"
                className="flex-1 justify-center text-xs h-9"
                loading={isBusy}
                onClick={() => onExpressInterest(project.project_id)}
              >
                Express Interest
              </Button>
            )}
            {isFullyFunded && (
              <Button variant="outline" className="flex-1 justify-center text-xs h-9" disabled>
                Fully Funded
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
