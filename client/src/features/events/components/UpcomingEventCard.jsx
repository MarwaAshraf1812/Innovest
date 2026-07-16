import React from 'react'
import {
  Calendar, Clock, MapPin, ExternalLink, Users,
  Megaphone, Zap, Globe,
} from 'lucide-react'

// ── Audience badge config ──────────────────────────────────────────────────────
const AUDIENCE_CONFIG = {
  ALL:          { label: 'All Members',   bg: 'bg-primary-50',  text: 'text-primary-700',  border: 'border-primary-200',  icon: Globe    },
  INVESTOR:     { label: 'Investors',     bg: 'bg-violet-50',   text: 'text-violet-700',   border: 'border-violet-200',   icon: Zap      },
  ENTREPRENEUR: { label: 'Entrepreneurs', bg: 'bg-amber-50',    text: 'text-amber-700',    border: 'border-amber-200',    icon: Megaphone },
  ADMIN:        { label: 'Admins',        bg: 'bg-slate-100',   text: 'text-slate-700',    border: 'border-slate-200',    icon: Users    },
}

// Format: "Wed, Jul 9" or "Today"
function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth()    &&
    d.getDate()     === now.getDate()
  if (isToday) return 'Today'
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return null
  const [h, m] = timeStr.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour   = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

function isUpcoming(dateStr) {
  if (!dateStr) return true
  return new Date(dateStr) >= new Date(new Date().toDateString())
}

/**
 * UpcomingEventCard
 *
 * Displays a single event in a compact, premium card format.
 * Adapts the left accent colour based on audience targeting.
 *
 * Props:
 *   event {Object} – { title, date, time, location, description,
 *                      links: [{url, label}], audiences: string[],
 *                      createdBy, createdAt }
 *   onViewDetail {Function|null}
 *   compact {boolean} – render a smaller sidebar variant
 */
export default function UpcomingEventCard({ event, onViewDetail, compact = false }) {
  if (!event) return null

  const audiences = event.audiences?.length ? event.audiences : ['ALL']
  const primaryAud = audiences[0]
  const audConf   = AUDIENCE_CONFIG[primaryAud] || AUDIENCE_CONFIG.ALL
  const AudIcon   = audConf.icon

  const dateLabel = formatDate(event.date)
  const timeLabel = formatTime(event.time)
  const upcoming  = isUpcoming(event.date)

  // Accent gradient based on audience
  const accentGradients = {
    ALL:          'from-primary-500 to-primary-600',
    INVESTOR:     'from-violet-500 to-violet-600',
    ENTREPRENEUR: 'from-amber-500 to-orange-500',
    ADMIN:        'from-slate-600 to-slate-700',
  }
  const accent = accentGradients[primaryAud] || accentGradients.ALL

  if (compact) {
    return (
      <div
        className="group relative flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
        onClick={() => onViewDetail?.(event)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onViewDetail?.(event)}
        aria-label={`Event: ${event.title}`}
      >
        {/* Date badge */}
        <div className={`shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
          <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
            {event.date ? new Date(event.date).toLocaleDateString([], { month: 'short' }) : '—'}
          </span>
          <span className="text-base font-black leading-none">
            {event.date ? new Date(event.date).getDate() : '?'}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1">
            {event.title || 'Untitled Event'}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
            {timeLabel && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {timeLabel}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>
        </div>

        {!upcoming && (
          <span className="shrink-0 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            Past
          </span>
        )}
      </div>
    )
  }

  // ── Full card ──────────────────────────────────────────────────────────────
  return (
    <article
      className="relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
      aria-label={`Event: ${event.title}`}
    >
      {/* Coloured top stripe */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug">
              {event.title || 'Untitled Event'}
            </h4>
            {event.description && (
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Audience badge */}
          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-extrabold ${audConf.bg} ${audConf.border} ${audConf.text}`}>
            <AudIcon className="h-3 w-3" />
            {audConf.label}
          </span>
        </div>

        {/* Meta grid */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <dt className="sr-only">Date</dt>
            <dd className={`text-xs font-bold ${upcoming ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
              {dateLabel}
              {!upcoming && <span className="ml-1 text-[9px] font-semibold no-underline normal-case not-italic text-slate-400">(past)</span>}
            </dd>
          </div>

          {timeLabel && (
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <dt className="sr-only">Time</dt>
              <dd className="text-xs font-bold text-slate-900">{timeLabel}</dd>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <dt className="sr-only">Location</dt>
              <dd className="text-xs text-slate-600 font-medium truncate">{event.location}</dd>
            </div>
          )}
        </dl>

        {/* Links */}
        {event.links?.filter(l => l.url).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {event.links.filter(l => l.url).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full hover:bg-primary-100 transition-colors"
                aria-label={link.label || link.url}
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                {link.label || 'Open Link'}
              </a>
            ))}
          </div>
        )}

        {/* Multiple audiences */}
        {audiences.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-50">
            {audiences.map(aud => {
              const cfg = AUDIENCE_CONFIG[aud] || AUDIENCE_CONFIG.ALL
              return (
                <span key={aud} className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                  {cfg.label}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
