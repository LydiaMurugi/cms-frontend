import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      churchName: '',
      email: '',
      currency: 'USD',
      taxId: '',
      enableStripe: false,
      stripeKey: '',
      logoUrl: '',
    },
    admins: [
      { name: 'Lead Admin', email: 'admin@church.com', role: 'Super Admin' },
      { name: 'Pastor Michael', email: 'michael@church.com', role: 'Editor' },
    ],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/settings')
        this.settings = res.data
      } catch (err) {
        console.error('Failed to fetch settings:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async saveSettings() {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/settings', this.settings)
        this.settings = res.data
        console.log('Settings saved successfully')
        return { success: true }
      } catch (err) {
        console.error('Failed to save settings:', err)
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },
  },
})