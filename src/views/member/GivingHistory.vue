<template>
  <v-container class="pa-4 bg-background">

    <v-row class="mb-2" align="center">
      <v-col cols="auto">
        <v-btn icon="mdi-arrow-left" variant="text" color="primary" @click="router.back()" />
      </v-col>
      <v-col>
        <h1 class="text-h5 font-weight-bold text-primary">Giving History</h1>
      </v-col>
    </v-row>

    <v-card color="primary" class="rounded-xl mb-6 pa-6 text-white" elevation="4">
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <div class="text-overline opacity-80">2024 Total Contributions</div>
          <div class="text-h4 font-weight-bold">${{ annualTotal.toLocaleString() }}</div>
        </div>
        <v-icon icon="mdi-chart-bell-curve-cumulative" size="48" class="opacity-40" />
      </div>
    </v-card>

    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search by category or date..."
      variant="outlined"
      rounded="pill"
      hide-details
      class="bg-white mb-4"
    />
    <v-card v-if="filteredRecords.length" class="rounded-xl" elevation="2">
      <v-list class="pa-0">
        <template v-for="(record, index) in filteredRecords" :key="record.id">

          <v-list-item class="py-3 px-4">

            <template #prepend>
              <v-avatar
                :color="CATEGORY_COLORS[record.category] || 'info'"
                variant="tonal"
              >
                <v-icon :icon="CATEGORY_ICONS[record.category] || 'mdi-cash'" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ record.category }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ record.date }} • {{ record.method || 'Digital' }}
            </v-list-item-subtitle>

            <template #append>
              <div class="text-success font-weight-bold">
                +${{ record.amount.toLocaleString() }}
              </div>
            </template>

          </v-list-item>

          <v-divider v-if="index < filteredRecords.length - 1" />

        </template>
      </v-list>
    </v-card>
    <v-card v-else class="rounded-xl pa-10 text-center" variant="outlined">
      <v-icon icon="mdi-heart-outline" size="64" />
      <div class="text-h6 mt-2">No records found</div>
      <v-btn to="/member/contribute" variant="text">Start your first gift</v-btn>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/finance'

const router = useRouter()
const financeStore = useFinanceStore()
const authStore = useAuthStore()

const search = ref('')

const records = computed(() =>
  financeStore.memberContributions(authStore.user.id)
)

const filteredRecords = computed(() =>
  records.value.filter(r =>
    r.category.toLowerCase().includes(search.value.toLowerCase()) ||
    r.date.includes(search.value)
  )
)

const annualTotal = computed(() =>
  financeStore.memberAnnualTotal(authStore.user.id)
)
</script>

<style scoped>
.opacity-80 { opacity: .8 }
.opacity-40 { opacity: .4 }
</style>
