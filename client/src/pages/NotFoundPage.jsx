import React from 'react'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 space-y-6 shadow-sm">
        
        {/* Glow Icon */}
        <div className="h-16 w-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-sm animate-pulse">
          <AlertCircle className="h-8 w-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-base font-extrabold text-slate-700">Page Not Found</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            The workspace or route you are searching for does not exist or has been moved. Check the path and try again.
          </p>
        </div>

        {/* Action Button */}
        <Button 
          variant="primary" 
          className="w-full flex items-center justify-center gap-2 font-bold py-2.5"
          onClick={() => onNavigate('dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

      </div>
    </div>
  )
}
