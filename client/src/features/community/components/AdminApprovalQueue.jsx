import React from 'react'
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, Inbox, Calendar, User, Globe } from 'lucide-react'
import Button from '../../../components/ui/Button'
import PendingPostBadge from './PendingPostBadge'
import { POST_STATUS } from '../hooks/usePostWorkflow'

/**
 * AdminApprovalQueue
 *
 * Full admin triage panel that lists every pending post across all communities,
 * lets admins preview content, and approve or reject with one click.
 *
 * Props:
 *   queue         {Array}    – pending CommunityPage junction records (enriched)
 *   queueLoading  {boolean}
 *   queueError    {string|null}
 *   actionLoading {string|null} – page_id currently being actioned
 *   onApprove     {Function} – (item) => void
 *   onReject      {Function} – (item) => void
 *   onRefresh     {Function}
 *   filterCommunityId {string|null} – only show posts for one community
 */
export default function AdminApprovalQueue({
  queue = [],
  queueLoading = false,
  queueError = null,
  actionLoading = null,
  onApprove,
  onReject,
  onRefresh,
  filterCommunityId = null,
}) {
  const visibleItems = filterCommunityId
    ? queue.filter(item => item.community_id === filterCommunityId)
    : queue

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
      id="admin-approval-queue"
      role="region"
      aria-label="Post Approval Queue"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Approval Queue
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {visibleItems.length} post{visibleItems.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={queueLoading}
          title="Refresh queue"
          aria-label="Refresh approval queue"
          className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${queueLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="divide-y divide-slate-50">
        {queueLoading && visibleItems.length === 0 ? (
          // Skeleton loader
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded-full w-2/5" />
                <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
                <div className="h-2 bg-slate-100 rounded-full w-1/3" />
              </div>
            </div>
          ))
        ) : queueError ? (
          <div className="px-5 py-8 text-center">
            <p className="text-xs font-semibold text-rose-600">{queueError}</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-[11px] text-primary-600 font-bold border-none bg-transparent cursor-pointer hover:underline"
            >
              Try again
            </button>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Inbox className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600">Queue is clear</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No posts pending review right now.</p>
            </div>
          </div>
        ) : (
          visibleItems.map(item => {
            const isActioning = actionLoading === item.page_id
            const page        = item.page || {}
            const author      = item.author || {}
            const community   = item.community || {}

            const authorName = author.first_name
              ? `${author.first_name} ${author.last_name || ''}`.trim()
              : author.username || 'Unknown'

            const submittedAt = page.createdAt
              ? new Date(page.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
              : '—'

            return (
              <div
                key={item._id || item.page_id}
                className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                role="article"
                aria-label={`Pending post: ${page.title || 'Untitled'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className="h-10 w-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-violet-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {page.title || 'Untitled Post'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {page.content || 'No content preview available.'}
                        </p>
                      </div>
                      <PendingPostBadge status={POST_STATUS.PENDING} showLabel={false} className="shrink-0" />
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {community.community_name || item.community_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {submittedAt}
                      </span>
                      {page.page_type && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded uppercase text-[9px] font-extrabold">
                          {page.page_type}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isActioning}
                        disabled={isActioning}
                        onClick={() => onApprove(item)}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 h-auto"
                        id={`approve-btn-${item.page_id}`}
                        aria-label={`Approve post: ${page.title}`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        loading={isActioning}
                        disabled={isActioning}
                        onClick={() => onReject(item)}
                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 h-auto text-rose-600 border-rose-200 hover:bg-rose-50"
                        id={`reject-btn-${item.page_id}`}
                        aria-label={`Reject post: ${page.title}`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
