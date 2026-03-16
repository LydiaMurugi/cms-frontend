import { defineStore } from 'pinia'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

export const useMemberUiStore = defineStore('memberUi', {
  state: () => ({
    activeTab: 'home',
    // Sync with notificationStore for accurate count
    get unreadNotifications() {
      return useNotificationStore().unreadCount
    },
    set unreadNotifications(value) {
      // Optional: if you need to set manually, but prefer store sync
    },

    navItems: [
      {
        title: 'Home',
        value: 'home',
        icon: 'mdi-home-variant',
        path: '/member/home',
      },
      {
        title: 'Give',
        value: 'contribute',
        icon: 'mdi-hand-heart',
        path: '/member/contribute',
      },
      {
        title: 'Events',
        value: 'events',
        icon: 'mdi-calendar-star',
        path: '/member/events',
      },
      {
        title: 'Library',
        value: 'resources',
        icon: 'mdi-book-open-page-variant',
        path: '/member/resources',
      },
    ],
  }),

  actions: {
    setActiveTab(tab) {
      this.activeTab = tab
    },

    goToProfile() {
      router.push('/member/profile')
    },

    goToNotifications() {
      router.push('/member/notifications')
      // Reset handled by notificationStore on view
    },

    logoutMember() {
      const authStore = useAuthStore()

      authStore.logout()

      this.activeTab = 'home'
      this.unreadNotifications = 0

      router.replace('/login')
    },
  },
})
