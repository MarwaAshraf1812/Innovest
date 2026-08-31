import React from 'react';
import { Flame, Clock, Eye, AlertTriangle } from 'lucide-react';

export default function SlideHeatmapChart({ analyticsData }) {
  const pageViews = analyticsData?.page_views || [
    { page_number: 1, duration_seconds: 20, view_count: 4 },
    { page_number: 2, duration_seconds: 45, view_count: 6 },
    { page_number: 3, duration_seconds: 140, view_count: 12 }, // Financials Peak!
    { page_number: 4, duration_seconds: 55, view_count: 5 },
    { page_number: 5, duration_seconds: 30, view_count: 3 }
  ];

  const maxDuration = Math.max(...pageViews.map((p) => p.duration_seconds), 1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Pitch Deck Slide Heatmap Analytics</h3>
            <p className="text-xs text-slate-400">Slide-by-slide investor duration and engagement intensity</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> Total Time: {analyticsData?.total_duration_seconds || 290}s</span>
        </div>
      </div>

      {/* Heatmap Bars Grid */}
      <div className="space-y-4">
        {pageViews.map((pv) => {
          const percent = Math.round((pv.duration_seconds / maxDuration) * 100);
          const isHot = percent >= 80;

          return (
            <div key={pv.page_number} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  Slide 0{pv.page_number}
                  {pv.page_number === 3 && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-semibold">
                      🔥 Financials Peak (Most Reviewed)
                    </span>
                  )}
                </span>
                <span className="text-slate-400 font-medium">
                  {pv.duration_seconds} seconds ({pv.view_count} views)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  style={{ width: `${percent}%` }}
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHot
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-orange-500/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
