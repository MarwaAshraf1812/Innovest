import React from 'react'
import { Calendar, Check, X } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

export default function ProjectCard({ project, onApprove, onReject, actionLoading }) {
  const progress = project.target && project.offer
    ? Math.min(Math.round((project.offer / project.target) * 100), 100)
    : 0

  return (
    <Card className="p-6 border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 animate-in fade-in">
      <div className="space-y-3 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wider">
            {project.field}
          </span>
          <h4 className="font-bold text-slate-900 text-base truncate">{project.project_name}</h4>
        </div>
        <p className="text-slate-650 text-xs line-clamp-2 max-w-xl leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold pt-1">
          <span>Budget: ${project.budget?.toLocaleString()}</span>
          {project.target && <span>• Target: ${project.target?.toLocaleString()}</span>}
          {project.deadline && (
            <span className="flex items-center gap-1">
              • <Calendar className="h-3.5 w-3.5" />
              Deadline: {project.deadline}
            </span>
          )}
        </div>

        {project.target && (
          <div className="space-y-1 max-w-xs pt-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Progress: {progress}%</span>
              <span>Offered: ${project.offer?.toLocaleString() || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="text-rose-600 hover:bg-rose-50 border-rose-200"
          onClick={() => onReject(project.project_id || project.id)}
          disabled={actionLoading === (project.project_id || project.id)}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApprove(project.project_id || project.id)}
          loading={actionLoading === (project.project_id || project.id)}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
