import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/shared/Footer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Search, MapPin, DollarSign, Calendar, FolderOpen } from 'lucide-react'
import { API_URL } from '../config/api'

export default function ExplorePage({ onNavigate, currentUser, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [pitches, setPitches]       = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/project?pagination={"limit":100}`)
        const all = res.data?.projects || []
        setPitches(all.filter(p => p.approved === 'approved'))
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Failed to fetch pitches:', err)
        }
        setPitches([])
      } finally {
        setLoading(false)
      }
    }
    fetchApproved()
  }, [])

  const filtered = pitches.filter(p =>
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      <Navbar
        socketConnected={true}
        activePage="explore"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Pitches</h1>
            <p className="text-slate-500 text-sm">Vetted investment opportunities globally</p>
          </div>
          <div className="w-full md:w-80">
            <Input
              id="search"
              placeholder="Search by sector or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
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
              <p className="text-lg font-bold text-slate-900">No Pitches Available</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {searchTerm
                  ? 'No pitches match your search. Try a different keyword.'
                  : 'No approved pitches are available yet. Check back soon!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pitch) => {
              const progress = pitch.target && pitch.offer
                ? Math.min(Math.round((pitch.offer / pitch.target) * 100), 100)
                : 0
              const isFullyFunded = progress >= 100

              return (
                <Card key={pitch.project_id} className="p-6 flex flex-col justify-between min-h-[350px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
                        {pitch.field}
                      </span>
                      {isFullyFunded && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                          Fully Funded
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{pitch.project_name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{pitch.description}</p>
                  </div>

                  {/* Progress and metrics */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Budget: ${pitch.budget?.toLocaleString()}</span>
                        {pitch.target && <span className="text-slate-700">Target: ${pitch.target?.toLocaleString()}</span>}
                      </div>
                      {pitch.target && (
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFullyFunded ? 'bg-emerald-500' : 'bg-primary-600'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {pitch.deadline}
                      </span>
                    </div>

                    <Button
                      variant={isFullyFunded ? 'outline' : 'primary'}
                      className="w-full justify-center mt-2"
                      onClick={() => currentUser ? onNavigate('dashboard') : onNavigate('login')}
                    >
                      {currentUser ? 'View in Dashboard' : 'Sign In to Invest'}
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
