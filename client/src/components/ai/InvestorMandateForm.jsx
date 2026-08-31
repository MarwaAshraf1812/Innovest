import React, { useState } from 'react';
import { Target, Sliders, DollarSign, Save, Sparkles, Check } from 'lucide-react';
import api from '../../config/axios.js';

const AVAILABLE_SECTORS = ['Fintech', 'CleanTech', 'HealthTech', 'AI', 'Logistics', 'EdTech', 'E-commerce', 'PropTech', 'BioTech'];
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B'];

export default function InvestorMandateForm({ onSaved }) {
  const [preferredSectors, setPreferredSectors] = useState(['Fintech', 'CleanTech', 'HealthTech']);
  const [preferredStages, setPreferredStages] = useState(['Seed', 'Series A']);
  const [minCheckSize, setMinCheckSize] = useState(25000);
  const [maxCheckSize, setMaxCheckSize] = useState(500000);
  const [investmentThesis, setInvestmentThesis] = useState('Investing in high-yield MENA technology platforms with strong unit economics and clear moat defensibility.');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSector = (sector) => {
    if (preferredSectors.includes(sector)) {
      setPreferredSectors(preferredSectors.filter((s) => s !== sector));
    } else {
      setPreferredSectors([...preferredSectors, sector]);
    }
  };

  const toggleStage = (stage) => {
    if (preferredStages.includes(stage)) {
      setPreferredStages(preferredStages.filter((s) => s !== stage));
    } else {
      setPreferredStages([...preferredStages, stage]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/matchmaking/mandate', {
        preferred_sectors: preferredSectors,
        preferred_stages: preferredStages,
        min_check_size: minCheckSize,
        max_check_size: maxCheckSize,
        investment_thesis: investmentThesis
      });
      setSavedSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save investment mandate:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl text-white max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Investor Investment Mandate</h3>
            <p className="text-xs text-slate-400">Configure your investment parameters to power the AI Deal Matchmaking engine.</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" /> Mandate Saved!
          </span>
        )}
      </div>

      {/* Preferred Sectors Tags */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 block">Target Investment Sectors</label>
        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_SECTORS.map((sector) => {
            const isSelected = preferredSectors.includes(sector);
            return (
              <button
                type="button"
                key={sector}
                onClick={() => toggleSector(sector)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {sector}
              </button>
            );
          })}
        </div>
      </div>

      {/* Check Size Bounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">MIN CHECK SIZE ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              value={minCheckSize}
              onChange={(e) => setMinCheckSize(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">MAX CHECK SIZE ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              value={maxCheckSize}
              onChange={(e) => setMaxCheckSize(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Investment Thesis Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Investment Thesis & Natural Language Vector Target
        </label>
        <textarea
          rows={3}
          value={investmentThesis}
          onChange={(e) => setInvestmentThesis(e.target.value)}
          placeholder="Describe your thesis e.g. B2B Fintech with strong recurring revenue and defensible IP..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving Mandate...' : 'Update Investment Mandate'}
      </button>
    </form>
  );
}
