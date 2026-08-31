import React from 'react';
import { History, CheckCircle2, FileEdit, PlusCircle, ShieldCheck } from 'lucide-react';

export default function DealRoomAuditTimeline({ auditTrail = [] }) {
  const defaultTrail = [
    { action: 'DEAL_ROOM_CREATED', performed_by: 'Founder (Karim)', timestamp: new Date('2026-08-25T10:00:00Z') },
    { action: 'TERM_SHEET_UPDATED: valuation_cap', performed_by: 'Investor (Sawiris Capital)', timestamp: new Date('2026-08-27T14:30:00Z') },
    { action: 'DIGITAL_SIGNATURE_EXECUTED by FOUNDER', performed_by: 'Founder (Karim)', timestamp: new Date('2026-08-28T09:15:00Z') },
    { action: 'DIGITAL_SIGNATURE_EXECUTED by INVESTOR', performed_by: 'Investor (Sawiris Capital)', timestamp: new Date('2026-08-29T11:00:00Z') },
    { action: 'DEAL_ROOM_EXECUTED_AND_CLOSED', performed_by: 'System Engine', timestamp: new Date('2026-08-29T11:00:05Z') }
  ];

  const trail = auditTrail.length > 0 ? auditTrail : defaultTrail;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-white space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-100">Immutable Audit Trail & Redline History</h4>
          <p className="text-xs text-slate-400">Timestamped record of term sheet modifications and e-signatures.</p>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {trail.map((item, idx) => {
          const isSignature = item.action.includes('SIGNATURE') || item.action.includes('CLOSED');
          return (
            <div key={idx} className="flex items-start gap-4 relative z-10 pl-1">
              <div className={`p-1.5 rounded-full border ${
                isSignature
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-950 text-emerald-400 border-slate-700'
              }`}>
                {isSignature ? <ShieldCheck className="w-3.5 h-3.5" /> : <FileEdit className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-200">{item.action}</div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>By: {item.performed_by || 'User'}</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
