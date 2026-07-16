import React from 'react'
import { FolderOpen, Plus } from 'lucide-react'
import useEntrepreneurPitches from '../hooks/useEntrepreneurPitches'
import PitchCard from './PitchCard'
import PitchFormModal from './PitchFormModal'
import ProjectDetailsModal from './ProjectDetailsModal'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'

export default function EntrepreneurPitchesView({ currentUser }) {
  const {
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
    projectName, setProjectName,
    description, setDescription,
    field, setField,
    deadline, setDeadline,
    budget, setBudget,
    target, setTarget,
    offer, setOffer,
    file,
    openCreateModal,
    openEditModal,
    handleFileChange,
    handleFormSubmit,
    handleDelete
  } = useEntrepreneurPitches(currentUser)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Active Pitches</h1>
          <p className="text-slate-500 text-xs mt-1">Track funding status, progress bars, and admin reviews</p>
        </div>
        <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Pitch
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : pitches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">No Pitches Found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">You haven't submitted any pitches yet. Start funding your idea now!</p>
          </div>
          <Button variant="primary" size="sm" onClick={openCreateModal}>Submit Your First Pitch</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedPitches.map((pitch) => (
              <PitchCard
                key={pitch.project_id}
                pitch={pitch}
                currentUser={currentUser}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onViewDetails={setSelectedProject}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}

      {/* Create / Edit Pitch Modal */}
      {isModalOpen && (
        <PitchFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingPitch={editingPitch}
          projectName={projectName}
          setProjectName={setProjectName}
          description={description}
          setDescription={setDescription}
          field={field}
          setField={setField}
          deadline={deadline}
          setDeadline={setDeadline}
          budget={budget}
          setBudget={setBudget}
          target={target}
          setTarget={setTarget}
          offer={offer}
          setOffer={setOffer}
          file={file}
          handleFileChange={handleFileChange}
          actionLoading={actionLoading}
          error={error}
          success={success}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

    </div>
  )
}
