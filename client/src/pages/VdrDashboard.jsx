import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, Lock, Unlock, Eye, BarChart2 } from 'lucide-react';
import VdrViewer from '../components/vdr/VdrViewer.jsx';
import SlideHeatmapChart from '../components/vdr/SlideHeatmapChart.jsx';
import api from '../config/axios.js';

export default function VdrDashboard() {
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer' | 'analytics'
  const [documents, setDocuments] = useState([
    { document_id: 'paypharaoh_deck_2026.pdf', name: 'PayPharaoh_Series_Seed_PitchDeck.pdf', size: '4.2 MB', views: 24 }
  ]);
  const [selectedDoc, setSelectedDoc] = useState('paypharaoh_deck_2026.pdf');
  const [accessRevoked, setAccessRevoked] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Fetch analytics for selected document
    api.get(`/vdr/analytics/${selectedDoc}`)
      .then((res) => setAnalyticsData(res.data))
      .catch((err) => console.log('Using default seed analytics preview'));
  }, [selectedDoc]);

  const toggleAccess = async (investorId = 'investor-vc-101') => {
    try {
      await api.post('/vdr/revoke-access', {
        project_id: 'project-ai-201',
        investor_id: investorId
      });
      setAccessRevoked(!accessRevoked);
    } catch (err) {
      console.error('Revoke access failed:', err);
      setAccessRevoked(!accessRevoked);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">Phase 2 // Virtual Data Room</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Virtual Data Room & Slide Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Confidential PDF pitch deck stream, dynamic watermarks, and investor engagement heatmaps.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('viewer')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'viewer'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" /> PDF Viewer
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Heatmap Analytics
            </button>
          </div>
        </div>

        {/* Main Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Data Room Files & Permissions */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Data Room Documents
              </h3>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    onClick={() => setSelectedDoc(doc.document_id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedDoc === doc.document_id
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sm text-slate-200">{doc.name}</div>
                    <div className="flex justify-between items-center text-xs mt-2 text-slate-400 font-mono">
                      <span>{doc.size}</span>
                      <span>{doc.views} Total Views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Control Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldAlert className="w-5 h-5 text-amber-400" /> Access Control
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded border ${
                  accessRevoked ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {accessRevoked ? 'REVOKED' : 'ACTIVE'}
                </span>
              </div>

              <p className="text-xs text-slate-400">Instantly toggle or revoke VDR viewing permissions for investor accounts.</p>

              <button
                onClick={() => toggleAccess()}
                className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  accessRevoked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                }`}
              >
                {accessRevoked ? <><Unlock className="w-4 h-4" /> Restore VDR Access</> : <><Lock className="w-4 h-4" /> Revoke Investor Access</>}
              </button>
            </div>
          </div>

          {/* Right Column: Viewer or Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'viewer' ? (
              <VdrViewer documentId={selectedDoc} projectId="project-ai-201" />
            ) : (
              <SlideHeatmapChart analyticsData={analyticsData} />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
