<template>
  <div class="giving-history-view">
    <!-- Header -->
    <div class="d-flex align-center mb-6 px-2">
      <BaseButton icon="mdi-arrow-left" variant="text" color="primary" size="small" rounded="md" @click="router.back()" class="mr-2" />
      <h1 class="text-h5 font-weight-bold text-primary">Giving History</h1>
    </div>

    <!-- Summary Card - Flat Scroll Style -->
    <BaseCard elevation="0" rounded="md" color="primary" class="mb-6 modern-service-card">
      <div class="d-flex justify-space-between align-center pa-6">
        <div>
          <div class="text-overline text-white-70">2024 Total Contributions</div>
          <div class="text-h4 font-weight-bold text-white">${{ annualTotal.toLocaleString() }}</div>
        </div>
        <v-icon icon="mdi-chart-bell-curve-cumulative" size="48" color="white" class="opacity-40" />
      </div>
    </BaseCard>

    <!-- Search -->
    <div class="px-2 mb-4">
      <BaseInput
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by category or date..."
        hide-details
      />
    </div>

    <!-- History List -->
    <div v-if="filteredRecords.length">
      <BaseCard
        v-for="record in filteredRecords"
        :key="record.id"
        elevation="0"
        rounded="md"
        class="mb-2 border-thin bg-white no-padding"
      >
        <v-list-item class="py-3 px-4">
          <template #prepend>
            <v-avatar
              :color="(CATEGORY_COLORS[record.category] || 'info') + '-lighten-5'"
              rounded="md"
              size="40"
              class="mr-3 border-thin"
            >
              <v-icon 
                :icon="CATEGORY_ICONS[record.category] || 'mdi-cash'" 
                :color="CATEGORY_COLORS[record.category] || 'info'"
                size="20"
              />
            </v-avatar>
          </template>

          <v-list-item-title class="text-subtitle-2 font-weight-bold">
            {{ record.category }}
          </v-list-item-title>

          <v-list-item-subtitle class="text-caption">
            {{ record.date }} • {{ record.method || 'Digital' }}
          </v-list-item-subtitle>

          <template #append>
            <div class="text-success font-weight-bold">
              +${{ record.amount.toLocaleString() }}
            </div>
          </template>
        </v-list-item>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else>
      <BaseCard elevation="0" rounded="md" class="pa-10 text-center border-thin bg-white">
        <v-icon icon="mdi-heart-outline" size="48" color="grey-lighten-2" class="mb-3" />
        <h3 class="text-subtitle-1 font-weight-bold mb-1">No records found</h3>
        <BaseButton to="/member/contribute" variant="text" size="small" color="primary">
          Start your first gift
        </BaseButton>
      </BaseCard>
    </template>
  </div>
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
.giving-history-view {
  max-width: 600px;
  margin: 0 auto;
}

.modern-service-card {
  background: linear-gradient(135deg, #5D4037 0%, #795548 100%);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.opacity-40 { opacity: .4 }
</style>
