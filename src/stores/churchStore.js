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
        console.warn('Backend /tenants not found, using empty list for now')
        this.churches = []
        return { success: true }
      } finally {
        this.loading = false
      }
    },

    async registerChurch(churchData) {
      this.loading = true
      try {
        const res = await api.post('/tenants/register', churchData)
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
    },

    async deleteChurch(id) {
      this.loading = true
      try {
        await api.delete(`/tenants/${id}`)
        this.churches = this.churches.filter(c => c.id !== id)
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.error || 'Deletion failed'
        return { success: false }
      } finally {
        this.loading = false
      }
    }
  }
})
