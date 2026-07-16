import React from 'react'
import { X, Globe, Shield, Users, ArrowRight } from 'lucide-react'
import useCreateEntity from '../hooks/useCreateEntity'
import CommunityForm from './CommunityForm'
import AdminStaffForm from './AdminStaffForm'
import MemberForm from './MemberForm'
import Button from '../../../components/ui/Button'

export default function CreateEntityModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const {
    activeType,
    setActiveType,
    loading,
    error,
    setError,
    success,
    setSuccess,
    commName,
    setCommName,
    commDesc,
    setCommDesc,
    commTags,
    setCommTags,
    commImage,
    setCommImage,
    adminUname,
    setAdminUname,
    adminEmail,
    setAdminEmail,
    adminPass,
    setAdminPass,
    mFirst,
    setMFirst,
    mLast,
    setMLast,
    mUname,
    setMUname,
    mEmail,
    setMEmail,
    mPhone,
    setMPhone,
    mCountry,
    setMCountry,
    mNid,
    setMNid,
    mPass,
    setMPass,
    mRole,
    setMRole,
    mFile,
    handleFileChange,
    resetAllStates,
    handleFormSubmit
  } = useCreateEntity(onClose)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Add Platform Resource</h3>
          <button 
            onClick={() => { resetAllStates(); onClose(); }}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer border-none bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Custom Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1 gap-1">
          {[
            { id: 'community', label: 'Community', icon: <Globe className="h-3.5 w-3.5" /> },
            { id: 'admin', label: 'Admin Staff', icon: <Shield className="h-3.5 w-3.5" /> },
            { id: 'member', label: 'Member', icon: <Users className="h-3.5 w-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setError(null); setSuccess(null); setActiveType(tab.id); }}
              className={`flex-grow flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none
                ${activeType === tab.id 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 bg-transparent'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
              {success}
            </div>
          )}

          {/* 1. COMMUNITY FIELDS */}
          {activeType === 'community' && (
            <CommunityForm
              commName={commName}
              setCommName={setCommName}
              commDesc={commDesc}
              setCommDesc={setCommDesc}
              commTags={commTags}
              setCommTags={setCommTags}
              commImage={commImage}
              setCommImage={setCommImage}
            />
          )}

          {/* 2. ADMIN FIELDS */}
          {activeType === 'admin' && (
            <AdminStaffForm
              adminUname={adminUname}
              setAdminUname={setAdminUname}
              adminEmail={adminEmail}
              setAdminEmail={setAdminEmail}
              adminPass={adminPass}
              setAdminPass={setAdminPass}
            />
          )}

          {/* 3. MEMBER FIELDS */}
          {activeType === 'member' && (
            <MemberForm
              mFirst={mFirst}
              setMFirst={setMFirst}
              mLast={mLast}
              setMLast={setMLast}
              mUname={mUname}
              setMUname={setMUname}
              mEmail={mEmail}
              setMEmail={setMEmail}
              mPhone={mPhone}
              setMPhone={setMPhone}
              mCountry={mCountry}
              setMCountry={setMCountry}
              mNid={mNid}
              setMNid={setMNid}
              mPass={mPass}
              setMPass={setMPass}
              mRole={mRole}
              setMRole={setMRole}
              mFile={mFile}
              handleFileChange={handleFileChange}
            />
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
            <button
              type="button"
              onClick={() => { resetAllStates(); onClose(); }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer transition-all bg-transparent"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" loading={loading}>
              Confirm Add
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>

        </form>

      </div>
    </div>
  )
}
