import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Briefcase, Search, UserX, Mail } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { API_URL } from '../../../config/api'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'

export default function ExploreInvestorsView({ onViewProfile }) {
  const [investors, setInvestors]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [searchTerm, setSearchTerm]   = useState('')
  const [interestMap, setInterestMap] = useState({}) // userId -> 'sent' | 'sending' | null
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/user/investors`)
        setInvestors(data || [])
      } catch (err) {
        console.error('Failed to fetch investors:', err)
        setInvestors([])
      } finally {
        setLoading(false)
      }
    }
    fetchInvestors()
  }, [])

  const filtered = investors.filter(inv =>
    `${inv.first_name} ${inv.last_name} ${inv.investment_preferences?.join(' ')} ${inv.country}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSendPitch = (investorId) => {
    // Opens user's mail client as a direct contact method
    const investor = investors.find(i => i.id === investorId)
    if (investor?.email) window.open(`mailto:${investor.email}?subject=Investment Pitch Deck`)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Investors</h1>
          <p className="text-slate-500 text-xs mt-1">Connect with verified venture capitalists and angel funders</p>
        </div>
        <div className="w-full sm:max-w-xs">
          <Input
            id="investorSearch"
            type="text"
            placeholder="Search by name, sector, country..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <UserX className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">No Investors Found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {searchTerm
                ? 'No investors match your search criteria.'
                : 'No verified investors are currently available on the platform.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paged.map((inv) => {
            const prefs = inv.investment_preferences?.length
              ? inv.investment_preferences.join(', ')
              : 'Not specified'

            return (
              <Card key={inv.id} className="p-6 flex flex-col justify-between min-h-[220px]" hoverable={true}>
                <div className="space-y-3">
                  {/* Avatar + Name */}
                  <div 
                    className="flex items-center gap-3 cursor-pointer group/avatar"
                    onClick={() => onViewProfile?.(inv.id)}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 font-black text-base shrink-0 select-none group-hover/avatar:bg-primary-100 group-hover/avatar:border-primary-200 transition-all">
                      {inv.first_name?.[0]?.toUpperCase() ?? 'I'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover/avatar:text-primary-600 group-hover/avatar:underline transition-colors">
                        {inv.first_name} {inv.last_name}
                      </h3>
                      <p className="text-xs text-primary-600 font-semibold">@{inv.username}</p>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
                    <p>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mr-1.5">Sectors:</span>
                      {prefs}
                    </p>
                    {inv.experience && (
                      <p>
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mr-1.5">Background:</span>
                        <span className="line-clamp-2">{inv.experience}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {inv.country || 'Location N/A'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendPitch(inv.id)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Send Pitch Deck
                  </Button>
                </div>
              </Card>
            )
            })}
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
