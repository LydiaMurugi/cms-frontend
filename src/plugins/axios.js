import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const storedStr = localStorage.getItem("churchAuth")

  if (storedStr) {
    const data = JSON.parse(storedStr)
    const { token, user, managedTenantId } = data
    
    config.headers.Authorization = `Bearer ${token}`
    
    // Priority: 1. Managed Tenant (Impersonation) -> 2. User's Own Tenant
    const activeTenantId = managedTenantId || (user ? (user.tenantId || user.tenant_id) : null)
    
    if (activeTenantId) {
      config.headers['X-Tenant-Id'] = activeTenantId
    }
  }

  return config
})

export default api
