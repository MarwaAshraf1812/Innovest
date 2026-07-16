import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Reusable Pagination component.
 *
 * Props:
 *   currentPage  — 1-indexed current page number
 *   totalPages   — total number of pages
 *   onPageChange — (pageNumber) => void
 *   pageSize     — items per page (for display label)
 *   totalItems   — total item count (for display label)
 */
export default function Pagination({ currentPage, totalPages, onPageChange, pageSize, totalItems }) {
  if (totalPages <= 1) return null

  // Build page window: always show first, last, current ±1, with ellipsis
  const getPages = () => {
    const pages = []
    const delta = 1

    const range = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (range[0] > 2) range.unshift('...')
    if (range[range.length - 1] < totalPages - 1) range.push('...')

    pages.push(1)
    range.forEach(r => pages.push(r))
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const from = (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">

      {/* Item range label */}
      <p className="text-xs text-slate-400 font-medium order-2 sm:order-1">
        Showing <span className="font-semibold text-slate-600">{from}–{to}</span> of{' '}
        <span className="font-semibold text-slate-600">{totalItems}</span> items
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1 order-1 sm:order-2">

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={[
            'flex items-center justify-center h-8 w-8 rounded-lg text-sm transition-colors cursor-pointer border',
            currentPage === 1
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white',
          ].join(' ')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {getPages().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="flex items-center justify-center h-8 w-8 text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={[
                'flex items-center justify-center h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                page === currentPage
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white',
              ].join(' ')}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={[
            'flex items-center justify-center h-8 w-8 rounded-lg text-sm transition-colors cursor-pointer border',
            currentPage === totalPages
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white',
          ].join(' ')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
