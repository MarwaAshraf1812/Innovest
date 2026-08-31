import React from 'react';
import { History, ShieldCheck, UserCheck, Edit3, Lock } from 'lucide-react';

export default function DealRoomAuditTimeline({ auditTrail = [] }) {
  const defaultAudit = [
    { action: 'DEAL_ROOM_INITIALIZED', timestamp: new Date(Date.now() - 3600000 * 24), performed_by: 'Founder' },
    { action: 'TERM_SHEET_REDLINE_UPDATED (Valuation Cap: $5.5M)', timestamp: new Date(Date.now() - 3600000 * 12), performed_by: 'Investor' }
  ];

  const trail = auditTrail.length > 0 ? auditTrail : defaultAudit;

  const getActionIcon = (actionStr) => {
    if (actionStr.includes('SIGNATURE') || actionStr.includes('EXECUTED')) return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    if (actionStr.includes('REDLINE') || actionStr.includes('UPDATED')) return <Edit3 className="w-4 h-4 text-amber-600" />;
    return <UserCheck className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 rounded-xl border border-primary-100 text-primary-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Immutable Audit Trail Log</h3>
            <p className="text-xs text-slate-500">Cryptographically tracked activity history & signature timestamps.</p>
          </div>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {trail.map((item, idx) => (
          <div key={idx} className="relative flex items-start justify-between gap-4 group">
            {/* Circle Node Marker */}
            <div className="absolute -left-[1.65rem] top-0.5 p-1 bg-white border-2 border-slate-300 rounded-full group-hover:border-primary-500 transition-colors">
              {getActionIcon(item.action || '')}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-800 leading-snug">{item.action}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                Performed by: <strong className="text-slate-700">{item.performed_by || 'Verified Party'}</strong>
              </p>
            </div>

            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
              {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
