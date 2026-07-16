import React, { useState } from 'react'
import {
  Calendar, Clock, MapPin, FileText, Users,
  Globe, Zap, Megaphone, Plus, Trash2, Megaphone as BroadcastIcon,
  Sparkles,
} from 'lucide-react'
import EventLinkInput from './EventLinkInput'

// ── Constants ──────────────────────────────────────────────────────────────────
const AUDIENCES = [
  { id: 'ALL',          label: 'All Members',   icon: Globe,     color: 'primary' },
  { id: 'INVESTOR',     label: 'Investors',      icon: Zap,       color: 'violet'  },
  { id: 'ENTREPRENEUR', label: 'Entrepreneurs',  icon: Megaphone, color: 'amber'   },
  { id: 'ADMIN',        label: 'Admins',         icon: Users,     color: 'slate'   },
]

const AUDIENCE_STYLES = {
  primary: {
    off: 'border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50',
    on : 'border-primary-500 bg-primary-50 text-primary-700',
  },
  violet: {
    off: 'border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50',
    on : 'border-violet-500 bg-violet-50 text-violet-700',
  },
  amber: {
    off: 'border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50',
    on : 'border-amber-400 bg-amber-50 text-amber-700',
  },
  slate: {
    off: 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100/70',
    on : 'border-slate-500 bg-slate-100 text-slate-800',
  },
}

const EMPTY_FORM = {
  title       : '',
  date        : '',
  time        : '',
  location    : '',
  description : '',
  audiences   : ['ALL'],
  links       : [{ url: '', label: '' }],
}

