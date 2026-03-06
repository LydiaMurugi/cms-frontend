import { defineStore } from "pinia"
import api from "@/plugins/axios"

export const useProgramStore = defineStore("programs", {
  state: () => ({
    programs: [],
    loading: false,
  }),
  
getters: {
  upcomingPrograms: (state) =>
    state.programs.slice(0, 5),
},
  actions: {
    async fetchPrograms() {
      try {
        this.loading = true
        const res = await api.get("/programs")
        this.programs = res.data
      } catch (error) {
        console.error("Failed to fetch programs", error)
      } finally {
        this.loading = false
      }
    },

    async createProgram(program) {
      const res = await api.post("/programs", program)
      this.programs.unshift(res.data)
    },

    async updateProgram(id, program) {
      const res = await api.put(`/programs/${id}`, program)

      const index = this.programs.findIndex(p => p.id === id)
      if (index !== -1) this.programs[index] = res.data
    },

    async deleteProgram(id) {
      await api.delete(`/programs/${id}`)
      this.programs = this.programs.filter(p => p.id !== id)
    },
  },
})