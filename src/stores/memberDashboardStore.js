import { defineStore } from "pinia"
import router from '@/router'
import api from "@/plugins/axios"
import { useAuthStore } from "@/stores/authStore"

export const useMemberDashboardStore = defineStore("memberDashboard", {
  state: () => ({
    upcomingService: null,
    givingSummary: {
      totalThisYear: 0,
      currency: "USD",
    },
    programs: [],
    resources: [],
    loading: false,
    error: null,
  }),

  getters: {
    userName: () => {
      const auth = useAuthStore()
      return auth.user?.name || "Friend"
    },

    formattedGivingTotal: (state) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: state.givingSummary.currency,
      }).format(state.givingSummary.totalThisYear)
    },
  },

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get("/dashboard")

        this.upcomingService = res.data.upcomingService
        this.givingSummary = res.data.givingSummary
        this.programs = res.data.programs
        this.resources = res.data.resources

        return { success: true }
      } catch (err) {
        this.error =
          err.response?.data?.error || "Failed to load dashboard"
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    goToLivestream() {
      // ✅ Already correct: opens external URL in new tab
      if (this.upcomingService?.livestream_url) {
        window.open(this.upcomingService.livestream_url, "_blank")
      }
    },

    viewProgram(programId) {
  router.push(`/member/events/${programId}`)
    },

    goToGivingHistory() {
      router.push("/member/contribution-history")
    },

    goToPrograms() {
     router.push("/member/events")
    },
  },
})