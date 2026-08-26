import React from 'react'
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function PitchFormModal({
  isOpen,
  onClose,
  editingPitch,
  projectName, setProjectName,
  description, setDescription,
  field, setField,
  deadline, setDeadline,
  budget, setBudget,
  target, setTarget,
  offer, setOffer,
  file, handleFileChange,
  actionLoading,
  error,
  success,
  onSubmit
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {editingPitch ? 'Edit Pitch Details' : 'Submit New Pitch'}
          </h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <Input
            label="Project Name"
            id="projectName"
            type="text"
            required
            placeholder="e.g. Eco Energy Storage"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Tell us what your project does, the core solution it offers, and your business model..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-400 transition-all resize-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Field / Sector"
              id="field"
              type="text"
              required
              placeholder="e.g. Cleantech"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
            <Input
              label="Deadline / Target Date"
              id="deadline"
              type="text"
              required
              placeholder="e.g. Sep 30, 2026"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Budget ($)"
              id="budget"
              type="number"
              required
              placeholder="50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <Input
              label="Target Funding ($)"
              id="target"
              type="number"
              placeholder="100000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <Input
              label="Raised / Offer ($)"
              id="offer"
              type="number"
              placeholder="0"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
          </div>

          {/* Pitch deck document upload */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {editingPitch ? 'Update Pitch Deck / Verification Scan (PDF/Doc)' : 'Pitch Deck / Verification Scan (PDF/Doc)'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-20 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-all p-3 bg-white">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">
                    {file ? file.name : (editingPitch && editingPitch.documents?.length > 0 ? `Current: ${editingPitch.documents[0]} (Click to replace)` : "Upload Document")}
                  </span>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-bold text-xs cursor-pointer transition-all bg-transparent"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {editingPitch ? 'Save Changes' : 'Submit Pitch'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  )
}
