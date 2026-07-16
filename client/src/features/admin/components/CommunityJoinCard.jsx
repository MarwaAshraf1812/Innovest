import React from 'react'
import { Calendar, Check, X } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

export default function CommunityJoinCard({ request, onApprove, onReject, actionLoading }) {
  const formattedDate = request.requested_at ? new Date(request.requested_at).toLocaleDateString() : 'N/A'
  
  return (
    <Card className="p-6 border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 animate-in fade-in">
      <div className="space-y-1.5">
        <h4 className="font-bold text-slate-900 text-base">
          {request.first_name} {request.last_name}
          <span className="text-xs text-slate-400 font-semibold ml-2">(@{request.username})</span>
        </h4>
        <p className="text-xs text-slate-500 font-semibold">
          Requested to join Community: <span className="text-primary-600 font-bold">#{request.community_name || request.community_id}</span>
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-0.5">
          <Calendar className="h-3.5 w-3.5" />
          Requested On: {formattedDate}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="text-rose-600 hover:bg-rose-50 border-rose-200"
          onClick={() => onReject(request.community_id, request.user_id)}
          disabled={actionLoading === request.user_id}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApprove(request.community_id, request.user_id)}
          loading={actionLoading === request.user_id}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
