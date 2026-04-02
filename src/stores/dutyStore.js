import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useDutyStore = defineStore('duties', {
  state: () => ({
    duties: [],
    loading: false,
    error: null,
  }),

  getters: {
    pendingDuties: (state) =>
      state.duties.filter(d => d.status === 'Pending'),

    submittedDuties: (state) =>
      state.duties.filter(d => d.status === 'Submitted'),
  },

  actions: {
    async fetchDuties() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get('/duties')
        this.duties = res.data
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch duties'
        console.error('Fetch duties error:', err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createDuty(payload) {
      this.loading = true
      try {
        const res = await api.post('/duties', payload)
        this.duties.unshift(res.data)
        return { success: true, data: res.data }
      } catch (err) {
        console.error('Create duty error:', err)
        return { success: false, error: err.response?.data?.error || 'Failed to create duty' }
      } finally {
        this.loading = false
      }
    },

    async submitReport(id, notes) {
      this.loading = true
      try {
        const res = await api.put(`/duties/${id}/submit`, { notes })
        const index = this.duties.findIndex(d => d.id === id)
        if (index !== -1) {
          this.duties[index] = res.data
        }
        return { success: true }
      } catch (err) {
        console.error('Submit report error:', err)
        return { success: false, error: err.response?.data?.error || 'Failed to submit report' }
      } finally {
        this.loading = false
      }
    },

    async updateDuty(id, payload) {
      this.loading = true
      try {
        const res = await api.put(`/duties/${id}`, payload)
        const index = this.duties.findIndex(d => d.id === id)
        if (index !== -1) {
          this.duties[index] = res.data
        }
        return { success: true }
      } catch (err) {
        console.error('Update duty error:', err)
        return { success: false, error: err.response?.data?.error || 'Failed to update duty' }
      } finally {
        this.loading = false
      }
    },

    async deleteDuty(id) {
      this.loading = true
      try {
        await api.delete(`/duties/${id}`)
        this.duties = this.duties.filter(d => d.id !== id)
        return { success: true }
      } catch (err) {
        console.error('Delete duty error:', err)
        return { success: false, error: err.response?.data?.error || 'Failed to delete duty' }
      } finally {
        this.loading = false
      }
    }
  },
})
