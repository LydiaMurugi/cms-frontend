<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>My Contribution History</v-card-title>
      <v-data-table
        :items="contributions"
        :headers="headers"
        :loading="loading"
        no-data-text="No contributions found."
      >
        <template v-slot:item.amount>
          {{ formatCurrency(item.amount) }}
        </template>
        <template v-slot:item.date>
          {{ formatDate(item.date) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'

const financeStore = useFinanceStore()
const authStore = useAuthStore()
const contributions = ref([])
const loading = ref(true)

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Amount', key: 'amount' },
  { title: 'Category', key: 'category' },
]

onMounted(async () => {
  const memberId = authStore.user?.id
  if (memberId) {
    await financeStore.fetchMemberContributions(memberId)
    contributions.value = financeStore.contributions
  }
  loading.value = false
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>