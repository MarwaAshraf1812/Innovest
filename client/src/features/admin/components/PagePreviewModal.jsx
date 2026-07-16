import React from 'react'
import { X, Calendar } from 'lucide-react'
import Button from '../../../components/ui/Button'

export default function PagePreviewModal({ page, onClose }) {
  if (!page) return null
  const rawDate = page.createdAt || page.created_at
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'N/A'

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full p-8 relative space-y-6 animate-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1 bg-transparent border-none cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
              {page.type}
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{page.title}</h3>
          
          <div className="border-t border-slate-100 pt-4">
            <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-wrap">
              {page.content}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  )
}
