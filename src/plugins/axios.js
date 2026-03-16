import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("churchAuth")

  if (stored) {
    const { token, user } = JSON.parse(stored)
    config.headers.Authorization = `Bearer ${token}`
    
    // Add Tenant ID to headers if available
    if (user && user.tenantId) {
      config.headers['X-Tenant-Id'] = user.tenantId
    }
  }

  return config
})

export default api
