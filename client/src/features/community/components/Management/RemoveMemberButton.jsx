import React, { useState } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import Button from '../../../../components/ui/Button'

export function RemoveMemberButton({ username, onRemove, disabled }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onRemove();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200/50 hover:border-rose-500 transition-all cursor-pointer outline-none
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Remove Member from Community"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-200 p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent p-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-1.5 text-left">
              <h4 className="text-sm font-black text-slate-900">Remove community member?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently remove <span className="font-bold text-slate-800">@{username}</span> from this community discussion board? They will lose access to all posts, tags, and chats.
              </p>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-grow justify-center font-bold text-xs h-9 border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirm}
                loading={loading}
                className="flex-grow justify-center font-bold text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white"
              >
                Remove
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
export default RemoveMemberButton;
