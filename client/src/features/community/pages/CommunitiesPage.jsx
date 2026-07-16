import React, { useState, useEffect } from 'react'
import { Globe, Plus, X, Trash2, Tag, BookOpen, Layers, ArrowLeft, MessageSquare, Lock } from 'lucide-react'
import axios from 'axios'
import { useCommunity } from '../hooks/useCommunity'
import { usePostWorkflow } from '../hooks/usePostWorkflow'
import { communityService } from '../services/community.service'
import PostCard from '../components/PostCard'
import PostInputGate from '../components/PostInputGate'
import AdminApprovalQueue from '../components/AdminApprovalQueue'
import ActiveUsersList from '../components/ActiveUsersList'
import UpcomingEvents from '../components/UpcomingEvents'
import CommunityMembersManager from '../components/Management/CommunityMembersManager'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Pagination from '../../../components/ui/Pagination'

export default function CommunitiesPage({ currentUser, onViewProfile }) {
  const {
    communities,
    myMemberships,
    loading,
    error,
    refreshCommunities,
    refreshMemberships,
    joinCommunity,
    deleteCommunity,
    createCommunity,
  } = useCommunity(currentUser)

  const [showAddForm, setShowAddForm]   = useState(false)
  const [joiningId, setJoiningId]       = useState(null)
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [communityPages, setCommunityPages]       = useState([])
  const [pagesLoading, setPagesLoading]           = useState(false)

  // Create-community form
  const [name, setName]           = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags]           = useState('')
  const [imageUrl, setImageUrl]   = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError]   = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  // Directory pagination
  const COMM_PAGE_SIZE = 6
  const [commPage, setCommPage] = useState(1)
  const commTotalPages = Math.ceil(communities.length / COMM_PAGE_SIZE)
  const pagedComms     = communities.slice((commPage - 1) * COMM_PAGE_SIZE, commPage * COMM_PAGE_SIZE)

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'

  // ── Post approval workflow ─────────────────────────────────────────────────
  const workflow = usePostWorkflow({
    communityId:    selectedCommunity?.community_id ?? null,
    currentUser,
    myMemberships,
    onPostsRefresh: () => {
      if (selectedCommunity) fetchCommunityPages(selectedCommunity.community_id)
    },
  })

  // ── Community comment gating ───────────────────────────────────────────────
  // We pass canComment down to PostCard so CommentSection is gated
  const canComment = workflow.canComment

  // ── Feed fetcher ───────────────────────────────────────────────────────────
  const fetchCommunityPages = async (commId) => {
    setPagesLoading(true)
    try {
      const pages = await communityService.getCommunityPages(commId)
      setCommunityPages(pages)
    } catch (err) {
      console.error('Failed to fetch community pages:', err)
      setCommunityPages([])
    } finally {
      setPagesLoading(false)
    }
  }

  const handleSelectCommunity = (comm) => {
    setSelectedCommunity(comm)
    fetchCommunityPages(comm.community_id)
  }

  const handleBack = () => {
    setSelectedCommunity(null)
    setCommunityPages([])
    refreshCommunities()
    refreshMemberships()
  }

  // Sidebar custom-event bridge
  useEffect(() => {
    const handler = (e) => {
      const targetComm = e.detail
      if (targetComm) {
        const found = communities.find(c => c.community_id === targetComm.community_id)
        handleSelectCommunity(found || targetComm)
      }
    }
    window.addEventListener('select-community', handler)
    return () => window.removeEventListener('select-community', handler)
  }, [communities])

  // Create community
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
    setFormSuccess(null)
    try {
      const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
      await createCommunity({
        community_name: name,
        description,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        tags: parsedTags,
      })
      setFormSuccess('Community created successfully')
      setName(''); setDescription(''); setTags(''); setImageUrl('')
      setTimeout(() => { setShowAddForm(false); setFormSuccess(null) }, 1500)
    } catch (err) {
      setFormError(err.message || 'Failed to create community')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (e, communityId) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this community discussion board?')) return
    try {
      await deleteCommunity(communityId)
    } catch (err) {
      alert(err.message || 'Failed to delete community')
    }
  }

  const handleJoin = async (e, communityId) => {
    e.stopPropagation()
    setJoiningId(communityId)
    try {
      await joinCommunity(communityId)
      await Promise.all([refreshCommunities(), refreshMemberships()])
    } catch (err) {
      alert(err.message || 'Failed to submit join request')
    } finally {
      setJoiningId(null)
    }
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading && communities.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-650" />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DRILL-DOWN VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCommunity) {
    const { canView, canPost, canComment: canCommentHere, isPending, membershipStatus, isStaff,
            submitting, submitError, submitSuccess, submitPost, clearSubmitState,
            queue, queueLoading, queueError, actionLoading, approvePost, rejectPost, refreshQueue } = workflow

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

        {/* Back nav */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </button>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Main Feed Column ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Community header card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row">
              <div className="h-40 sm:h-auto sm:w-1/3 bg-slate-150">
                <img
                  src={selectedCommunity.image_url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedCommunity.community_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:w-2/3 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedCommunity.community_name}
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed">{selectedCommunity.description}</p>
                </div>
                <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-4">
                  {selectedCommunity.tags?.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-650 rounded-md text-[10px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Gated Post Input ─────────────────────────────────────── */}
            <PostInputGate
              membershipStatus={membershipStatus}
              canPost={canPost}
              isStaff={isStaff}
              submitting={submitting}
              submitError={submitError}
              submitSuccess={submitSuccess}
              onSubmit={submitPost}
              onClear={clearSubmitState}
            />

            {/* ── Content Feed ─────────────────────────────────────────── */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-slate-500" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Community Discussion Feed
                </h3>
              </div>

              {/* Access wall for non-members */}
              {!canView && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-bold text-sm">Members Only Feed</p>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Join this community to read posts and participate in discussions.
                  </p>
                </div>
              )}

              {/* Pending notice banner */}
              {canView && isPending && (
                <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  You're a pending member. You can browse this feed but posting and commenting are unlocked once your membership is approved.
                </div>
              )}

              {/* Feed content */}
              {canView && (
                <>
                  {pagesLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-650" />
                    </div>
                  ) : communityPages.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-2">
                      <p className="text-slate-700 font-bold text-sm">No approved posts yet</p>
                      <p className="text-slate-400 text-xs">
                        Be the first to publish a post inside this community!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communityPages.map((post) => (
                        <PostCard
                          key={post.page_id}
                          post={post}
                          currentUser={currentUser}
                          onViewProfile={onViewProfile}
                          canComment={canCommentHere}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Sidebar Column ──────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Admin approval queue */}
            {isAdmin && (
              <AdminApprovalQueue
                queue={queue}
                queueLoading={queueLoading}
                queueError={queueError}
                actionLoading={actionLoading}
                onApprove={approvePost}
                onReject={rejectPost}
                onRefresh={refreshQueue}
                filterCommunityId={selectedCommunity.community_id}
              />
            )}

            {isAdmin && (
              <CommunityMembersManager
                community={selectedCommunity}
                currentUser={currentUser}
                onViewProfile={onViewProfile}
              />
            )}

            <ActiveUsersList community={selectedCommunity} onViewProfile={onViewProfile} />
            <UpcomingEvents community={selectedCommunity} />
          </div>

        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DIRECTORY GRID VIEW
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Communities Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage network discussion boards, tag lists, and investor circles</p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Cancel' : 'New Community'}
          </Button>
        )}
      </div>

      {/* Create community form */}
      {showAddForm && isAdmin && (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Create New Community</h3>

          {formError && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">{formSuccess}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Community Name" id="commName" type="text" required
                placeholder="e.g. Clean Energy Pioneers"
                value={name} onChange={e => setName(e.target.value)}
                leftIcon={<Globe className="h-4 w-4" />}
              />
              <Input label="Cover Image URL (Optional)" id="commImage" type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                leftIcon={<Layers className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description</label>
              <textarea required rows={3}
                placeholder="What topics, sectors, or goals does this community serve?"
                value={description} onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-400 transition-all resize-none text-slate-800"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <Input label="Tags (comma-separated)" id="commTags" type="text"
                  placeholder="solar, biotech, clean-tech"
                  value={tags} onChange={e => setTags(e.target.value)}
                  leftIcon={<Tag className="h-4 w-4" />}
                />
              </div>
              <Button type="submit" variant="primary" loading={formLoading} className="w-full font-semibold h-10">
                Create Community
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Community grid */}
      {communities.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-2">
          <Globe className="h-10 w-10 text-slate-350 mx-auto" />
          <p className="text-slate-700 font-bold text-sm">No communities yet</p>
          <p className="text-slate-400 text-xs">Create your first discussion community using the button above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedComms.map((comm) => {
              const record     = myMemberships.find(m => m.community_id === comm.community_id)
              const isMember   = record?.member_status === 'APPROVED'
              const isPending  = record?.member_status === 'PENDING'
              const isRejected = record?.member_status === 'REJECTED'
              const canViewFeed = isAdmin || isMember || isPending

              return (
                <div
                  key={comm.community_id || comm._id}
                  onClick={() => { if (canViewFeed) handleSelectCommunity(comm) }}
                  className={[
                    'group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col h-full',
                    canViewFeed ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default',
                  ].join(' ')}
                >
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    <img
                      src={comm.image_url || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'}
                      alt={comm.community_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(e, comm.community_id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 backdrop-blur hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-500 border-none cursor-pointer transition-all shadow-sm z-10"
                        title="Delete Community"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {!isAdmin && (
                      <div className="absolute top-3 right-3 z-10">
                        {isMember  && <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50/95 border border-emerald-200 px-2 py-1 rounded-full backdrop-blur-sm">Joined</span>}
                        {isPending && <span className="flex items-center gap-1 text-[9px] font-extrabold text-amber-700 bg-amber-50/95 border border-amber-200 px-2 py-1 rounded-full backdrop-blur-sm">Pending</span>}
                        {isRejected && <span className="flex items-center gap-1 text-[9px] font-extrabold text-rose-700 bg-rose-50/95 border border-rose-200 px-2 py-1 rounded-full backdrop-blur-sm">Rejected</span>}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-primary-650 transition-colors tracking-tight">
                        {comm.community_name}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{comm.description}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {comm.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {comm.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-650 text-[10px] font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-1.5 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{comm.member_count || 0} Members</span>
                        </div>

                        {!isAdmin && (
                          <div>
                            {!isMember && !isPending && !isRejected && (
                              <Button variant="primary" className="px-4 py-2 text-xs font-bold whitespace-nowrap"
                                onClick={(e) => handleJoin(e, comm.community_id)}
                                loading={joiningId === comm.community_id}
                                disabled={joiningId === comm.community_id}
                              >
                                Join Community
                              </Button>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
                                ⏳ Pending Approval
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-700">
                                Request Declined
                              </span>
                            )}
                            {isMember && (
                              <Button variant="outline" className="px-4 py-2 text-xs font-bold hover:bg-slate-50 whitespace-nowrap"
                                onClick={(e) => { e.stopPropagation(); handleSelectCommunity(comm) }}
                              >
                                Open Feed
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Pagination
            currentPage={commPage}
            totalPages={commTotalPages}
            onPageChange={setCommPage}
            pageSize={COMM_PAGE_SIZE}
            totalItems={communities.length}
          />
        </>
      )}
    </div>
  )
}
