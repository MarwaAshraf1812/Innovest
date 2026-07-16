import React, { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useEvents } from '../../events/hooks/useEvents'
import UpcomingEventCard from '../../events/components/UpcomingEventCard'
import CreateEventForm from '../../events/components/CreateEventForm'
import useAuthRole from '../../admin/hooks/useAuthRole'

/**
 * UpcomingEvents
 * Sidebar widget — shows compact event cards for a given community,
 * and lets admins open the full creation form inline.
 */
export default function UpcomingEvents({ community }) {
  const { isStaff } = useAuthRole()
  const [showCreate, setShowCreate] = useState(false)

  const { events, loading, broadcastEvent } = useEvents({
    communityId: community?.community_id ?? null,
    isAdmin: isStaff,
  })

  const handleBroadcast = async (eventData) => {
    await broadcastEvent(eventData)
    setShowCreate(false)
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary-650" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Upcoming Events
          </h4>
        </div>
        {isStaff && (
          <button
            onClick={() => setShowCreate(v => !v)}
            className="flex items-center justify-center h-6 w-6 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors border-none bg-transparent cursor-pointer"
            title="Create new event"
            aria-label="Create event"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Inline create form (admin only) */}
      {showCreate && isStaff && (
        <div className="border-b border-slate-100">
          <CreateEventForm
            onBroadcast={handleBroadcast}
            onCancel={() => setShowCreate(false)}
            community={community}
          />
        </div>
      )}

      {/* Events list */}
      <div className="p-4 space-y-2">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          ))
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <Calendar className="h-8 w-8 text-slate-200" />
            <p className="text-[11px] text-slate-400 italic">
              No upcoming events for{' '}
              <span className="font-semibold text-slate-600">
                {community?.community_name || 'this community'}
              </span>.
            </p>
            {isStaff && (
              <button
                onClick={() => setShowCreate(true)}
                className="text-[11px] text-primary-600 font-bold border-none bg-transparent cursor-pointer hover:underline"
              >
                + Schedule one
              </button>
            )}
          </div>
        ) : (
          events.slice(0, 4).map((event, i) => {
            const meta = event.event_meta || {}
            const normalised = {
              title      : event.title,
              description: event.content,
              date       : meta.date || event.date,
              time       : meta.time || event.time,
              location   : event.location || meta.location,
              links      : meta.links || [],
              audiences  : meta.audiences || ['ALL'],
            }
            return (
              <UpcomingEventCard key={event.page_id || i} event={normalised} compact />
            )
          })
        )}
      </div>
    </div>
  )
}
