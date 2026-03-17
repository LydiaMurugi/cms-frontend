import { defineStore } from "pinia"
import api from "@/plugins/axios"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    checked: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.role === "super-admin",
    isChurchAdmin: (state) => ["church-admin", "admin", "leader"].includes(state.user?.role),
    isMember: (state) => state.user?.role === "member",
    // Helper for any admin access
    isAdmin: (state) => ["super-admin", "church-admin", "admin", "leader"].includes(state.user?.role),
    tenantId: (state) => state.user?.tenantId || null,
    needsPasswordChange: (state) => state.user?.needsPasswordChange || false,
  },

  actions: {
    async login(email, password) {
      try {
        this.loading = true

        const res = await api.post("/auth/login", {
          email,
          password,
        })

        const { token, user } = res.data
        console.log('🚀 DEBUG [AuthStore]: Login Response User Object:', JSON.stringify(user, null, 2))
        console.log('🚀 DEBUG [AuthStore]: User Role detected as:', user.role)

        this.token = token
        this.user = user

        localStorage.setItem(
          "churchAuth",
          JSON.stringify({
            token,
            user,
          })
        )

        return { 
          success: true, 
          needsPasswordChange: user.needsPasswordChange 
        }
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.error || "Login failed",
        }
      } finally {
        this.loading = false
      }
    },

    async changePassword(newPassword) {
      try {
        this.loading = true
        await api.post("/auth/change-password", { password: newPassword })
        if (this.user) this.user.needsPasswordChange = false
        return { success: true }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.error || "Password change failed",
        }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        const res = await api.post("/auth/register", userData)

        return {
          success: true,
          message: res.data.message,
        }
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.error ||
            "Registration failed",
        }
      }
    },

    async fetchMe() {
      try {
        const res = await api.get("/auth/me")

        this.user = res.data
        // Ensure checked is set
        this.checked = true
      } catch (error) {
        this.logout()
      }
    },

    async updateProfile(payload) {
      this.loading = true
      this.error = null

      try {
        const res = await api.put("/auth/me", payload)
        this.user = { ...this.user, ...res.data.user }
        return { success: true, message: "Profile updated successfully" }
      } catch (err) {
        this.error = err.response?.data?.error || "Failed to update profile"
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem("churchAuth")
    },

    async checkAuth() {
      const stored = localStorage.getItem("churchAuth")

      if (!stored) {
        this.checked = true
        return
      }

      const data = JSON.parse(stored)

      this.token = data.token
      this.user = data.user

      await this.fetchMe()
    },
  },
})
