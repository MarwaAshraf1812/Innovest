import { useAuth } from '../../../context/AuthContext'

export default function useAuthRole() {
  const { currentUser } = useAuth()
  const role = currentUser?.role || 'MEMBER'

  const isSuperAdmin = role === 'SUPER_ADMIN'
  const isAdmin = role === 'ADMIN'
  
  // Staff includes SUPER_ADMIN and ADMIN
  const isStaff = ['SUPER_ADMIN', 'ADMIN'].includes(role)
  const isRegularMember = !isStaff

  // Permission rules
  const canManageAdmins = isSuperAdmin
  const canManageCommunities = isStaff
  const canModerateMembers = isStaff
  const canViewAnalytics = isStaff

  return {
    role,
    currentUser,
    isSuperAdmin,
    isAdmin,
    isStaff,
    isRegularMember,
    canManageAdmins,
    canManageCommunities,
    canModerateMembers,
    canViewAnalytics
  }
}
