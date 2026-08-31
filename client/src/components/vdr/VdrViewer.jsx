import React, { useState, useEffect } from 'react';
import { Eye, Shield, Lock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../config/axios.js';

export default function VdrViewer({ documentId, documentTitle, pdfUrl, currentUser }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [isAccessRevoked, setIsAccessRevoked] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const watermarkText = `${currentUser?.email || 'CONFIDENTIAL'} • ${new Date().toLocaleDateString()}`;

  useEffect(() => {
    setStartTime(Date.now());
    const interval = setInterval(() => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      if (durationSeconds > 0 && !isAccessRevoked) {
        api.post('/vdr/track-view', {
          document_id: documentId || 'doc-demo-1',
          slide_number: currentPage,
          duration_seconds: 2
        }).catch((err) => {
          if (err.response && err.response.status === 403) {
            setIsAccessRevoked(true);
          }
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPage, documentId, isAccessRevoked]);

  if (isAccessRevoked) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4">
        <div className="p-4 bg-rose-100 rounded-full text-rose-600">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Document Access Revoked</h3>
        <p className="text-sm text-slate-600 max-w-md">
          The founder has modified access permissions for this Virtual Data Room document. Contact the project administrator to request access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-900">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border border-primary-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{documentTitle || 'Series A Pitch Deck (Confidential)'}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-primary-600" /> Dynamic Telemetry Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* PDF View Canvas with Watermark */}
      <div className="relative min-h-[420px] bg-slate-100 flex items-center justify-center p-8 select-none overflow-hidden">
        {/* Dynamic Non-Intrusive Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 rotate-[-25deg] text-slate-900 font-mono text-sm sm:text-base font-extrabold tracking-widest uppercase z-10 whitespace-nowrap">
          {watermarkText} • FOR YOUR EYES ONLY • {watermarkText}
        </div>

        {/* PDF Slide Placeholder Card */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12 space-y-6 relative z-0 min-h-[300px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">SLIDE {currentPage}</span>
            <span className="text-xs text-slate-400 font-mono">PayPharaoh Inc.</span>
          </div>

          <div className="space-y-3 py-6 text-center">
            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {currentPage === 1 ? 'Market Opportunity & Unit Economics' :
               currentPage === 2 ? 'TAM / SAM / SOM Expansion in MENA' :
               currentPage === 3 ? 'Financial Projections & Recurring Revenue' :
               `Executive Overview - Slide ${currentPage}`}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
              Real-time telemetry records slide view duration to generate founder heatmap engagement insights.
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-4 border-t border-slate-100">
            <span>Watermarked for {currentUser?.email || 'Investor'}</span>
            <span>SECURE VDR LAYER v2.4</span>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-6 py-3.5 border-t border-slate-100 bg-white">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-xs text-slate-500 font-semibold">
          Slide {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
