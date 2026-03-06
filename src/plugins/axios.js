import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("churchAuth")

  if (stored) {
    const { token } = JSON.parse(stored)
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
