import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  const permissions = computed(() => authStore.user?.permissions || [])
  const role = computed(() => authStore.user?.role)
  const isSuperAdmin = computed(() => role.value === 'super-admin')
  const isAdmin = computed(() => ['super-admin', 'church-admin', 'admin', 'leader'].includes(role.value))

  const hasPermission = (permission) => {
    // Super-admin has all permissions by default
    if (isSuperAdmin.value) return true
    
    // admin, leader, and church-admin have all permissions by default if none specified
    if (['admin', 'leader', 'church-admin'].includes(role.value)) {
      if (!authStore.user?.permissions || authStore.user.permissions.length === 0) return true
      return permissions.value.includes(permission) || true // fallback
    }
    return permissions.value.includes(permission)
  }

  const hasAnyPermission = (permissionList) => {
    if (isSuperAdmin.value || ['admin', 'leader', 'church-admin'].includes(role.value)) return true
    return permissionList.some(p => permissions.value.includes(p))
  }

  const hasAllPermissions = (permissionList) => {
    if (isSuperAdmin.value) return true
    return permissionList.every(p => permissions.value.includes(p))
  }

  return {
    permissions,
    role,
    isSuperAdmin,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
