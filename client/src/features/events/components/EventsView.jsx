import React, { useState } from 'react'
import { Calendar, Plus, X, Inbox } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import CreateEventForm from './CreateEventForm'
import UpcomingEventCard from './UpcomingEventCard'
import Button from '../../../components/ui/Button'

/**
 * EventsView
 *
 * Platform-level events dashboard. Admin users get the broadcast
 * creation form; all users see the upcoming events feed.
 *
 * Props:
 *   currentUser  {Object}
 *   community    {Object|null}  – if provided, scopes the view to one community
 */
export default function EventsView({ currentUser, community = null }) {
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SUB_ADMIN'].includes(currentUser?.role)
  const [showForm, setShowForm] = useState(false)

  const { events, loading, error, broadcastEvent, refreshEvents } = useEvents({
    communityId: community?.community_id ?? null,
    isAdmin,
  })

  const handleBroadcast = async (eventData) => {
    await broadcastEvent(eventData)
    setShowForm(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="events-view">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {community ? `${community.community_name} Events` : 'Platform Events'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {community
              ? 'Upcoming events and announcements for this community.'
              : 'Scheduled meetups, webinars, and announcements across the platform.'}
          </p>
        </div>

        {isAdmin && (
          <Button
            variant={showForm ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 font-bold shrink-0"
            id="toggle-create-event-btn"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Create Event'}
          </Button>
        )}
      </div>

      {/* ── Create Event Form ─────────────────────────────────────────────── */}
      {showForm && isAdmin && (
        <CreateEventForm
          onBroadcast={handleBroadcast}
          onCancel={() => setShowForm(false)}
          community={community}
        />
      )}

      {/* ── Events Feed ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Upcoming Events
          </h2>
          {!loading && events.length > 0 && (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {events.length}
            </span>
          )}
        </div>

        {loading ? (
          // Skeleton loader
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse space-y-3">
                <div className="h-1 w-full bg-slate-100 rounded-full" />
                <div className="h-4 bg-slate-100 rounded-full w-2/5" />
                <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-slate-100 rounded-full" />
                  <div className="h-3 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs font-semibold text-rose-700">{error}</p>
            <button
              onClick={refreshEvents}
              className="text-[11px] text-primary-600 font-bold border-none bg-transparent cursor-pointer hover:underline"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-14 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
              <Inbox className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-slate-700 font-bold text-sm">No events scheduled yet</p>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">
              {isAdmin
                ? 'Create your first event using the button above. Members will be notified instantly.'
                : 'Check back soon — upcoming events will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event, i) => {
              // Normalise: community pages store event_meta as a JSON field
              const meta = event.event_meta || {}
              const normalised = {
                title      : event.title,
                description: event.content || event.description,
                date       : meta.date       || event.date,
                time       : meta.time       || event.time,
                location   : event.location  || meta.location,
                links      : meta.links      || event.links || [],
                audiences  : meta.audiences  || event.audiences || ['ALL'],
                createdAt  : event.createdAt,
                page_id    : event.page_id,
              }
              return <UpcomingEventCard key={event.page_id || i} event={normalised} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
