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
      try {
        const res = await api.get("/resources")
        this.resources = res.data
      } catch (err) {
        console.error("Failed to load resources", err)
      }
    },

    async uploadResource(payload) {
      try {
        this.loading = true
        this.uploadProgress = 0

        const formData = new FormData()
        formData.append("file", payload.file)
        formData.append("title", payload.title)
        formData.append("category", payload.category)
        formData.append("description", payload.description)
        formData.append("isPublic", payload.isPublic)
        formData.append("targetGroup", payload.targetGroup)

        const res = await api.post("/resources/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            this.uploadProgress = percent
          },
        })

        this.resources.unshift(res.data)
        this.uploadProgress = 0
      } catch (error) {
        console.error("Upload failed", error)
      } finally {
        this.loading = false
      }
    },
  },
})