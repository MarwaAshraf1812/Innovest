import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function AIMatchScoreBadge({ score = 92, highlights = [] }) {
  const getScoreColor = (s) => {
    if (s >= 85) return 'from-emerald-500 to-teal-400 text-emerald-300 border-emerald-500/40 bg-emerald-950/60 shadow-emerald-500/20';
    if (s >= 60) return 'from-amber-500 to-yellow-400 text-amber-300 border-amber-500/40 bg-amber-950/60 shadow-amber-500/20';
    return 'from-red-500 to-pink-500 text-red-300 border-red-500/40 bg-red-950/60';
  };

  return (
    <div className="space-y-3">
      <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-extrabold shadow-lg backdrop-blur-md bg-gradient-to-r ${getScoreColor(score)}`}>
        <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
        <span>{score}% AI MATCH SCORE</span>
      </div>

      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {highlights.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
