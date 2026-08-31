import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import api from '../../config/axios.js';

export default function VdrViewer({ documentId, projectId, investorEmail = 'investor@vc.com' }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [duration, setDuration] = useState(0);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    let timer;
    if (!revoked) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [revoked, currentPage]);

  // Track slide view duration heartbeat on page change
  useEffect(() => {
    if (duration > 0) {
      api.post('/vdr/track-view', {
        document_id: documentId,
        project_id: projectId,
        page_number: currentPage,
        duration_seconds: duration
      }).catch((err) => {
        if (err.response && err.response.status === 403) {
          setRevoked(true);
        }
      });
      setDuration(0);
    }
  }, [currentPage]);

  const loadWatermarkedDeck = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/vdr/watermark/${documentId}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      setWatermarkedPdfUrl(url);
      setRevoked(false);
    } catch (err) {
      console.error('Failed to load VDR deck:', err);
      if (err.response && err.response.status === 403) {
        setRevoked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      loadWatermarkedDeck();
    }
  }, [documentId]);

  if (revoked) {
    return (
      <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-8 text-center backdrop-blur-xl">
        <Lock className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-red-200">Access Revoked</h3>
        <p className="text-red-400/80 text-sm mt-2">The founder has revoked access to this confidential data room document.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">Protected VDR Deck Viewer</h4>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-emerald-400" /> Active Tracking & Dynamic Watermarking
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={loadWatermarkedDeck}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            title="Refresh Watermarked Stream"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* PDF Viewport with Overlay */}
      <div className="relative aspect-[16/9] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center group">
        {/* Dynamic Watermark Banner */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center rotate-[-25deg] opacity-25 select-none">
          <div className="text-center font-mono text-emerald-400 font-black tracking-widest text-lg sm:text-2xl border-2 border-dashed border-emerald-400 p-4 rounded-xl">
            CONFIDENTIAL • INNOVEST VDR<br />
            PREPARED FOR: {investorEmail.toUpperCase()}<br />
            ID: {documentId}
          </div>
        </div>

        {/* Slide Content Mockup */}
        <div className="w-full h-full p-8 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30">
          <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
            <span>SLIDE 0{currentPage} // MARKET & FINANCIAL PROJECTIONS</span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/30">VDR SECURE STREAM</span>
          </div>

          <div className="my-auto text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-300">
              {currentPage === 1 && "PayPharaoh Series Seed Pitch Deck"}
              {currentPage === 2 && "Market Opportunity & TAM ($12B MENA Payments)"}
              {currentPage === 3 && "Unit Economics & Financial Heatmap Projections"}
              {currentPage === 4 && "Go-To-Market & Traction Highlights"}
              {currentPage > 4 && `Executive Presentation Slide ${currentPage}`}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Proprietary financial model and proprietary distribution algorithms. Download and unauthorized distribution strictly prohibited under NDA terms.
            </p>
          </div>

          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>Time on Current Slide: {duration}s</span>
            <span>Watermark Hash: {documentId?.slice(0, 12)}...</span>
          </div>
        </div>

        {/* Navigation Overlays */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="absolute left-4 p-3 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 rounded-full text-white backdrop-blur-md border border-slate-700 transition-all z-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="absolute right-4 p-3 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 rounded-full text-white backdrop-blur-md border border-slate-700 transition-all z-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
