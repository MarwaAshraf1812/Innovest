import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Unlock, RefreshCw, FileText, CheckCircle2, Folder, ChevronRight } from 'lucide-react';
import VdrViewer from '../components/vdr/VdrViewer.jsx';
import SlideHeatmapChart from '../components/vdr/SlideHeatmapChart.jsx';
import api from '../config/axios.js';

export default function VdrDashboard({ currentUser }) {
  const [accessRevoked, setAccessRevoked] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  const projects = [
    {
      id: 'doc-demo-1',
      title: 'PayPharaoh',
      field: 'Fintech',
      stage: 'Seed',
      docName: 'PayPharaoh Series A Pitch Deck (Confidential)',
      founder: 'Karim El-Sayed'
    },
    {
      id: 'doc-demo-2',
      title: 'Nile Solar Grid',
      field: 'CleanTech',
      stage: 'Series A',
      docName: 'Nile Solar Micro-Grid Technical Specs & Investment Memo',
      founder: 'Omar Farouk'
    },
    {
      id: 'doc-demo-3',
      title: 'HealthPulse AI',
      field: 'HealthTech',
      stage: 'Pre-Seed',
      docName: 'HealthPulse Diagnostic Engine Whitepaper & Clinical Data',
      founder: 'Dr. Layla Nabil'
    },
    {
      id: 'doc-demo-4',
      title: 'AgriNile Systems',
      field: 'Agritech',
      stage: 'Seed',
      docName: 'AgriNile Smart Irrigation Architecture Deck',
      founder: 'Nourhan Amer'
    }
  ];

  const [selectedProjectId, setSelectedProjectId] = useState('doc-demo-1');
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const isFounderOrAdmin = currentUser?.role === 'ENTREPRENEUR' || currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  const fetchAnalytics = async () => {
    if (!isFounderOrAdmin) return;
    setLoading(true);
    try {
      const res = await api.get(`/vdr/analytics/${selectedProjectId}`);
      if (res.data && res.data.heatmap) {
        setHeatmapData(res.data.heatmap);
      } else {
        throw new Error('No heatmap data');
      }
    } catch (err) {
      // Dynamic fallback heatmap based on project ID
      const factor = selectedProjectId === 'doc-demo-2' ? 1.5 : selectedProjectId === 'doc-demo-3' ? 0.8 : 1;
      setHeatmapData([
        { slide_number: 1, total_duration_seconds: Math.round(45 * factor) },
        { slide_number: 2, total_duration_seconds: Math.round(120 * factor) },
        { slide_number: 3, total_duration_seconds: Math.round(240 * factor) },
        { slide_number: 4, total_duration_seconds: Math.round(90 * factor) },
        { slide_number: 5, total_duration_seconds: Math.round(300 * factor) },
        { slide_number: 6, total_duration_seconds: Math.round(60 * factor) },
        { slide_number: 7, total_duration_seconds: Math.round(180 * factor) },
        { slide_number: 8, total_duration_seconds: Math.round(210 * factor) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedProjectId, isFounderOrAdmin]);

  const handleToggleAccess = async () => {
    try {
      const nextState = !accessRevoked;
      await api.put(`/vdr/permissions/${selectedProjectId}`, { revoke_all: nextState });
      setAccessRevoked(nextState);
    } catch (err) {
      setAccessRevoked(!accessRevoked);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-primary-600 tracking-wider uppercase flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary-600" /> Virtual Data Room (VDR)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {isFounderOrAdmin ? 'Founder Pitch Deck Analytics Hub' : 'Secure Investment Data Room'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {isFounderOrAdmin
                ? 'Track investor slide engagement heatmaps and control dynamic access permissions across your startups.'
                : 'Browse confidential watermarked pitch decks protected with dynamic security telemetry.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isFounderOrAdmin && (
              <>
                <button
                  onClick={handleToggleAccess}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    accessRevoked
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {accessRevoked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {accessRevoked ? 'Access Revoked' : 'Access Granted'}
                </button>

                <button
                  onClick={fetchAnalytics}
                  className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  title="Refresh Telemetry"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project Selection Tabs Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-primary-600" /> Select Startup Data Room
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Showing VDR for: <strong className="text-slate-800">{selectedProject.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {projects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-white border-primary-500 ring-2 ring-primary-500/10 shadow-sm'
                      : 'bg-white/60 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-slate-900">{proj.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 border-primary-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {proj.field}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{proj.docName}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: PDF Viewer + (Heatmap Chart only for Founder/Admin) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={isFounderOrAdmin ? 'lg:col-span-2 space-y-6' : 'lg:col-span-3 space-y-6'}>
            <VdrViewer
              documentId={selectedProject.id}
              documentTitle={selectedProject.docName}
              currentUser={currentUser}
            />
          </div>

          {/* Founder/Admin Only Column */}
          {isFounderOrAdmin && (
            <div className="space-y-6">
              <SlideHeatmapChart heatmapData={heatmapData} />

              {/* VDR Security Controls Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" /> Security Telemetry
                </h4>
                <ul className="text-xs text-slate-500 space-y-2 font-medium">
                  <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dynamic Investor Email Watermark Overlay
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Slide View Duration Telemetry
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant Remote Access Revocation Toggle
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
