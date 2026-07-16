import React, { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export function MemberStatusToggle({ isActive, onToggle, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onToggle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider select-none transition-all duration-205 border cursor-pointer outline-none
        ${isActive
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
          : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300'}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isActive ? (
        <>
          <CheckCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Active</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Deactivated</span>
        </>
      )}
    </button>
  );
}
export default MemberStatusToggle;
