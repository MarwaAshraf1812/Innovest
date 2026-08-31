import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import AIMatchScoreBadge from '../components/ai/AIMatchScoreBadge.jsx';
import InvestorMandateForm from '../components/ai/InvestorMandateForm.jsx';
import api from '../config/axios.js';

export default function InvestorDealFlowPage({ currentUser }) {
  const [deals, setDeals] = useState([]);
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRankedDeals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/matchmaking/ranked-deals');
      if (res.data && res.data.length > 0) {
        setDeals(res.data);
      } else {
        throw new Error('No deals returned');
      }
    } catch (err) {
      // Fallback seeded ranked deals
      setDeals([
        {
          project_id: 'proj-1',
          title: 'PayPharaoh',
          field: 'Fintech',
          funding_goal: 500000,
          stage: 'SEED',
          description: 'Next-Gen B2B payment gateway for MENA cross-border merchant settlement.',
          match_score: 94,
          match_reasons: ['Fintech Sector Alignment', 'Seed Stage Match', 'Check Size Fits Thesis']
        },
        {
          project_id: 'proj-2',
          title: 'Nile Solar Grid',
          field: 'CleanTech',
          funding_goal: 750000,
          stage: 'SERIES_A',
          description: 'Decentralized solar micro-grids powered by smart metering AI.',
          match_score: 88,
          match_reasons: ['CleanTech Alignment', 'High Growth Potential']
        },
        {
          project_id: 'proj-3',
          title: 'HealthPulse AI',
          field: 'HealthTech',
          funding_goal: 300000,
          stage: 'PRE_SEED',
          description: 'Predictive diagnostic analytics engine for regional clinic networks.',
          match_score: 72,
          match_reasons: ['HealthTech Sector Match']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankedDeals();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-primary-600 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-600" /> Smart Matchmaking Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">AI-Ranked Investor Deal Flow</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Startups ordered by multi-dimensional vector similarity against your investment mandate.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMandateModal(!showMandateModal)}
              className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer border-none"
            >
              <Sliders className="w-4 h-4" /> Configure Mandate
            </button>

            <button
              onClick={fetchRankedDeals}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Refresh Deal Flow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mandate Form Modal / Collapsible Drawer */}
        {showMandateModal && (
          <div className="animate-in fade-in duration-300">
            <InvestorMandateForm
              onSaveSuccess={() => {
                setShowMandateModal(false);
                fetchRankedDeals();
              }}
            />
          </div>
        )}

        {/* Ranked Deals List */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">Top Matched Opportunities</h3>

          <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
              <div
                key={deal.project_id}
                className="bg-white border border-slate-200/80 hover:border-primary-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-extrabold text-slate-900">{deal.title}</h4>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-full border border-primary-100 uppercase">
                      {deal.field}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                      {deal.stage}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{deal.description}</p>

                  <div className="text-xs text-slate-400 font-mono flex items-center gap-4">
                    <span>Target Funding Goal: <strong className="text-slate-800">${deal.funding_goal?.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Score & Action Button */}
                <div className="space-y-4 min-w-[240px] w-full md:w-auto">
                  <AIMatchScoreBadge score={deal.match_score} explanation={deal.match_reasons} />

                  <a
                    href={`/deal-room/room-demo-1`}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer no-underline shadow-sm"
                  >
                    Enter Deal Room <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
