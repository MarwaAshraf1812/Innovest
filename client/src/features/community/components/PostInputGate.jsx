import React, { useState } from 'react'
import { Send, X, Sparkles, Lock, Clock } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { MEMBERSHIP_STATUS } from '../hooks/usePostWorkflow'

/**
 * PostInputGate
 *
 * Renders the post creation form only when the user holds an APPROVED membership.
 * Shows contextual locked/pending states for all other cases.
 *
 * Props:
 *   membershipStatus {string}   – from usePostWorkflow
 *   canPost          {boolean}  – gate flag
 *   isStaff          {boolean}  – admin bypass
 *   submitting       {boolean}
 *   submitError      {string|null}
 *   submitSuccess    {string|null}
 *   onSubmit         {Function} – (postData) => Promise
 *   onClear          {Function} – resets submit state
 */
export default function PostInputGate({
  membershipStatus,
  canPost,
  isStaff,
  submitting,
  submitError,
  submitSuccess,
  onSubmit,
  onClear,
}) {
  const [open, setOpen]             = useState(false)
  const [title, setTitle]           = useState('')
  const [content, setContent]       = useState('')
  const [postType, setPostType]     = useState('POST')
  const [tags, setTags]             = useState('')
  const [location, setLocation]     = useState('')

  // ── Blocked States ─────────────────────────────────────────────────────────
  if (!canPost && !isStaff) {
    if (membershipStatus === MEMBERSHIP_STATUS.PENDING) {
      return (
        <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800">Membership Pending</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Your join request is awaiting admin approval. You'll be able to post once approved.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <Lock className="h-4 w-4 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700">Members Only</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Join this community to post content and participate in discussions.
          </p>
        </div>
      </div>
    )
  }

  // ── Reset on cancel ─────────────────────────────────────────────────────────
  const handleCancel = () => {
    setOpen(false)
    setTitle('')
    setContent('')
    setTags('')
    setLocation('')
    setPostType('POST')
    onClear?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    await onSubmit({
      title,
      content,
      page_type: postType,
      tags: parsedTags,
      location: location || undefined,
    })
    // If success, reset form but keep the success banner visible briefly
    setTitle('')
    setContent('')
    setTags('')
    setLocation('')
    setPostType('POST')
    setTimeout(() => {
      setOpen(false)
      onClear?.()
    }, 3000)
  }

  // ── Collapsed trigger ──────────────────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-primary-300 hover:bg-primary-50/40 transition-all duration-200 cursor-pointer group"
        aria-label="Write a new post"
        id="post-input-gate-trigger"
      >
        <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
          <Sparkles className="h-4 w-4 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 group-hover:text-primary-700 transition-colors">
            Share something with the community…
          </p>
        </div>
        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full shrink-0">
          Write Post
        </span>
      </button>
    )
  }

  // ── Expanded form ──────────────────────────────────────────────────────────
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      id="post-creation-form"
    >
      {/* Form header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Publish a Community Post
          </h3>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Close post form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Feedback banners */}
      {submitError && (
        <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
          {submitSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4 space-y-4">
        <Input
          label="Post Title"
          id="gate-postTitle"
          required
          placeholder="e.g. Scaling Algal Bio-Reactor Yields"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Content Type
            </label>
            <select
              value={postType}
              onChange={e => setPostType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 text-slate-800 transition-all font-semibold"
            >
              <option value="POST">General Discussion</option>
              <option value="ARTICLE">Deep Dive Article</option>
              <option value="EVENT">Community Meetup</option>
              <option value="PROJECT_INFO">Project / Pitch Info</option>
            </select>
          </div>
          <Input
            label="Location (Optional)"
            id="gate-postLoc"
            placeholder="e.g. Cairo, Egypt"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        <Input
          label="Tags (comma-separated)"
          id="gate-postTags"
          placeholder="e.g. bio-fuel, clean-tech, startup"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Message Details <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Provide details about your project, article, or discussion point…"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-400 transition-all resize-none text-slate-800"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[10px] text-slate-400 font-medium">
            Your post will be reviewed before appearing on the feed.
          </p>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={submitting}
              className="flex items-center gap-1.5 font-bold"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Review
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
