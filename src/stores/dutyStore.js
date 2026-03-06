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
      } catch (err) {
        this.error = err.response?.data || err.message
        console.error('Fetch duties error:', err)
      } finally {
        this.loading = false
      }
    },

    async createDuty(payload) {
      try {
        const res = await api.post('/duties', payload)

        // add to state immediately
        this.duties.push(res.data)

        return res.data
      } catch (err) {
        console.error('Create duty error:', err)
        throw err
      }
    },
  },
})