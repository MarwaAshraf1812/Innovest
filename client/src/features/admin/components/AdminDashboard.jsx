import React from 'react'
import { Users, Briefcase, Globe, FileText, UserCheck } from 'lucide-react'
import useAdminDashboard from '../hooks/useAdminDashboard'
import StatCard from './StatCard'
import MemberCard from './MemberCard'
import ProjectCard from './ProjectCard'
import CommunityJoinCard from './CommunityJoinCard'
import PageCard from './PageCard'
import PagePreviewModal from './PagePreviewModal'
import Spinner from '../../../components/Spinner'
import EmptyState from '../../../components/EmptyState'
import Alert from '../../../components/Alert'

export default function AdminDashboard() {
  const {
    pendingMembers,
    members,
    communities,
    pendingPages,
    projectsCount,
    underReviewProjects,
    pendingCommunityJoins,
    loading,
    memberAction,
    pageAction,
    projectAction,
    communityJoinAction,
    message,
    queueTab,
    setQueueTab,
    previewPage,
    setPreviewPage,
    handleApproveMember,
    handleRejectMember,
    handlePageApprove,
    handlePageReject,
    handleProjectApprove,
    handleProjectReject,
    handleCommunityJoinApprove,
    handleCommunityJoinReject
  } = useAdminDashboard()

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">Approve network participants, startup pitches, and post updates</p>
        </div>
      </div>

      {/* Alert Banner */}
      {message && <Alert type={message.type} text={message.text} />}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UserCheck}
          value={pendingMembers.length}
          label="Pending Registrations"
          trend={`${members.length} active`}
          trendColor="bg-slate-100 text-slate-600"
        />
        <StatCard
          icon={Briefcase}
          value={projectsCount}
          label="Vetted Startups"
          trend={`${underReviewProjects.length} reviewing`}
          trendColor={underReviewProjects.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}
        />
        <StatCard
          icon={Globe}
          value={communities.length}
          label="Sponsor Channels"
        />
        <StatCard
          icon={FileText}
          value={pendingPages.length}
          label="Awaiting Reports"
        />
      </div>

      {/* Main Verification Queue Area */}
      <div className="space-y-6">
        <div className="border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Verification Queues</h2>
          <div className="flex flex-wrap gap-2 -mb-px">
            {[
              { id: 'members', label: 'Member Registration', count: pendingMembers.length },
              { id: 'projects', label: 'Startup Pitches', count: underReviewProjects.length },
              { id: 'joins', label: 'Community Joins', count: pendingCommunityJoins.length },
              { id: 'pages', label: 'Page Reports', count: pendingPages.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setQueueTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer bg-transparent
                  ${queueTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'}`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full
                    ${queueTab === tab.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-555'}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panel Content */}
        <div className="space-y-4">
          {queueTab === 'members' && (
            pendingMembers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Pending Registrations"
                desc="All user applications have been processed. Great job!"
              />
            ) : (
              <div className="space-y-4">
                {pendingMembers.map((user) => (
                  <MemberCard
                    key={user._id || user.id}
                    user={user}
                    onApprove={handleApproveMember}
                    onReject={handleRejectMember}
                    actionLoading={memberAction}
                  />
                ))}
              </div>
            )
          )}

          {queueTab === 'projects' && (
            underReviewProjects.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No Pitches Awaiting Vetting"
                desc="All entrepreneur startup pitches are clean and vetted."
              />
            ) : (
              <div className="space-y-4">
                {underReviewProjects.map((proj) => (
                  <ProjectCard
                    key={proj.project_id || proj.id}
                    project={proj}
                    onApprove={handleProjectApprove}
                    onReject={handleProjectReject}
                    actionLoading={projectAction}
                  />
                ))}
              </div>
            )
          )}

          {queueTab === 'joins' && (
            pendingCommunityJoins.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No Join Requests"
                desc="No member is waiting for community channel approvals."
              />
            ) : (
              <div className="space-y-4">
                {pendingCommunityJoins.map((req, index) => (
                  <CommunityJoinCard
                    key={req.user_id + '-' + index}
                    request={req}
                    onApprove={handleCommunityJoinApprove}
                    onReject={handleCommunityJoinReject}
                    actionLoading={communityJoinAction}
                  />
                ))}
              </div>
            )
          )}

          {queueTab === 'pages' && (
            pendingPages.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Pending Page Reports"
                desc="All community board pages and posts are published and live."
              />
            ) : (
              <div className="space-y-4">
                {pendingPages.map((page) => (
                  <PageCard
                    key={page.page_id}
                    page={page}
                    onPreview={setPreviewPage}
                    onApprove={handlePageApprove}
                    onReject={handlePageReject}
                    actionLoading={pageAction}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Page Preview Modal */}
      {previewPage && (
        <PagePreviewModal
          page={previewPage}
          onClose={() => setPreviewPage(null)}
        />
      )}

    </div>
  )
}
