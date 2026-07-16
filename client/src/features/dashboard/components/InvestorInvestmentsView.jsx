import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Briefcase, FolderOpen } from 'lucide-react'
import Card from '../../../components/ui/Card'
import { API_URL } from '../../../config/api'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'

const STATUS_STYLES = {
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  failed:    'bg-rose-50 text-rose-700 border-rose-100',
}

export default function InvestorInvestmentsView() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/project/investor/my-interests`)
        setInvestments(data || [])
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Failed to fetch investment interests:', err)
        }
        setInvestments([])
      } finally {
        setLoading(false)
      }
    }
    fetchInterests()
  }, [])

  if (loading) {
    return <Spinner />
  }

  const totalItems = investments.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginated = investments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Investment Portfolio</h1>
        <p className="text-slate-500 text-xs mt-1">Audit your active expressions of interest and funding engagements</p>
      </div>

      {investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">No Interests Submitted</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              You haven't expressed interest in any pitches yet. Explore approved pitches and click "Express Interest" to get started.
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
                    <th className="py-3 px-6">Project / Sector</th>
                    <th className="py-3 px-6">Budget</th>
                    <th className="py-3 px-6">Target Funding</th>
                    <th className="py-3 px-6">Date Submitted</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginated.map((inv) => {
                    const project = inv.project || {}
                    const date = inv.transaction_date
                      ? new Date(inv.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'
                    const statusCls = STATUS_STYLES[inv.payment_status] || STATUS_STYLES.pending

                    return (
                      <tr key={inv.investment_id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 block leading-snug">
                            {project.project_name || 'Unknown Project'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">
                            {project.field || '—'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${project.budget?.toLocaleString() || '—'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-primary-600">
                          {project.target ? `$${project.target.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">{date}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${statusCls}`}>
                            {inv.payment_status || 'pending'}
                          </span>
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
    </div>
  )
}
