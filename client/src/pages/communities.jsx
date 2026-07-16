import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/shared/Footer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Users, MessageSquare, ArrowRight, Globe } from 'lucide-react'
import { API_URL } from '../config/api'

export default function CommunitiesPage({ onNavigate, currentUser, onLogout }) {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/community`)
        setCommunities(data?.communities || data || [])
      } catch (err) {
        console.error('Failed to fetch communities:', err)
        setCommunities([])
      } finally {
        setLoading(false)
      }
    }
    fetchCommunities()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      <Navbar
        socketConnected={true}
        activePage="communities"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Community Channels</h1>
          <p className="text-slate-500 text-sm">Align with sponsors and participate in sector boards</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary-600 animate-spin" />
          </div>
        ) : communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">No Communities Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                No communities have been created yet. Sign in and request access from your dashboard.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communities.map((comm) => (
              <Card key={comm.community_id || comm._id} className="p-6 flex flex-col justify-between min-h-[280px]">
                <div className="space-y-4">
                  {/* Cover image or icon */}
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 overflow-hidden">
                      {comm.image_url ? (
                        <img src={comm.image_url} alt={comm.community_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    {comm.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {comm.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[9px] font-extrabold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{comm.community_name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{comm.description}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {comm.member_count || 0} Members
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentUser ? onNavigate('dashboard') : onNavigate('login')}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    {currentUser ? 'Open Dashboard' : 'Join Channel'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
