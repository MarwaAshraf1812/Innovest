import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Handshake, ShieldCheck, FileCheck, Lock, RefreshCw } from 'lucide-react';
import TermSheetEditor from '../components/dealroom/TermSheetEditor.jsx';
import DealRoomAuditTimeline from '../components/dealroom/DealRoomAuditTimeline.jsx';
import DigitalSignatureModal from '../components/dealroom/DigitalSignatureModal.jsx';
import api from '../config/axios.js';

export default function DealRoomPage({ currentUser }) {
  const { id } = useParams();
  const dealRoomId = id || 'room-demo-1';

  const [dealRoom, setDealRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);

  const fetchDealRoom = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/deal-room/${dealRoomId}`);
      if (res.data) setDealRoom(res.data);
    } catch (err) {
      // Fallback seeded deal room
      setDealRoom({
        deal_room_id: dealRoomId,
        status: 'DRAFTING',
        term_sheet: {
          valuation_cap: 5000000,
          discount_rate: 20,
          special_terms: 'Pro-rata rights for major investors & quarterly board observer access.',
          signatures: [
            { role: 'FOUNDER', signature_name: 'Karim El-Sayed', signed_at: new Date() }
          ]
        },
        audit_trail: [
          { action: 'DEAL_ROOM_INITIALIZED', timestamp: new Date(Date.now() - 3600000 * 24), performed_by: 'Karim El-Sayed (Founder)' },
          { action: 'TERM_SHEET_REDLINE_UPDATED (Valuation Cap: $5.0M)', timestamp: new Date(Date.now() - 3600000 * 12), performed_by: 'Sawiris Capital (Investor)' },
          { action: 'DIGITAL_SIGNATURE_EXECUTED by FOUNDER', timestamp: new Date(Date.now() - 3600000 * 2), performed_by: 'Karim El-Sayed' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealRoom();
  }, [dealRoomId]);

  const handleUpdateTermSheet = async (updatedFields) => {
    try {
      const res = await api.put(`/deal-room/${dealRoomId}/redline`, updatedFields);
      if (res.data) setDealRoom(res.data);
    } catch (err) {
      setDealRoom((prev) => ({
        ...prev,
        term_sheet: { ...prev.term_sheet, ...updatedFields },
        audit_trail: [
          ...prev.audit_trail,
          { action: `TERM_SHEET_REDLINE_UPDATED (Valuation Cap: $${updatedFields.valuation_cap})`, timestamp: new Date(), performed_by: currentUser?.username || 'User' }
        ]
      }));
    }
  };

  const isSigned = dealRoom?.status === 'SIGNED' || dealRoom?.term_sheet?.signatures?.length >= 2;
  const userRole = currentUser?.role === 'INVESTOR' ? 'INVESTOR' : 'FOUNDER';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold text-primary-600 tracking-wider uppercase flex items-center gap-1.5">
              <Handshake className="w-4 h-4 text-primary-600" /> Collaborative Negotiation Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Live Deal Room & SAFE Generator</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Deal Room ID: <code className="font-mono text-slate-700">{dealRoomId}</code></p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${
              isSigned
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              Status: {isSigned ? 'SIGNED & EXECUTED' : dealRoom?.status || 'DRAFTING'}
            </span>

            {!isSigned && (
              <button
                onClick={() => setShowSignModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer border-none"
              >
                <ShieldCheck className="w-4 h-4" /> Sign Term Sheet
              </button>
            )}

            <button
              onClick={fetchDealRoom}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Refresh Deal Room"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Grid: Term Sheet Builder + Audit Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TermSheetEditor
              termSheet={dealRoom?.term_sheet}
              onUpdate={handleUpdateTermSheet}
              isSigned={isSigned}
            />

            {/* Signature Status Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Digital Signatures Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Founder Signature</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {dealRoom?.term_sheet?.signatures?.find(s => s.role === 'FOUNDER')?.signature_name || 'Pending Execution'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    dealRoom?.term_sheet?.signatures?.some(s => s.role === 'FOUNDER')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {dealRoom?.term_sheet?.signatures?.some(s => s.role === 'FOUNDER') ? 'SIGNED' : 'PENDING'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Investor Signature</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {dealRoom?.term_sheet?.signatures?.find(s => s.role === 'INVESTOR')?.signature_name || 'Pending Execution'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    dealRoom?.term_sheet?.signatures?.some(s => s.role === 'INVESTOR')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {dealRoom?.term_sheet?.signatures?.some(s => s.role === 'INVESTOR') ? 'SIGNED' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <DealRoomAuditTimeline auditTrail={dealRoom?.audit_trail || []} />
          </div>
        </div>

        {showSignModal && (
          <DigitalSignatureModal
            dealRoomId={dealRoomId}
            role={userRole}
            onClose={() => setShowSignModal(false)}
            onSignatureSuccess={fetchDealRoom}
          />
        )}

      </div>
    </div>
  );
}
