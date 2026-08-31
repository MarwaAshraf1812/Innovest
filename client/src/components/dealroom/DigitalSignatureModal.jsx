import React, { useState } from 'react';
import { PenTool, X, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../../config/axios.js';

export default function DigitalSignatureModal({ dealRoomId, role = 'INVESTOR', onClose, onSigned }) {
  const [signing, setSigning] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleExecuteSignature = async () => {
    if (!agreed) return;
    setSigning(true);
    try {
      await api.post(`/deal-room/${dealRoomId}/sign`, { role });
      if (onSigned) onSigned();
      if (onClose) onClose();
    } catch (err) {
      console.error('Digital signature execution failed:', err);
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl text-white relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Execute Digital E-Signature</h3>
            <p className="text-xs text-slate-400">Cryptographically binding agreement execution.</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">DEAL ROOM:</span>
            <span>{dealRoomId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SIGNING ROLE:</span>
            <span className="text-emerald-400 font-bold">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TIMESTAMP:</span>
            <span>{new Date().toISOString()}</span>
          </div>
        </div>

        <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
          />
          <span>
            I hereby execute my legally binding digital signature on this SAFE term sheet and agree to all listed terms and valuation caps.
          </span>
        </label>

        <button
          disabled={!agreed || signing}
          onClick={handleExecuteSignature}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <ShieldCheck className="w-5 h-5" /> {signing ? 'Signing Cryptographically...' : 'Sign & Execute Term Sheet'}
        </button>
      </div>
    </div>
  );
}
