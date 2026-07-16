import React from 'react'
import { Calendar, Eye, Check, X } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

export default function PageCard({ page, onPreview, onApprove, onReject, actionLoading }) {
  const rawDate = page.createdAt || page.created_at
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'N/A'
  
  return (
    <Card className="p-6 border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wider">
            {page.type}
          </span>
          <h4 className="font-bold text-slate-900 text-base">{page.title}</h4>
        </div>
        <p className="text-slate-650 text-xs line-clamp-2 max-w-xl leading-relaxed">
          {page.content}
        </p>
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Created: {formattedDate}
          </span>
          <span>Community ID: {page.community_id}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => onPreview(page)}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-rose-600 hover:bg-rose-50 border-rose-200"
          onClick={() => onReject(page.community_id, page.page_id)}
          disabled={actionLoading === page.page_id}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApprove(page.community_id, page.page_id)}
          loading={actionLoading === page.page_id}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
