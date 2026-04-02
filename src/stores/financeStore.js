import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { CATEGORY_COLORS } from '@/constants/finance'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    titheRecords: [],
    categories: [
      'Tithe',
      'Building Fund',
      'Missions',
      'Youth Ministry',
      'Benevolence',
      'Special Offering',
    ],
    paymentMethods: [
      'Cash',
      'Bank Transfer',
      'Mobile Money',
      'Check',
      'Card',
    ],
    currency: 'USD',
    loading: false,
    error: null,
  }),

  /* ===================== GETTERS ===================== */
  getters: {
    categoryAnalytics: (state) => {
      const total = state.titheRecords.reduce(
        (sum, r) => sum + Number(r.amount),
        0
      )

      return state.categories.map((cat) => {
        const amount = state.titheRecords
          .filter((r) => r.category === cat)
          .reduce((sum, r) => sum + Number(r.amount), 0)

        return {
          category: cat,
          amount,
          percentage: total
            ? Math.round((amount / total) * 100)
            : 0,
          color: CATEGORY_COLORS[cat] || 'grey',
        }
      })
    },

    totalContributions: (state) =>
      state.titheRecords.reduce(
        (sum, r) => sum + Number(r.amount),
        0
      ),

    recordsByTimeframe: (state) => (months) => {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - months)

      return state.titheRecords.filter(
        (r) => new Date(r.date) >= cutoff
      )
    },

    contributionsByCategory: (state, getters) => {
      const total = getters.totalContributions

      return state.categories.map((category) => {
        const records = state.titheRecords.filter(
          (r) => r.category === category
        )

        const categoryTotal = records.reduce(
          (sum, r) => sum + Number(r.amount),
          0
        )

        return {
          category,
          total: categoryTotal,
          percentage: total
            ? Math.round((categoryTotal / total) * 100)
            : 0,
          count: records.length,
        }
      })
    },

    monthlyTotals: (state) => (months = 6) => {
      const result = []
      const now = new Date()

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthYear = d.toLocaleString('default', { month: 'short' })
        const monthIndex = d.getMonth()
        const year = d.getFullYear()

        const total = state.titheRecords
          .filter((r) => {
            const recordDate = new Date(r.date)
            return (
              recordDate.getFullYear() === year &&
              recordDate.getMonth() === monthIndex
            )
          })
          .reduce((sum, r) => sum + Number(r.amount), 0)

        result.push({
          label: monthYear,
          total,
        })
      }
      return result
    },

    topContributors: (state) => {
      const map = {}

      state.titheRecords.forEach((r) => {
        if (!map[r.memberId]) {
          map[r.memberId] = {
            memberId: r.memberId,
            name: r.memberName,
            total: 0,
            lastDate: r.date,
          }
        }

        map[r.memberId].total += Number(r.amount)

        if (
          new Date(r.date) >
          new Date(map[r.memberId].lastDate)
        ) {
          map[r.memberId].lastDate = r.date
        }
      })

      return Object.values(map)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
    },

    memberContributions: (state) => (memberId) =>
      [...state.titheRecords]
        .filter((r) => r.memberId === memberId)
        .sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ),

    recentMemberContributions:
      (state) => (memberId, limit = 2) =>
        [...state.titheRecords]
          .filter((r) => r.memberId === memberId)
          .sort(
            (a, b) =>
              new Date(b.date) - new Date(a.date)
          )
          .slice(0, limit),

    memberAnnualTotal:
      (state) =>
      (memberId, year = new Date().getFullYear()) =>
        state.titheRecords
          .filter((r) => {
            const recordYear = new Date(r.date).getFullYear()
            return (
              r.memberId === memberId &&
              recordYear === year
            )
          })
          .reduce((sum, r) => sum + Number(r.amount), 0),

    analyticsKPIs() {
      const contributingMembers = new Set(this.titheRecords.map(r => r.memberId)).size
      
      return [
        {
          title: 'Total Revenue',
          value: this.totalContributions,
          icon: 'mdi-bank-transfer-in',
          color: 'primary',
        },
        {
          title: 'Total Records',
          value: this.titheRecords.length,
          icon: 'mdi-cash-multiple',
          color: 'success',
        },
        {
          title: 'Avg. Gift',
          value:
            this.titheRecords.length > 0
              ? Math.round(
                  this.totalContributions /
                    this.titheRecords.length
                )
              : 0,
          icon: 'mdi-chart-bar',
          color: 'secondary',
        },
        {
          title: 'Contributors',
          value: contributingMembers,
          icon: 'mdi-account-group',
          color: 'info',
        },
      ]
    },

    financeStats() {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()

      const yearTotal = this.titheRecords
        .filter(
          (r) =>
            new Date(r.date).getFullYear() ===
            currentYear
        )
        .reduce((sum, r) => sum + Number(r.amount), 0)

      const monthTotal = this.titheRecords
        .filter((r) => {
          const d = new Date(r.date)
          return (
            d.getFullYear() === currentYear &&
            d.getMonth() === currentMonth
          )
        })
        .reduce((sum, r) => sum + Number(r.amount), 0)

      return {
        yearTotal,
        monthTotal,
        totalRecords: this.titheRecords.length,
        averageContribution:
          this.titheRecords.length > 0
            ? Math.round(
                this.totalContributions /
                  this.titheRecords.length
              )
            : 0,
      }
    },
  },

  /* ===================== ACTIONS ===================== */
  actions: {
    async fetchContributions() {
      this.loading = true
      try {
        const res = await api.get('/finance')
        this.titheRecords = res.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      } finally {
        this.loading = false
      }
    },

    async recordContribution(payload) {
      try {
        const res = await api.post('/finance', payload)
        this.titheRecords.unshift(res.data)
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error,
        }
      }
    },

    async updateContribution(id, updates) {
      try {
        const res = await api.put(`/finance/${id}`, updates)

        const index = this.titheRecords.findIndex(
          (r) => r.id === id
        )

        if (index !== -1) {
          this.titheRecords[index] = res.data
        }

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error,
        }
      }
    },

    async deleteContribution(id) {
      try {
        await api.delete(`/finance/${id}`)

        this.titheRecords = this.titheRecords.filter(
          (r) => r.id !== id
        )

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error,
        }
      }
    },

    async fetchMemberContributions(memberId) {
      try {
        const res = await api.get(
          `/finance/member/${memberId}`
        )
        return res.data
      } catch (err) {
        return []
      }
    },
  },
})