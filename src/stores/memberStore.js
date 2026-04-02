import { defineStore } from "pinia"
import api from "@/plugins/axios"

export const useMemberStore = defineStore("members", {
  state: () => ({
    members: [],
    groups: [
      'Youth Ministry', 
      'Womens Guild', 
      'Mens Fellowship', 
      'Choir', 
      'Sunday School', 
      'Praise & Worship',
      'Ushering',
      'Media & Tech',
      'Missions & Outreach'
    ],
    loading: false,
    error: null,
    searchQuery: "",
    filterGroup: "All",
    filterStatus: "All",
  }),

  getters: {
    totalCongregation: (state) => state.members.length,

    activeMembers: (state) =>
      state.members.filter((m) => m.status === "Active"),

    inactiveMembers: (state) =>
      state.members.filter((m) => m.status === "Inactive"),

    getMembersByGroup: (state) => (groupName) =>
      state.members.filter((m) => m.group === groupName),

    // Advanced filtering
    filteredMembers: (state) => {
      let result = [...state.members]

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(
          (m) =>
            m.name?.toLowerCase().includes(query) ||
            m.email?.toLowerCase().includes(query)
        )
      }

      if (state.filterGroup !== "All") {
        result = result.filter((m) => m.group === state.filterGroup)
      }

      if (state.filterStatus !== "All") {
        result = result.filter((m) => m.status === state.filterStatus)
      }

      return result
    },

    getMemberById: (state) => (id) =>
      state.members.find((m) => m.id === id),

    groupStatistics: (state) => {
      return state.groups.map((group) => ({
        name: group,
        count: state.members.filter((m) => m.group === group).length,
        active: state.members.filter(
          (m) => m.group === group && m.status === "Active"
        ).length,
      }))
    },
  },

  actions: {
    // Fetch all members from backend
    async fetchMembers() {
      this.loading = true
      this.error = null

      try {
        const res = await api.get("/users")

        this.members = res.data

        // Merge auto-detected groups from members with our pre-defined list
        const detectedGroups = res.data
          .map((m) => m.group)
          .filter((g) => g && g !== "")
        
        this.groups = [...new Set([...this.groups, ...detectedGroups])]

        return { success: true }
      } catch (err) {
        this.error =
          err.response?.data?.error || "Failed to fetch members"
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    // Add member
    async addMember(memberData) {
      try {
        const res = await api.post("/users", memberData)

        this.members.push(res.data)

        // update groups dynamically
        if (!this.groups.includes(res.data.group)) {
          this.groups.push(res.data.group)
        }

        return { success: true, member: res.data }
      } catch (err) {
        return {
          success: false,
          error:
            err.response?.data?.error || "Failed to add member",
        }
      }
    },

    // Bulk add members
    async bulkAddMembers(membersList) {
      this.loading = true
      const results = {
        success: [],
        failed: []
      }

      for (const member of membersList) {
        try {
          const res = await api.post("/users", member)
          this.members.push(res.data)
          
          if (!this.groups.includes(res.data.group)) {
            this.groups.push(res.data.group)
          }
          
          results.success.push(res.data)
        } catch (err) {
          results.failed.push({
            member,
            error: err.response?.data?.error || "Connection error"
          })
        }
      }

      this.loading = false
      return results
    },

    // Update member
    async updateMember(memberId, updates) {
      try {
        const res = await api.put(`/users/${memberId}`, updates)

        const index = this.members.findIndex(
          (m) => m.id === memberId
        )

        if (index !== -1) {
          this.members[index] = res.data
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error:
            err.response?.data?.error ||
            "Failed to update member",
        }
      }
    },

    // Update member status
    async updateMemberStatus(memberId, status) {
      return await this.updateMember(memberId, { status })
    },

    // Delete member
    async deleteMember(memberId) {
      try {
        await api.delete(`/users/${memberId}`)

        this.members = this.members.filter(
          (m) => m.id !== memberId
        )

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error:
            err.response?.data?.error ||
            "Failed to delete member",
        }
      }
    },

    // Filters
    setSearchQuery(query) {
      this.searchQuery = query
    },

    setGroupFilter(group) {
      this.filterGroup = group
    },

    setStatusFilter(status) {
      this.filterStatus = status
    },

    resetFilters() {
      this.searchQuery = ""
      this.filterGroup = "All"
      this.filterStatus = "All"
    },
  },
})