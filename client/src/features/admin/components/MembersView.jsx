import React, { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { useAdmin } from '../../../context/AdminContext'
import Input from '../../../components/ui/Input'
import Pagination from '../../../components/ui/Pagination'
import Spinner from '../../../components/Spinner'
import MemberRow from './MemberRow'
import axios from 'axios'
import { API_URL } from '../../../config/api'

export default function MembersView() {
  const { members, fetchMembers, deleteMember } = useAdmin()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState(null)

  // Pagination — reset to page 1 whenever search/filter changes
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)

  const handleSearch = (val) => { setSearchQuery(val); setPage(1) }
  const handleFilter = (val) => { setRoleFilter(val); setPage(1) }

  useEffect(() => {
    fetchMembers().finally(() => setLoading(false))
  }, [])

  const handleDelete = async (userId) => {
    if (!window.confirm('Permanently delete this user?')) return
    setActionLoading(userId)
    try {
      await deleteMember(userId)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId)
    try {
      await axios.put(`${API_URL}/user/${userId}`, { role: newRole })
      await fetchMembers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update member role')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = members.filter(u => {
    const name = `${u.first_name ?? ''} ${u.last_name ?? ''} ${u.email ?? ''} ${u.username ?? ''}`.toLowerCase()
    return name.includes(searchQuery.toLowerCase()) && (roleFilter === 'ALL' || u.role === roleFilter)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Platform Members</h1>
        <p className="text-xs text-slate-500 mt-0.5">Search, filter, and manage active users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1">
          <Input
            id="memberSearch" type="text" placeholder="Search by name, email, username…"
            value={searchQuery} onChange={e => handleSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {['ALL', 'ENTREPRENEUR', 'INVESTOR'].map(r => (
            <button
              key={r}
              onClick={() => handleFilter(r)}
              className={[
                'flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border',
                roleFilter === r
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              {r === 'ALL' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Item count */}
      <p className="text-xs text-slate-400 font-medium px-0.5">
        <span className="font-semibold text-slate-700">{filtered.length}</span> results
        {roleFilter !== 'ALL' && <span> · filtered by <strong>{roleFilter}</strong></span>}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No members found</p>
          <p className="text-xs text-slate-400">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map(user => (
              <MemberRow
                key={user.id || user._id}
                user={user}
                onDelete={handleDelete}
                onRoleChange={handleRoleChange}
                actionLoading={actionLoading}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
            totalItems={filtered.length}
          />
        </>
      )}
    </div>
  )
}
