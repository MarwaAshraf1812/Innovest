import React from 'react'
import { Mail, Lock, User, Briefcase, TrendingUp, Phone, Globe, CreditCard, Upload, ArrowRight, ArrowLeft } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import useRegisterForm from '../hooks/useRegisterForm'

export default function RegisterForm({ onNavigate }) {
  const {
    step,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    country,
    setCountry,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    nationalId,
    setNationalId,
    documentFile,
    handleFileChange,
    loading,
    regError,
    regSuccess,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    handleNextStep,
    handlePrevStep,
    handleSubmit
  } = useRegisterForm(onNavigate)

  return (
    <Card className="w-full max-w-xl p-8 space-y-6 border-slate-200 bg-white/80 relative z-10" hoverable={false}>
      
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <svg className="h-10 w-10 text-primary-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Create Account</h2>
        <p className="text-slate-500 text-xs">Join our exclusive network of startup pioneers</p>
      </div>

      {/* Stepper Progress Bar */}
      {!regSuccess && (
        <div className="relative flex items-center justify-between w-full max-w-sm mx-auto px-4 py-2">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute left-8 top-1/2 h-0.5 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-300" 
            style={{ width: `${(step - 1) * 50}%` }}
          />

          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-1.5">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border
                  ${step >= s 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-600/25 scale-105' 
                    : 'bg-white border-slate-200 text-slate-400'}`}
              >
                {s}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {s === 1 ? 'Profile' : s === 2 ? 'Security' : 'Vetting'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Success State */}
      {regSuccess ? (
        <div className="text-center p-6 space-y-4 bg-emerald-50 border border-emerald-150 rounded-2xl">
          <h3 className="text-lg font-bold text-emerald-800">Application Submitted!</h3>
          <p className="text-xs sm:text-sm text-emerald-655 leading-relaxed">
            {regSuccess} <br />
            An administrator will review your national ID scan and project profile shortly.
          </p>
          <Button variant="primary" className="mx-auto" onClick={() => onNavigate('login')}>
            Go to Sign In
          </Button>
        </div>
      ) : (
        <>
          {/* Error Alert */}
          {regError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold leading-relaxed">
              {regError}
            </div>
          )}

          {/* Form Content per Step */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-4 transition-all duration-300 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    id="firstName"
                    type="text"
                    required
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    leftIcon={<User className="h-4.5 w-4.5 text-slate-400" />}
                  />
                  <Input
                    label="Last Name"
                    id="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    leftIcon={<User className="h-4.5 w-4.5 text-slate-400" />}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone (11-13 digits)"
                    id="phone"
                    type="tel"
                    required
                    placeholder="01234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="h-4.5 w-4.5 text-slate-400" />}
                  />
                  <Input
                    label="Country"
                    id="country"
                    type="text"
                    required
                    placeholder="Egypt"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    leftIcon={<Globe className="h-4.5 w-4.5 text-slate-400" />}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: CREDENTIALS */}
            {step === 2 && (
              <div className="space-y-4 transition-all duration-300 animate-in fade-in">
                <Input
                  label="Username"
                  id="username"
                  type="text"
                  required
                  placeholder="janedoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leftIcon={<User className="h-4.5 w-4.5 text-slate-400" />}
                />
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4.5 w-4.5 text-slate-400" />}
                />
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4.5 w-4.5 text-slate-400" />}
                />
              </div>
            )}

            {/* STEP 3: VETTING & ROLE */}
            {step === 3 && (
              <div className="space-y-4 transition-all duration-300 animate-in fade-in">
                
                {/* Role selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">I want to join as:</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('ENTREPRENEUR')}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${role === 'ENTREPRENEUR' 
                          ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                    >
                      <Briefcase className="h-4 w-4" />
                      Entrepreneur
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('INVESTOR')}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${role === 'INVESTOR' 
                          ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Investor
                    </button>
                  </div>
                </div>

                <Input
                  label="National ID / Registration ID"
                  id="nationalId"
                  type="text"
                  required
                  placeholder="NID-882736155"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  leftIcon={<CreditCard className="h-4.5 w-4.5 text-slate-400" />}
                />

                {/* Document Scan Upload */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Verification Document (PDF/ID Scan)</span>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50/50 hover:border-primary-500/50 transition-all p-4">
                      <div className="flex flex-col items-center justify-center pt-2 pb-2">
                        <Upload className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs text-slate-500 font-medium">
                          {documentFile ? documentFile.name : "Click to upload verification document"}
                        </p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* Pipeline Stepper Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm cursor-pointer transition-all flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className={`px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm cursor-pointer transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary-600/10 border-none
                    ${(step === 1 ? !isStep1Valid() : !isStep2Valid()) ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''}`}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  disabled={!isStep3Valid()}
                >
                  Create Account
                </Button>
              )}
            </div>

          </form>

          {/* Footer Links */}
          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer border-none bg-transparent p-0">
              Sign In
            </button>
          </div>
        </>
      )}

    </Card>
  )
}
