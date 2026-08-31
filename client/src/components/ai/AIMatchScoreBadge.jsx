import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIMatchScoreBadge({ score = 85, explanation = [] }) {
  const getScoreVariant = (val) => {
    if (val >= 85) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barBg: 'bg-emerald-500',
        label: 'High Match'
      };
    }
    if (val >= 65) {
      return {
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        barBg: 'bg-amber-500',
        label: 'Moderate Match'
      };
    }
    return {
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      barBg: 'bg-slate-400',
      label: 'Low Match'
    };
  };

  const style = getScoreVariant(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className={`px-3 py-1 rounded-full border ${style.badgeBg} text-xs font-extrabold flex items-center gap-1.5 shadow-sm`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score}% AI Match</span>
          <span className="opacity-75">• {style.label}</span>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className={`h-full ${style.barBg} transition-all duration-700 rounded-full`}
          style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
        />
      </div>

      {/* Explanation Chips */}
      {explanation.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {explanation.map((item, idx) => (
            <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              ✓ {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
