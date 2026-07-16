import React from 'react'
import { User, Mail, Lock } from 'lucide-react'
import Input from '../../../components/ui/Input'

export default function AdminStaffForm({ adminUname, setAdminUname, adminEmail, setAdminEmail, adminPass, setAdminPass }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Input
        label="Username"
        id="modalAdminUname"
        type="text"
        required
        placeholder="admin_karl"
        value={adminUname}
        onChange={(e) => setAdminUname(e.target.value)}
        leftIcon={<User className="h-4 w-4 text-slate-400" />}
      />
      <Input
        label="Email Address"
        id="modalAdminEmail"
        type="email"
        required
        placeholder="karl@innovest.co"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
      />
      <Input
        label="Security Password"
        id="modalAdminPass"
        type="password"
        required
        placeholder="••••••••"
        value={adminPass}
        onChange={(e) => setAdminPass(e.target.value)}
        leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
      />
    </div>
  )
}
