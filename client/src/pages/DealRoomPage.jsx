import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, PenTool, CheckCircle, Clock, Shield, Download } from 'lucide-react';
import TermSheetEditor from '../components/dealroom/TermSheetEditor.jsx';
import DealRoomAuditTimeline from '../components/dealroom/DealRoomAuditTimeline.jsx';
import DigitalSignatureModal from '../components/dealroom/DigitalSignatureModal.jsx';
import api from '../config/axios.js';

export default function DealRoomPage() {
  const { id } = useParams();
  const dealRoomId = id || 'room-demo-1';
  const [dealRoom, setDealRoom] = useState(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [userRole, setUserRole] = useState('INVESTOR'); // 'FOUNDER' | 'INVESTOR'

  const fetchDealRoom = async () => {
    try {
      const res = await api.get(`/deal-room/${dealRoomId}`);
      if (res.data) setDealRoom(res.data);
    } catch (err) {
      console.log('Using default seeded deal room preview state');
    }
  };

  useEffect(() => {
    fetchDealRoom();
  }, [dealRoomId]);

  const isSigned = dealRoom?.status === 'SIGNED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Phase 4 // Collaborative Deal Room
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Live Deal Room & SAFE Generator</h1>
            <p className="text-slate-400 text-sm mt-1">Collaborative term sheet negotiation, valuation cap redlines, and e-signatures.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUserRole(userRole === 'INVESTOR' ? 'FOUNDER' : 'INVESTOR')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-mono text-slate-300 border border-slate-700 transition-all"
            >
              Role: {userRole} (Toggle)
            </button>

            {!isSigned && (
              <button
                onClick={() => setShowSignModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <PenTool className="w-4 h-4" /> Sign Term Sheet
              </button>
            )}
          </div>
        </div>

        {/* Progress Tracker Status Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">DEAL STATUS:</span>
            <span className={`px-3 py-1 rounded-full font-bold border ${
              isSigned ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {dealRoom?.status || (isSigned ? 'SIGNED 🏆' : 'TERM_SHEET_SENT ✍️')}
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>FOUNDER: Karim (PayPharaoh)</span>
            <span>INVESTOR: Sawiris Capital</span>
          </div>
        </div>

        {/* Workspace Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TermSheetEditor
              dealRoomId={dealRoomId}
              termSheet={dealRoom?.term_sheet}
              isSigned={isSigned}
              onTermsUpdated={fetchDealRoom}
            />
          </div>

          <div>
            <DealRoomAuditTimeline auditTrail={dealRoom?.audit_trail || []} />
          </div>
        </div>

        {/* E-Signature Modal Trigger */}
        {showSignModal && (
          <DigitalSignatureModal
            dealRoomId={dealRoomId}
            role={userRole}
            onClose={() => setShowSignModal(false)}
            onSigned={() => { fetchDealRoom(); }}
          />
        )}

      </div>
    </div>
  );
}
