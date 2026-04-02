import { defineStore } from "pinia"
import api from "@/plugins/axios"

export const useResourceStore = defineStore("resource", {
  state: () => ({
    resources: [],
    uploadProgress: 0,
    loading: false,
  }),

  actions: {
    async fetchResources() {
      this.loading = true
      try {
        const res = await api.get("/resources")
        this.resources = res.data
      } catch (err) {
        console.error("Failed to load resources", err)
      } finally {
        this.loading = false
      }
    },

    async uploadResource(payload) {
      try {
        this.loading = true
        // Important: We hit the base /resources endpoint with JSON now
        const res = await api.post("/resources", payload)

        this.resources.unshift(res.data)
        this.uploadProgress = 0
        return { success: true, data: res.data }
      } catch (error) {
        console.error("Upload save failed", error)
        return { 
          success: false, 
          error: error.response?.data?.error || "Failed to save resource to database" 
        }
      } finally {
        this.loading = false
      }
    },
  },
})
