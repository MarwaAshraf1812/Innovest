import React from 'react';
import { Flame, Clock, BarChart3 } from 'lucide-react';

export default function SlideHeatmapChart({ heatmapData = [] }) {
  const defaultData = [
    { slide_number: 1, total_duration_seconds: 45 },
    { slide_number: 2, total_duration_seconds: 120 },
    { slide_number: 3, total_duration_seconds: 240 },
    { slide_number: 4, total_duration_seconds: 90 },
    { slide_number: 5, total_duration_seconds: 300 },
    { slide_number: 6, total_duration_seconds: 60 },
    { slide_number: 7, total_duration_seconds: 180 },
    { slide_number: 8, total_duration_seconds: 210 }
  ];

  const data = heatmapData.length > 0 ? heatmapData : defaultData;
  const maxDuration = Math.max(...data.map((d) => d.total_duration_seconds || 1));

  const getHeatmapColor = (duration) => {
    const ratio = duration / maxDuration;
    if (ratio > 0.75) return { bg: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (ratio > 0.45) return { bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { bg: 'bg-primary-500', badge: 'bg-primary-50 text-primary-700 border-primary-200' };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100 text-primary-600">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Investor Engagement Heatmap</h3>
            <p className="text-xs text-slate-500">Aggregate view time per slide across all investor sessions.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <BarChart3 className="w-4 h-4 text-primary-600" /> Real-time Analytics
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((item) => {
          const heightPercent = Math.max(Math.round((item.total_duration_seconds / maxDuration) * 100), 15);
          const colors = getHeatmapColor(item.total_duration_seconds);

          return (
            <div key={item.slide_number} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Slide #{item.slide_number}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                  {item.total_duration_seconds}s
                </span>
              </div>

              {/* Bar Visual Indicator */}
              <div className="h-20 bg-slate-200/60 rounded-lg flex items-end overflow-hidden p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full ${colors.bg} rounded-md transition-all duration-500 shadow-sm`}
                />
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <Clock className="w-3 h-3 text-slate-400" /> {(item.total_duration_seconds / 60).toFixed(1)} mins total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
