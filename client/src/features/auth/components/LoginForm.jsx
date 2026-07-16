import React from 'react'
import { Mail, Lock } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import useLoginForm from '../hooks/useLoginForm'

export default function LoginForm({ onNavigate }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    loginError,
    handleSubmit
  } = useLoginForm(onNavigate)

  return (
    <Card className="w-full max-w-md p-8 space-y-6 border-slate-200 bg-white/80 relative z-10" hoverable={false}>
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <svg className="h-10 w-10 text-primary-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <circle cx="65" cy="50" r="18" stroke="currentColor" strokeWidth="8" />
            <path d="M35 32C45 32 55 68 65 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">Welcome Back</h2>
        <p className="text-slate-500 text-xs">Enter your details to access your Innovest account</p>
      </div>

      {/* Error Alert */}
      {loginError && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold leading-relaxed">
          {loginError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          id="email"
          type="email"
          required
          placeholder="name@company.com"
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

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
            <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-primary-600 focus:ring-primary-500/30" />
            <span>Remember me</span>
          </label>
          <button type="button" className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer border-none bg-transparent p-0">
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-6">
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer border-none bg-transparent p-0">
          Create account
        </button>
      </div>
    </Card>
  )
}
