import React, { useState } from 'react';
import { FileText, DollarSign, Percent, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';
import api from '../../config/axios.js';

export default function TermSheetEditor({ dealRoomId, termSheet, isSigned, onTermsUpdated }) {
  const [valuationCap, setValuationCap] = useState(termSheet?.valuation_cap || 4000000);
  const [discountRate, setDiscountRate] = useState(termSheet?.discount_rate || 20);
  const [investmentAmount, setInvestmentAmount] = useState(termSheet?.investment_amount || 250000);
  const [specialTerms, setSpecialTerms] = useState(termSheet?.special_terms || ['Quarterly financial reports', 'Pro-rata participation rights']);
  const [newTerm, setNewTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const addTerm = () => {
    if (newTerm.trim()) {
      setSpecialTerms([...specialTerms, newTerm.trim()]);
      setNewTerm('');
    }
  };

  const removeTerm = (index) => {
    setSpecialTerms(specialTerms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSigned) return;
    setSaving(true);
    try {
      await api.put(`/deal-room/${dealRoomId}/term-sheet`, {
        valuation_cap: Number(valuationCap),
        discount_rate: Number(discountRate),
        investment_amount: Number(investmentAmount),
        special_terms: specialTerms
      });
      if (onTermsUpdated) onTermsUpdated();
    } catch (err) {
      console.error('Failed to update term sheet:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">SAFE Post-Money Term Sheet Builder</h3>
            <p className="text-xs text-slate-400">Y Combinator Standard SAFE Agreement Parameters & Redlines.</p>
          </div>
        </div>

        {isSigned ? (
          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> LOCKED & SIGNED
          </span>
        ) : (
          <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5" /> REDLINING ACTIVE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Valuation Cap */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">VALUATION CAP ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              disabled={isSigned}
              value={valuationCap}
              onChange={(e) => setValuationCap(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-100 font-mono disabled:opacity-50 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Discount Rate */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">DISCOUNT RATE (%)</label>
          <div className="relative">
            <Percent className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              disabled={isSigned}
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-100 font-mono disabled:opacity-50 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Investment Amount */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 block">INVESTMENT AMOUNT ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="number"
              disabled={isSigned}
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-100 font-mono disabled:opacity-50 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Special Terms List */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 block">Special Terms & Information Rights</label>
        
        <div className="space-y-2">
          {specialTerms.map((term, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300">
              <span>• {term}</span>
              {!isSigned && (
                <button type="button" onClick={() => removeTerm(index)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {!isSigned && (
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Add covenant e.g. Board seat observer rights..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addTerm}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        )}
      </div>

      {!isSigned && (
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" /> {saving ? 'Submitting Redlines...' : 'Submit Redlines & Update Terms'}
        </button>
      )}
    </form>
  );
}
