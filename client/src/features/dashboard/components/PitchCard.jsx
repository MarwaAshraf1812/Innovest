import React from 'react'
import { MapPin, Calendar, Edit3, Trash2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

export default function PitchCard({ pitch, currentUser, onEdit, onDelete, onViewDetails }) {
  const progress = pitch.target && pitch.offer ? Math.min(Math.round((pitch.offer / pitch.target) * 100), 100) : 0
  
  const isApproved = pitch.approved === 'approved'
  const isRejected = pitch.approved === 'rejected'
  const statusLabel = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Under Review'
  const statusClass = isApproved 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : isRejected 
      ? 'bg-rose-50 text-rose-700 border-rose-200' 
      : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <Card className="p-5 flex flex-col justify-between min-h-[280px] shadow-sm relative group border border-slate-200/80" hoverable={true}>
      
      {/* Actions overlay */}
      <div className="absolute top-4 right-4 flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(pitch)}
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
          title="Edit Pitch"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => onDelete(pitch.project_id)}
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 cursor-pointer"
          title="Delete Pitch"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wider">
            {pitch.field}
          </span>
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        
        <div>
          {/* Clickable project name opens detailed modal */}
          <h3 
            className="text-base font-extrabold text-slate-900 cursor-pointer hover:text-primary-600 hover:underline transition-colors line-clamp-1 pr-14"
            onClick={() => onViewDetails(pitch)}
            title="Click to view details"
          >
            {pitch.project_name}
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
            {pitch.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>Budget: ${pitch.budget?.toLocaleString()}</span>
            {pitch.target && <span>Target: ${pitch.target?.toLocaleString()}</span>}
          </div>
          {pitch.target ? (
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          ) : null}
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {currentUser?.country || 'Cairo, Egypt'}</span>
          <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> {pitch.deadline}</span>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-center text-xs h-8"
          onClick={() => onViewDetails(pitch)}
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}
