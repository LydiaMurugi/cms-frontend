<template>
  <div class="contribution-history-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Contribution History</h1>
      <p class="text-caption text-grey-darken-1">View your giving history and details.</p>
    </div>

    <!-- Error Alert -->
    <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Summary Section - Flat Cards -->
    <v-row dense class="mb-6">
      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-3 border-thin bg-white h-100">
          <p class="text-tiny text-medium-emphasis font-weight-bold mb-1">TOTAL GIVEN</p>
          <h3 class="text-h6 font-weight-bold text-success">{{ totalGiven }}</h3>
        </BaseCard>
      </v-col>

      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-3 border-thin bg-white h-100">
          <p class="text-tiny text-medium-emphasis font-weight-bold mb-1">GIFTS</p>
          <h3 class="text-h6 font-weight-bold text-primary">{{ contributions.length }}</h3>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4 rounded-pill" height="2" />

    <!-- Contributions List - Mobile Friendly -->
    <div v-if="contributions.length > 0">
      <BaseCard
        v-for="contribution in contributions"
        :key="contribution.id"
        elevation="0"
        rounded="md"
        class="mb-2 border-thin bg-white no-padding"
      >
        <v-list-item class="py-3 px-4">
          <template #prepend>
            <v-avatar color="green-lighten-5" rounded="md" size="40" class="mr-3">
              <v-icon icon="mdi-hand-heart" color="success" size="20" />
            </v-avatar>
          </template>

          <v-list-item-title class="text-subtitle-2 font-weight-bold">
            {{ contribution.type }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatDate(contribution.date) }} • {{ contribution.description }}
          </v-list-item-subtitle>

          <template #append>
            <div class="text-right">
              <div class="text-subtitle-2 font-weight-bold text-success">
                {{ formatCurrency(contribution.amount) }}
              </div>
              <v-chip
                size="x-small"
                :color="statusColor(contribution.status)"
                variant="tonal"
                rounded="md"
                class="text-tiny font-weight-bold"
              >
                {{ contribution.status }}
              </v-chip>
            </div>
          </template>
        </v-list-item>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else-if="!loading">
      <BaseCard elevation="0" rounded="md" class="pa-10 text-center border-thin bg-white">
        <v-icon icon="mdi-history" size="48" color="grey-lighten-2" class="mb-3" />
        <h3 class="text-subtitle-1 font-weight-bold mb-1">No Contributions</h3>
        <p class="text-caption text-medium-emphasis">
          You haven't made any contributions yet.
        </p>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'

const financeStore = useFinanceStore()
const authStore = useAuthStore()
const contributions = ref([])
const loading = ref(true)
const error = ref(null)

// Mock data - replace with API call
const mockData = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Tithe',
    description: 'Weekly tithe',
    amount: 100,
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-01-08',
    type: 'Offering',
    description: 'Special offering',
    amount: 50,
    status: 'Completed',
  },
  {
    id: 3,
    date: '2024-01-01',
    type: 'Tithe',
    description: 'Weekly tithe',
    amount: 100,
    status: 'Completed',
  },
]

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    contributions.value = mockData
  } catch (err) {
    error.value = 'Failed to load contribution history'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const totalGiven = computed(() => {
  const total = contributions.value.reduce((sum, c) => sum + c.amount, 0)
  return formatCurrency(total)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const statusColor = (status) => {
  const colors = {
    Completed: 'success',
    Pending: 'warning',
    Failed: 'error',
  }
  return colors[status] || 'primary'
}
</script>

<style scoped>
.contribution-history-view {
  max-width: 600px;
  margin: 0 auto;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.text-tiny {
  font-size: 0.65rem;
}
</style>