// ── Underline field ────────────────────────────────────────────────────────────
function UnderlineField({ id, label, required, icon: Icon, children, hint }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative flex items-center gap-3 border-b border-slate-200 focus-within:border-slate-900 pb-2.5 transition-colors duration-200 group">
        {Icon && <Icon className="h-4 w-4 text-slate-300 group-focus-within:text-slate-500 transition-colors shrink-0" />}
        {children}
      </div>
      {hint && <p className="text-[10px] text-slate-350 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 focus:outline-none'

// ── Main Component ─────────────────────────────────────────────────────────────
/**
 * CreateEventForm
 *
 * Full event-creation form with underline aesthetics.
 * Calls onBroadcast(eventData) when the admin submits.
 * onBroadcast is expected to be an async function; the form
 * handles its own loading + success state.
 *
 * Props:
 *   onBroadcast {Function} async (eventData) => void
 *   onCancel    {Function|null}
 *   community   {Object|null} – pre-binds events to a community
 */
export default function CreateEventForm({ onBroadcast, onCancel, community = null }) {
  const [form, setForm]         = useState({ ...EMPTY_FORM })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState(null)

  // ── Field helpers ────────────────────────────────────────────────────────
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const toggleAudience = (id) => {
    setForm(prev => {
      if (id === 'ALL') return { ...prev, audiences: ['ALL'] }
      const without = prev.audiences.filter(a => a !== 'ALL' && a !== id)
      const hasIt   = prev.audiences.includes(id)
      const next    = hasIt ? without : [...without, id]
      return { ...prev, audiences: next.length ? next : ['ALL'] }
    })
  }

  // ── Link management ──────────────────────────────────────────────────────
  const setLink = (idx, field) => (e) => {
    setForm(prev => {
      const links = prev.links.map((l, i) => i === idx ? { ...l, [field]: e.target.value } : l)
      return { ...prev, links }
    })
  }

  const addLink    = () => setForm(prev => ({ ...prev, links: [...prev.links, { url: '', label: '' }] }))
  const removeLink = (idx) => setForm(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }))

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) {
      setError('Event name and date are required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onBroadcast?.({
        ...form,
        community_id: community?.community_id ?? null,
        links: form.links.filter(l => l.url.trim()),
      })
      setSuccess(true)
      setForm({ ...EMPTY_FORM })
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.message || 'Failed to broadcast event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                <BroadcastIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary-600">
                {community ? community.community_name : 'Platform'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Create Event
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Fill in the details below and broadcast to your target audience.
            </p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors border-none bg-transparent cursor-pointer shrink-0 mt-1"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="px-8 py-8 space-y-10">

          {/* ── Section: Event Details ─────────────────────────────────── */}
          <section aria-labelledby="section-details" className="space-y-6">
            <p id="section-details" className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 border-b border-slate-100 pb-2">
              Event Details
            </p>

            {/* Event name */}
            <UnderlineField id="ev-title" label="Event Name" required icon={Sparkles}>
              <input
                id="ev-title"
                type="text"
                placeholder="Enter a memorable event name"
                value={form.title}
                onChange={set('title')}
                required
                maxLength={120}
                className={inputCls}
              />
              {form.title && (
                <span className="text-[10px] text-slate-300 shrink-0">{form.title.length}/120</span>
              )}
            </UnderlineField>

            {/* Date + Time side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <UnderlineField id="ev-date" label="Date" required icon={Calendar}>
                <input
                  id="ev-date"
                  type="date"
                  value={form.date}
                  onChange={set('date')}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className={`${inputCls} [color-scheme:light]`}
                />
              </UnderlineField>

              <UnderlineField id="ev-time" label="Start Time" icon={Clock}>
                <input
                  id="ev-time"
                  type="time"
                  value={form.time}
                  onChange={set('time')}
                  className={`${inputCls} [color-scheme:light]`}
                />
              </UnderlineField>
            </div>

            {/* Location */}
            <UnderlineField
              id="ev-location"
              label="Location"
              icon={MapPin}
              hint="Physical address, city, or virtual platform (e.g. Zoom, Google Meet)"
            >
              <input
                id="ev-location"
                type="text"
                placeholder="Add physical address or virtual meeting link"
                value={form.location}
                onChange={set('location')}
                className={inputCls}
              />
            </UnderlineField>
          </section>

          {/* ── Section: Description ──────────────────────────────────── */}
          <section aria-labelledby="section-desc" className="space-y-4">
            <p id="section-desc" className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 border-b border-slate-100 pb-2">
              Description
            </p>
            <div className="space-y-1">
              <label htmlFor="ev-desc" className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <FileText className="h-3.5 w-3.5" />
                Brief overview, agenda, or highlights
              </label>
              <textarea
                id="ev-desc"
                rows={4}
                placeholder="Briefly describe the event, highlights, agenda, or what attendees should expect…"
                value={form.description}
                onChange={set('description')}
                maxLength={1200}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-300 focus:outline-none border-b border-slate-200 focus:border-slate-900 pb-2 resize-none transition-colors duration-200 leading-relaxed"
              />
              <div className="flex justify-end">
                <span className="text-[10px] text-slate-300">{form.description.length}/1200</span>
              </div>
            </div>
          </section>

          {/* ── Section: Links ─────────────────────────────────────────── */}
          <section aria-labelledby="section-links" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <p id="section-links" className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                Links
              </p>
              {form.links.length < 4 && (
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-800 transition-colors border-none bg-transparent cursor-pointer"
                  aria-label="Add another link"
                >
                  <Plus className="h-3 w-3" />
                  Add Link
                </button>
              )}
            </div>

            {form.links.map((link, idx) => (
              <div key={idx} className="relative">
                {form.links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    title="Remove this link"
                    className="absolute -right-1 top-0 text-slate-300 hover:text-rose-500 transition-colors border-none bg-transparent cursor-pointer p-0"
                    aria-label={`Remove link ${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <EventLinkInput
                  label={form.links.length > 1 ? `Link ${idx + 1}` : 'External Link'}
                  urlValue={link.url}
                  labelValue={link.label}
                  onUrlChange={setLink(idx, 'url')}
                  onLabelChange={setLink(idx, 'label')}
                />
              </div>
            ))}
          </section>

          {/* ── Section: Target Audience ───────────────────────────────── */}
          <section aria-labelledby="section-audience" className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <p id="section-audience" className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                Target Audience
              </p>
              <p className="text-[11px] text-slate-350 mt-0.5">
                Who should receive this event broadcast?
              </p>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="section-audience">
              {AUDIENCES.map(({ id, label, icon: Icon, color }) => {
                const isSelected = form.audiences.includes(id)
                const styles     = AUDIENCE_STYLES[color]
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAudience(id)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-150 cursor-pointer ${isSelected ? styles.on : styles.off}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    )}
                  </button>
                )
              })}
            </div>
          </section>

        </div>

        {/* ── Footer: Feedback + CTA ──────────────────────────────────────── */}
        <div className="px-8 pb-8 space-y-4">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-semibold">
              <span className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-black text-[10px]">!</span>
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-semibold animate-in fade-in duration-300">
              <span className="shrink-0 h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
              Event broadcast successfully! Members will be notified.
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            id="broadcast-event-btn"
            aria-label="Broadcast this event"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Broadcasting…
              </>
            ) : (
              <>
                <BroadcastIcon className="h-4 w-4" />
                Broadcast Event
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-350 font-medium">
            This will create an alert notification for all targeted audience members.
          </p>
        </div>
      </form>
    </div>
  )
}
