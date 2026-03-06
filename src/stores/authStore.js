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
    isAdmin: (state) => state.user?.role === "admin",
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

        this.token = token
        this.user = user

        localStorage.setItem(
          "churchAuth",
          JSON.stringify({
            token,
            user,
          })
        )

        return { success: true }
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
        this.token = res.data.token

        localStorage.setItem(
          "churchAuth",
          JSON.stringify({
            token: res.data.token,
            user: res.data,
          })
        )
      } catch (error) {
        this.logout()
      }
    },

    async updateProfile(payload) {
      this.loading = true
      this.error = null

      try {
        const res = await api.put("/auth/me", payload)
        // Update the user object with the response
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

      if (!stored) return

      const data = JSON.parse(stored)

      this.token = data.token
      this.user = data.user

      await this.fetchMe()
    },
  },
})
