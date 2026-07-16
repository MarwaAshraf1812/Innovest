import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/shared/Footer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FileText, TrendingUp, Calendar, FolderOpen, Search } from 'lucide-react'
import Input from '../components/ui/Input'
import { API_URL } from '../config/api'

const STATUS_STYLES = {
  approved:     { label: 'Approved',     cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  rejected:     { label: 'Rejected',     cls: 'text-rose-600 bg-rose-50 border-rose-100' },
  pending:      { label: 'Under Review', cls: 'text-amber-600 bg-amber-50 border-amber-100' },
  'under review': { label: 'Under Review', cls: 'text-amber-600 bg-amber-50 border-amber-100' },
}

export default function ProposalsPage({ onNavigate, currentUser, onLogout }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/project?pagination={"limit":100}`)
        const all = res.data?.projects || []
        // Public proposals page shows approved projects only
        setProjects(all.filter(p => p.approved === 'approved'))
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Failed to fetch proposals:', err)
        }
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filtered = projects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    p.field.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      <Navbar
        socketConnected={true}
        activePage="proposals"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Proposals</h1>
            <p className="text-slate-500 text-sm">Approved investment opportunities open for funding</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Input
                id="proposalSearch"
                placeholder="Search by name or sector..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            {currentUser?.role === 'ENTREPRENEUR' && (
              <Button variant="primary" onClick={() => onNavigate('dashboard')}>
                New Pitch
              </Button>
            )}
            {!currentUser && (
              <Button variant="primary" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <FolderOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">No Proposals Found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {search ? 'No proposals match your search.' : 'No approved proposals are available yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((proj) => {
              const st = STATUS_STYLES[proj.approved] || STATUS_STYLES.pending
              const progress = proj.target && proj.offer
                ? Math.min(Math.round((proj.offer / proj.target) * 100), 100)
                : null

              return (
                <Card key={proj.project_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200/80">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                        {proj.project_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold">
                        <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wider">
                          {proj.field}
                        </span>
                        <span>Budget: ${proj.budget?.toLocaleString()}</span>
                        {proj.target && <span>Target: ${proj.target?.toLocaleString()}</span>}
                      </div>
                      {progress !== null && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[200px]">
                            <div
                              className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary-600'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{progress}% funded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {proj.deadline}
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${st.cls}`}>
                      {st.label}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => currentUser ? onNavigate('dashboard') : onNavigate('login')}
                    >
                      {currentUser ? 'View Details' : 'Sign In'}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
