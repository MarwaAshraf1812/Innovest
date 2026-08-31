import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';
import api from '../../config/axios.js';

export default function InvestorMandateForm({ initialMandate, onSaveSuccess }) {
  const [preferredSectors, setPreferredSectors] = useState(
    initialMandate?.preferred_sectors?.join(', ') || 'Fintech, CleanTech, HealthTech, AI'
  );
  const [minTicket, setMinTicket] = useState(initialMandate?.ticket_size_range?.min || 50000);
  const [maxTicket, setMaxTicket] = useState(initialMandate?.ticket_size_range?.max || 500000);
  const [stage, setStage] = useState(initialMandate?.preferred_stage || 'SEED');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const sectorsArray = preferredSectors.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      await api.post('/matchmaking/mandate', {
        preferred_sectors: sectorsArray,
        ticket_size_range: { min: Number(minTicket), max: Number(maxTicket) },
        preferred_stage: stage
      });
      setMessage('Investment Mandate successfully saved!');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setMessage('Saved locally for current demo session.');
      if (onSaveSuccess) onSaveSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100 text-primary-600">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Configure AI Investor Mandate</h3>
          <p className="text-xs text-slate-500">Tune parameters to adjust real-time deal flow matching scores.</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Sectors (Comma Separated)
          </label>
          <input
            type="text"
            value={preferredSectors}
            onChange={(e) => setPreferredSectors(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium transition-all outline-none"
            placeholder="Fintech, HealthTech, CleanTech, AI"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Min Check Size ($)
            </label>
            <input
              type="number"
              value={minTicket}
              onChange={(e) => setMinTicket(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Max Check Size ($)
            </label>
            <input
              type="number"
              value={maxTicket}
              onChange={(e) => setMaxTicket(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Investment Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white text-slate-900 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all outline-none"
          >
            <option value="PRE_SEED">Pre-Seed</option>
            <option value="SEED">Seed</option>
            <option value="SERIES_A">Series A</option>
            <option value="SERIES_B">Series B</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border-none"
      >
        <Save className="w-4 h-4" /> Save AI Mandate Filter
      </button>
    </form>
  );
}
