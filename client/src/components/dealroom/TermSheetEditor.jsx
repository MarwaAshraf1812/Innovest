import React, { useState } from 'react';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermSheetEditor({ termSheet, onUpdate, isSigned }) {
  const [valuationCap, setValuationCap] = useState(termSheet?.valuation_cap || 5000000);
  const [discountRate, setDiscountRate] = useState(termSheet?.discount_rate || 20);
  const [specialTerms, setSpecialTerms] = useState(termSheet?.special_terms || 'Pro-rata rights for major investors');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        valuation_cap: Number(valuationCap),
        discount_rate: Number(discountRate),
        special_terms: specialTerms
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100 text-primary-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">SAFE Term Sheet Redlining</h3>
            <p className="text-xs text-slate-500">Collaborative term sheet editor with immutable redline audit logs.</p>
          </div>
        </div>

        {isSigned && (
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Fully Executed & Locked
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Valuation Cap ($)
          </label>
          <input
            type="number"
            disabled={isSigned}
            value={valuationCap}
            onChange={(e) => setValuationCap(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white disabled:opacity-50 text-slate-900 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Discount Rate (%)
          </label>
          <input
            type="number"
            disabled={isSigned}
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white disabled:opacity-50 text-slate-900 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Special Terms / Governance Provisions
        </label>
        <textarea
          rows={3}
          disabled={isSigned}
          value={specialTerms}
          onChange={(e) => setSpecialTerms(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white disabled:opacity-50 text-slate-900 rounded-xl p-4 text-xs font-medium transition-all outline-none resize-none"
        />
      </div>

      {!isSigned && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border-none"
        >
          <Save className="w-4 h-4" /> Save Term Sheet Redlines
        </button>
      )}
    </div>
  );
}
