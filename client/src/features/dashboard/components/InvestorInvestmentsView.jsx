import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Briefcase, FolderOpen, ArrowRightLeft, Eye } from 'lucide-react'
import Card from '../../../components/ui/Card'
import { API_URL } from '../../../config/api'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'
import Button from '../../../components/ui/Button'
import ProposalThread from './ProposalThread'

const STATUS_STYLES = {
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  countered: 'bg-blue-50 text-blue-700 border-blue-100',
  accepted:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected:  'bg-rose-50 text-rose-700 border-rose-100',
  withdrawn: 'bg-slate-50 text-slate-700 border-slate-100',
}

export default function InvestorInvestmentsView({ currentUser }) {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading]     = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProposalId, setSelectedProposalId] = useState(null)
  const itemsPerPage = 5

  const fetchProposals = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/proposal/my`, { withCredentials: true })
      setProposals(data || [])
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch investor proposals:', err)
      }
      setProposals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  if (loading) {
    return <Spinner />
  }

  const totalItems = proposals.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginated = proposals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deal Proposals & Negotiations</h1>
        <p className="text-slate-500 text-xs mt-1">Audit active investment proposals, terms, counter-offers, and deal status</p>
      </div>

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">No Active Proposals</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              You haven't submitted any formal deal proposals yet. Explore pitches and click "Submit Proposal" to begin negotiations.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-3 px-6">Proposal ID</th>
                    <th className="py-3 px-6">Current Amount</th>
                    <th className="py-3 px-6">Equity Offered</th>
                    <th className="py-3 px-6">Last Action</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginated.map((prop) => {
                    const statusCls = STATUS_STYLES[prop.status] || STATUS_STYLES.pending

                    return (
                      <tr key={prop.proposal_id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-900">
                          {prop.proposal_id.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${prop.current_terms?.amount?.toLocaleString() || '—'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-primary-600">
                          {prop.current_terms?.equity_offered ? `${prop.current_terms.equity_offered}%` : '—'}
                        </td>
                        <td className="py-4 px-6 text-slate-500 capitalize text-xs">
                          {prop.last_action_by || '—'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${statusCls}`}>
                            {prop.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedProposalId(prop.proposal_id)}
                            className="inline-flex items-center gap-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Thread
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}

      {/* Selected Proposal Negotiation Thread Modal */}
      {selectedProposalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Proposal Negotiation Thread</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedProposalId(null)}>Close</Button>
            </div>
            <div className="p-6 overflow-y-auto">
              <ProposalThread 
                proposalId={selectedProposalId} 
                currentUser={currentUser} 
                onUpdate={fetchProposals}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
