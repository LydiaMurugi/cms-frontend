import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useChurchStore = defineStore('church', {
  state: () => ({
    churches: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchChurches() {
      this.loading = true
      try {
        const res = await api.get('/tenants')
        this.churches = res.data
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch churches'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async registerChurch(churchData) {
      this.loading = true
      try {
        const res = await api.post('/tenants/register', churchData)
        // Add to list if we have it loaded
        if (this.churches.length > 0) {
          this.churches.push(res.data.tenant)
        }
        return { success: true, message: 'Church registered successfully' }
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateChurch(id, payload) {
      this.loading = true
      try {
        const res = await api.put(`/tenants/${id}`, payload)
        const index = this.churches.findIndex(c => c.id === id)
        if (index !== -1) {
          this.churches[index] = res.data
        }
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.error || 'Update failed'
        return { success: false }
      } finally {
        this.loading = false
      }
    }
  }
})
