import { defineStore } from "pinia"
import api from "@/plugins/axios"

export const useProjectStore = defineStore("projects", {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
  }),

  /* ================= GETTERS ================= */
  getters: {
    getProjectsByStatus: (state) => (status) =>
      state.projects.filter((p) => p.status === status),

    activeProjects: (state) =>
      state.projects.filter((p) => p.status !== "Completed"),

    overdueProjects: (state) => {
      const today = new Date().toISOString().split("T")[0]
      return state.projects.filter(
        (p) => p.endDate && p.endDate < today && p.status !== "Completed"
      )
    },

    budgetSummary: (state) => {
      const totalBudget = state.projects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0
      )
      const totalSpent = state.projects.reduce(
        (sum, p) => sum + (p.spent || 0),
        0
      )

      return {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        percentageUsed:
          totalBudget > 0
            ? Math.round((totalSpent / totalBudget) * 100)
            : 0,
      }
    },

    projectStats: (state) => ({
      total: state.projects.length,
      inProgress: state.projects.filter(
        (p) => p.status === "In Progress"
      ).length,
      completed: state.projects.filter(
        (p) => p.status === "Completed"
      ).length,
      overdue: state.projects.filter((p) => {
        const today = new Date().toISOString().split("T")[0]
        return p.endDate < today && p.status !== "Completed"
      }).length,
    }),
  },

  /* ================= ACTIONS ================= */
  actions: {
    /* FETCH PROJECTS */
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get("/projects")
        this.projects = res.data
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        this.error = err.response?.data?.error || err.message
      } finally {
        this.loading = false
      }
    },

    /* CREATE PROJECT */
    async addProject(projectData) {
      try {
        const res = await api.post("/projects", projectData)
        this.projects.push(res.data)
        return { success: true }
      } catch (err) {
        console.error("Error creating project:", err)
        return {
          success: false,
          error: err.response?.data?.error || err.message,
        }
      }
    },

    /* UPDATE PROJECT */
    async updateProject(projectId, updates) {
      try {
        const res = await api.patch(`/projects/${projectId}`, updates)

        const index = this.projects.findIndex(
          (p) => p.id === projectId
        )

        if (index !== -1) {
          this.projects[index] = res.data
        }

        return { success: true }
      } catch (err) {
        console.error("Error updating project:", err)
        return {
          success: false,
          error: err.response?.data?.error || err.message,
        }
      }
    },

    /* MOVE PROJECT (KANBAN STYLE) */
    async moveProject(projectId, newStatus) {
      try {
        const project = this.projects.find((p) => p.id === projectId)
        if (!project) return { success: false }

        let progress = project.progress

        if (newStatus === "Completed") {
          progress = 100
        }

        const res = await api.patch(`/projects/${projectId}`, {
          status: newStatus,
          progress,
          spent: project.spent,
        })

        const index = this.projects.findIndex(
          (p) => p.id === projectId
        )

        if (index !== -1) {
          this.projects[index] = res.data
        }

        return { success: true }
      } catch (err) {
        console.error("Error moving project:", err)
        return {
          success: false,
          error: err.response?.data?.error || err.message,
        }
      }
    },

    /* DELETE PROJECT */
    async deleteProject(projectId) {
      try {
        await api.delete(`/projects/${projectId}`)

        this.projects = this.projects.filter(
          (p) => p.id !== projectId
        )

        return { success: true }
      } catch (err) {
        console.error("Error deleting project:", err)
        return {
          success: false,
          error: err.response?.data?.error || err.message,
        }
      }
    },
  },
})