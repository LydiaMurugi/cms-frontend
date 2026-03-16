import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  const permissions = computed(() => authStore.user?.permissions || [])
  const role = computed(() => authStore.user?.role)

  const hasPermission = (permission) => {
    // Super-admin has all permissions
    if (role.value === 'super-admin') return true
    return permissions.value.includes(permission)
  }

  const hasAnyPermission = (permissionList) => {
    if (role.value === 'super-admin') return true
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
