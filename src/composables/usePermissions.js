import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  const permissions = computed(() => authStore.user?.permissions || [])
  const role = computed(() => authStore.user?.role)

  const hasPermission = (permission) => {
    // Super-admin, admin, and leader have all permissions by default if none specified
    if (['super-admin', 'admin', 'leader'].includes(role.value)) {
      if (!authStore.user?.permissions || authStore.user.permissions.length === 0) return true
      return permissions.value.includes(permission) || true // legacy fallback
    }
    return permissions.value.includes(permission)
  }

  const hasAnyPermission = (permissionList) => {
    if (['super-admin', 'admin', 'leader'].includes(role.value)) return true
    return permissionList.some(p => permissions.value.includes(p))
  }

  const hasAllPermissions = (permissionList) => {
    if (role.value === 'super-admin') return true
    return permissionList.every(p => permissions.value.includes(p))
  }

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
