import React from 'react'
import { User, Mail, Phone, Globe, CreditCard, Lock, Upload } from 'lucide-react'
import Input from '../../../components/ui/Input'

export default function MemberForm({
  mFirst, setMFirst,
  mLast, setMLast,
  mUname, setMUname,
  mEmail, setMEmail,
  mPhone, setMPhone,
  mCountry, setMCountry,
  mNid, setMNid,
  mPass, setMPass,
  mRole, setMRole,
  mFile, handleFileChange
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          id="modalMFirst"
          type="text"
          required
          placeholder="Jane"
          value={mFirst}
          onChange={(e) => setMFirst(e.target.value)}
          leftIcon={<User className="h-4 w-4 text-slate-400" />}
        />
        <Input
          label="Last Name"
          id="modalMLast"
          type="text"
          required
          placeholder="Doe"
          value={mLast}
          onChange={(e) => setMLast(e.target.value)}
          leftIcon={<User className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Username"
          id="modalMUname"
          type="text"
          required
          placeholder="janedoe"
          value={mUname}
          onChange={(e) => setMUname(e.target.value)}
          leftIcon={<User className="h-4 w-4 text-slate-400" />}
        />
        <Input
          label="Email"
          id="modalMEmail"
          type="email"
          required
          placeholder="jane@example.com"
          value={mEmail}
          onChange={(e) => setMEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Phone"
          id="modalMPhone"
          type="tel"
          required
          placeholder="01234567890"
          value={mPhone}
          onChange={(e) => setMPhone(e.target.value)}
          leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
        />
        <Input
          label="Country"
          id="modalMCountry"
          type="text"
          required
          placeholder="Egypt"
          value={mCountry}
          onChange={(e) => setMCountry(e.target.value)}
          leftIcon={<Globe className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="National ID"
          id="modalMNid"
          type="text"
          required
          placeholder="NID-9922"
          value={mNid}
          onChange={(e) => setMNid(e.target.value)}
          leftIcon={<CreditCard className="h-4 w-4 text-slate-400" />}
        />
        <Input
          label="Password"
          id="modalMPass"
          type="password"
          required
          placeholder="••••••••"
          value={mPass}
          onChange={(e) => setMPass(e.target.value)}
          leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
        />
      </div>

      {/* Document upload */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-555 uppercase tracking-wider block">ID scan or pitch deck document</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-20 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-all p-3 bg-white">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">
                {mFile ? mFile.name : "Upload Verification Scan"}
              </span>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {/* Role Select */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMRole('ENTREPRENEUR')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
              ${mRole === 'ENTREPRENEUR' 
                ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
          >
            Entrepreneur
          </button>
          <button
            type="button"
            onClick={() => setMRole('INVESTOR')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
              ${mRole === 'INVESTOR' 
                ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
          >
            Investor
          </button>
        </div>
      </div>
    </div>
  )
}
