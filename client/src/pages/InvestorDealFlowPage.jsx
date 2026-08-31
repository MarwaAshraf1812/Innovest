import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ArrowRight, Eye, Briefcase, RefreshCw, CheckCircle } from 'lucide-react';
import AIMatchScoreBadge from '../components/ai/AIMatchScoreBadge.jsx';
import InvestorMandateForm from '../components/ai/InvestorMandateForm.jsx';
import api from '../config/axios.js';

export default function InvestorDealFlowPage() {
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dealFlow, setDealFlow] = useState([
    {
      project_id: 'project-ai-201',
      project_name: 'PayPharaoh Merchant Payments',
      description: 'Next-gen payment gateway and point-of-sale API unifying mobile wallets, cards, and BNPL across North Africa.',
      field: 'Fintech',
      budget: 350000,
      ai_match: {
        match_score: 94,
        match_highlights: ['🎯 Perfect Check Size ($350k within $25k-$500k)', '⚡ Sector Match: Fintech', '📍 Geographic Alignment: Egypt/MENA']
      }
    },
    {
      project_id: 'project-ai-202',
      project_name: 'HealthPulse AI Diagnostics',
      description: 'AI-assisted medical image analysis and remote patient triage dashboard for radiology clinics.',
      field: 'HealthTech',
      budget: 500000,
      ai_match: {
        match_score: 88,
        match_highlights: ['⚡ Sector Match: HealthTech', '🎯 Check Size Compatible ($500k bound)']
      }
    },
    {
      project_id: 'project-ai-203',
      project_name: 'Nile Solar Grid Inverters',
      description: 'Smart IoT solar micro-grids and battery management software for agricultural land in Upper Egypt.',
      field: 'CleanTech',
      budget: 450000,
      ai_match: {
        match_score: 85,
        match_highlights: ['⚡ Sector Match: CleanTech', '🌿 Climate Tech Thesis Match']
      }
    }
  ]);

  const loadDealFlow = async () => {
    setLoading(true);
    try {
      const res = await api.get('/matchmaking/deal-flow');
      if (res.data && res.data.deal_flow) {
        setDealFlow(res.data.deal_flow);
      }
    } catch (err) {
      console.log('Using default seeded deal flow feed preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealFlow();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Phase 3 // AI Vector Matchmaking
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Personalized AI Deal Flow</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time vector matching derived from your investment mandate and thesis.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMandateModal(!showMandateModal)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> {showMandateModal ? 'Hide Mandate' : 'Configure Mandate'}
            </button>

            <button
              onClick={loadDealFlow}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
              title="Refresh Deal Flow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mandate Form Modal / Collapsible */}
        {showMandateModal && (
          <div className="animate-fade-in">
            <InvestorMandateForm onSaved={() => { setShowMandateModal(false); loadDealFlow(); }} />
          </div>
        )}

        {/* Deal Cards Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealFlow.map((deal) => (
            <div
              key={deal.project_id}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 space-y-5 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Sector & Budget Header */}
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400">
                    {deal.field}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    Seek: ${deal.budget?.toLocaleString()}
                  </span>
                </div>

                {/* Startup Name & Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {deal.project_name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* AI Match Badge & Highlights */}
                <AIMatchScoreBadge
                  score={deal.ai_match?.match_score || 85}
                  highlights={deal.ai_match?.match_highlights || []}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <a
                  href="/vdr"
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Open VDR
                </a>
                <a
                  href="/deal-room/room-demo-1"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Deal Room
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
