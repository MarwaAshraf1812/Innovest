import React from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import ProposalThread from './ProposalThread'

import { API_URL } from '../../../config/api'

export default function ProjectDetailsModal({ project, onClose }) {
  const progress = project.target && project.offer ? Math.min(Math.round((project.offer / project.target) * 100), 100) : 0
  const isFullyFunded = progress >= 100

  // Status badge classes
  const isApproved = project.approved === 'approved'
  const isRejected = project.approved === 'rejected'
  const statusLabel = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Under Review'
  const statusClass = isApproved 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
    : isRejected 
      ? 'bg-rose-50 text-rose-700 border-rose-250' 
      : 'bg-amber-50 text-amber-700 border-amber-250'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
                {project.field}
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusClass}`}>
                {statusLabel}
              </span>
            </div>
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
              <div className="flex justify-between text-xs font-bold text-slate-650">
                <span>Funding Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${isFullyFunded ? 'bg-emerald-500' : 'bg-primary-600'}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>Raised: ${project.offer?.toLocaleString() || 0}</span>
                <span>Target: ${project.target?.toLocaleString()}</span>
              </div>
            </div>
          ) : null}

          {project.documents?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documents & Materials</h4>
              <div className="space-y-2">
                {project.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={`${API_URL}/project/${project.project_id}/documents/${doc.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <span className="truncate">{doc.split('/').pop()}</span>
                    <span className="text-primary-600 hover:underline">View Document</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Proposal & Counter-Offer Negotiation Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Negotiation & Proposals</h4>
            <ProposalThread projectId={project.project_id} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
          <Button variant="outline" className="w-full justify-center text-xs h-9" onClick={onClose}>
            Close Window
          </Button>
        </div>

      </div>
    </div>
  )
}
