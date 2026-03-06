import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    loading: false,
    error: null,
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/notifications')
        this.notifications = res.data.notifications || []
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to fetch notifications'
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId) {
      try {
        await api.put(`/notifications/${notificationId}/read`)
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) notification.read = true
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to mark as read'
      }
    },

    async markAllAsRead() {
      try {
        await api.put('/notifications/mark-all-read')
        this.notifications.forEach(n => n.read = true)
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to mark all as read'
      }
    },
  },
})