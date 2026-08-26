import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../config/api'
import Spinner from '../../../components/Spinner'
import Button from '../../../components/ui/Button'
import { CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Percent, Clock, AlertCircle, Send, Ban } from 'lucide-react'

const STATUS_BADGES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  countered: 'bg-blue-100 text-blue-800 border-blue-300',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  withdrawn: 'bg-slate-100 text-slate-800 border-slate-300'
}

export default function ProposalThread({ proposalId, projectId, currentUser, onUpdate }) {
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Counter form state
  const [showCounterForm, setShowCounterForm] = useState(false)
  const [counterAmount, setCounterAmount] = useState('')
  const [counterEquity, setCounterEquity] = useState('')
  const [counterConditions, setCounterConditions] = useState('')

  // Initial proposal state (if creating new)
  const [showInitialForm, setShowInitialForm] = useState(false)
  const [initialAmount, setInitialAmount] = useState('')
  const [initialEquity, setInitialEquity] = useState('')
  const [initialConditions, setInitialConditions] = useState('')

  const fetchProposal = async () => {
    try {
      setLoading(true)
      setError('')
      if (proposalId) {
        const { data } = await axios.get(`${API_URL}/proposal/${proposalId}`, { withCredentials: true })
        setProposal(data)
      } else if (projectId) {
        // Fetch proposal for project
        const { data } = await axios.get(`${API_URL}/proposal/project/${projectId}`, { withCredentials: true })
        if (Array.isArray(data) && data.length > 0) {
          setProposal(data[0]) // latest active proposal
        } else {
          setProposal(null)
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load proposal thread')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposal()
  }, [proposalId, projectId])

  // Create initial proposal
  const handleCreateOffer = async (e) => {
    e.preventDefault()
    try {
      setActionLoading(true)
      setError('')
      const payload = {
        project_id: projectId,
        amount: Number(initialAmount),
        equity_offered: Number(initialEquity),
        conditions: initialConditions
      }
      const { data } = await axios.post(`${API_URL}/proposal`, payload, { withCredentials: true })
      setProposal(data)
      setShowInitialForm(false)
      if (onUpdate) onUpdate(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal offer')
    } finally {
      setActionLoading(false)
    }
  }

  // Counter proposal
  const handleCounterSubmit = async (e) => {
    e.preventDefault()
    if (!proposal) return
    try {
      setActionLoading(true)
      setError('')
      const payload = {
        amount: Number(counterAmount),
        equity_offered: Number(counterEquity),
        conditions: counterConditions
      }
      const { data } = await axios.put(`${API_URL}/proposal/${proposal.proposal_id}/counter`, payload, { withCredentials: true })
      setProposal(data)
      setShowCounterForm(false)
      setCounterAmount('')
      setCounterEquity('')
      setCounterConditions('')
      if (onUpdate) onUpdate(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit counter offer')
    } finally {
      setActionLoading(false)
    }
  }

  // Accept proposal
  const handleAccept = async () => {
    if (!proposal) return
    try {
      setActionLoading(true)
      setError('')
      const { data } = await axios.put(`${API_URL}/proposal/${proposal.proposal_id}/accept`, {}, { withCredentials: true })
      setProposal(data)
      if (onUpdate) onUpdate(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept proposal')
    } finally {
      setActionLoading(false)
    }
  }

  // Reject proposal
  const handleReject = async () => {
    if (!proposal) return
    try {
      setActionLoading(true)
      setError('')
      const { data } = await axios.put(`${API_URL}/proposal/${proposal.proposal_id}/reject`, {}, { withCredentials: true })
      setProposal(data)
      if (onUpdate) onUpdate(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject proposal')
    } finally {
      setActionLoading(false)
    }
  }

  // Withdraw proposal
  const handleWithdraw = async () => {
    if (!proposal) return
    try {
      setActionLoading(true)
      setError('')
      const { data } = await axios.put(`${API_URL}/proposal/${proposal.proposal_id}/withdraw`, {}, { withCredentials: true })
      setProposal(data)
      if (onUpdate) onUpdate(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw proposal')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <Spinner />

  const isInvestor = currentUser?.id === proposal?.investor_id || currentUser?.role === 'INVESTOR'
  const isEntrepreneur = currentUser?.id === proposal?.entrepreneur_id || currentUser?.role === 'ENTREPRENEUR'
  
  // Turn determination
  const userRoleStr = isInvestor ? 'investor' : 'entrepreneur'
  const isMyTurn = proposal && ['pending', 'countered'].includes(proposal.status) && proposal.last_action_by !== userRoleStr
  const isFinalized = proposal && ['accepted', 'rejected', 'withdrawn'].includes(proposal.status)

  if (!proposal) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <div>
          <h3 className="font-bold text-slate-800 text-base">No Active Negotiation</h3>
          <p className="text-xs text-slate-500 mt-1">
            {isInvestor 
              ? 'You have not submitted a formal investment proposal for this pitch.' 
              : 'No formal investment proposals have been submitted for this pitch yet.'}
          </p>
        </div>

        {isInvestor && !showInitialForm && (
          <Button variant="primary" size="sm" onClick={() => setShowInitialForm(true)} className="flex items-center gap-2 mx-auto">
            <Send className="w-4 h-4" /> Submit Investment Proposal
          </Button>
        )}

        {showInitialForm && (
          <form onSubmit={handleCreateOffer} className="bg-white p-5 rounded-xl border border-slate-200 text-left space-y-4 max-w-lg mx-auto shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm">Submit Deal Proposal</h4>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Investment Amount ($)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 50000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Equity Requested / Offered (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 10"
                value={initialEquity}
                onChange={(e) => setInitialEquity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Conditions / Clauses</label>
              <textarea
                rows="2"
                placeholder="e.g. Board seat, quarterly audit rights..."
                value={initialConditions}
                onChange={(e) => setInitialConditions(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setShowInitialForm(false)}>Cancel</Button>
              <Button variant="primary" size="sm" type="submit" disabled={actionLoading}>
                {actionLoading ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm space-y-6 p-6">
      
      {/* Proposal Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-slate-400">Deal Negotiation Thread</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${STATUS_BADGES[proposal.status] || STATUS_BADGES.pending}`}>
              {proposal.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Proposal ID: <span className="font-mono font-medium text-slate-700">{proposal.proposal_id}</span>
          </p>
        </div>

        {/* Current Active Terms Summary Box */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-6 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Amount</span>
            <span className="font-extrabold text-slate-900 text-sm">${proposal.current_terms.amount.toLocaleString()}</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Equity</span>
            <span className="font-extrabold text-primary-600 text-sm">{proposal.current_terms.equity_offered}%</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Chronological Negotiation Audit Trail */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Negotiation History</h4>
        
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
          {proposal.history.map((round, idx) => {
            const isInvestorRound = round.proposed_by === 'investor'
            return (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                {/* Timeline Node Badge */}
                <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full flex items-center justify-center border text-[11px] font-bold ${
                  round.action === 'accept' ? 'bg-emerald-500 text-white border-emerald-600' :
                  round.action === 'reject' ? 'bg-rose-500 text-white border-rose-600' :
                  isInvestorRound ? 'bg-primary-500 text-white border-primary-600' : 'bg-slate-800 text-white border-slate-900'
                }`}>
                  {round.action === 'accept' ? '✓' : round.action === 'reject' ? '✕' : idx + 1}
                </div>

                {/* Round Content Card */}
                <div className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 capitalize">
                      {round.proposed_by} {round.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(round.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Offer Amount</span>
                      <span className="font-semibold text-slate-800">${round.terms.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Equity Offered</span>
                      <span className="font-semibold text-primary-600">{round.terms.equity_offered}%</span>
                    </div>
                    {round.terms.conditions && (
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block">Conditions</span>
                        <span className="font-medium text-slate-600 italic truncate block">{round.terms.conditions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Negotiation Actions & Counter Form */}
      {!isFinalized && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          
          {isMyTurn ? (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-slate-900 text-xs">Action Required: Your Turn to Respond</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Review the current terms above. You can Accept, Reject, or Submit a Counter-Offer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button variant="primary" size="sm" onClick={handleAccept} disabled={actionLoading} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Accept Terms
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowCounterForm(!showCounterForm)} disabled={actionLoading} className="flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4" /> Counter Offer
                </Button>
                <Button variant="outline" size="sm" onClick={handleReject} disabled={actionLoading} className="flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200">
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Awaiting response from the other party...</span>
              </div>

              {isInvestor && (
                <Button variant="outline" size="sm" onClick={handleWithdraw} disabled={actionLoading} className="flex items-center gap-1 text-slate-500 hover:bg-slate-100">
                  <Ban className="w-3.5 h-3.5" /> Withdraw Proposal
                </Button>
              )}
            </div>
          )}

          {/* Counter Offer Modal / Inline Form */}
          {showCounterForm && isMyTurn && (
            <form onSubmit={handleCounterSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Submit Counter-Offer Terms</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Counter Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={`e.g. ${proposal.current_terms.amount}`}
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Counter Equity (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder={`e.g. ${proposal.current_terms.equity_offered}`}
                    value={counterEquity}
                    onChange={(e) => setCounterEquity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Revised Conditions / Remarks</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Adjusted milestone schedule..."
                  value={counterConditions}
                  onChange={(e) => setCounterConditions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowCounterForm(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Submitting Counter...' : 'Submit Counter Offer'}
                </Button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  )
}
