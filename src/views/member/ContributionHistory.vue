<template>
  <div class="contribution-history-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-6 px-2 d-flex justify-space-between align-end">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Contribution History</h1>
        <p class="text-caption text-grey-darken-1">View your giving history and details.</p>
      </div>
      <BaseButton 
        v-if="contributions.length > 0"
        variant="tonal" 
        size="x-small" 
        color="primary" 
        prepend-icon="mdi-file-pdf-box"
        @click="downloadGivingStatement"
      >
        Download Statement
      </BaseButton>
    </div>

    <!-- Error Alert -->
    <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Summary Section - Flat Cards -->
    <v-row dense class="mb-6">
      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-3 border-thin bg-white h-100">
          <p class="text-tiny text-medium-emphasis font-weight-bold mb-1">TOTAL GIVEN ({{ currentYear }})</p>
          <h3 class="text-h6 font-weight-bold text-success">{{ formatCurrency(memberAnnualTotal) }}</h3>
        </BaseCard>
      </v-col>

      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-3 border-thin bg-white h-100">
          <p class="text-tiny text-medium-emphasis font-weight-bold mb-1">ALL-TIME GIFTS</p>
          <h3 class="text-h6 font-weight-bold text-primary">{{ contributions.length }}</h3>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Contributions List - Mobile Friendly -->
    <div v-else-if="contributions.length > 0">
      <BaseCard
        v-for="contribution in contributions"
        :key="contribution.id"
        elevation="0"
        rounded="md"
        class="mb-2 border-thin bg-white no-padding hover-shadow transition-all"
      >
        <v-list-item class="py-3 px-4">
          <template #prepend>
            <v-avatar color="green-lighten-5" rounded="md" size="40" class="mr-1">
              <v-icon icon="mdi-heart" color="success" size="20" />
            </v-avatar>
          </template>

          <v-list-item-title class="text-subtitle-2 font-weight-bold text-primary">
            {{ contribution.category }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatDate(contribution.date) }} • {{ contribution.method || 'Online' }}
          </v-list-item-subtitle>

          <template #append>
            <div class="text-right">
              <div class="text-subtitle-2 font-weight-bold text-success">
                {{ formatCurrency(contribution.amount) }}
              </div>
              <v-chip
                size="x-tiny"
                color="success"
                variant="flat"
                rounded="sm"
                class="text-uppercase font-weight-bold px-2 mt-1"
              >
                Verified
              </v-chip>
            </div>
          </template>
        </v-list-item>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else>
      <BaseCard elevation="0" rounded="md" class="pa-12 text-center border-thin bg-white">
        <v-icon icon="mdi-gift-outline" size="48" color="grey-lighten-2" class="mb-3" />
        <h3 class="text-subtitle-2 font-weight-bold mb-1">No giving history found</h3>
        <p class="text-caption text-medium-emphasis mb-6">
          Your contributions to church missions and projects will appear here.
        </p>
        <BaseButton color="primary" variant="tonal" size="small" to="/member/contribute">
          Make a Gift
        </BaseButton>
      </BaseCard>
    </template>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" color="info" timeout="3000" rounded="md" elevation="0">
      Statement generation started...
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'

const financeStore = useFinanceStore()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const snackbar = ref(false)
const currentYear = new Date().getFullYear()

const contributions = computed(() => {
  return financeStore.memberContributions(authStore.user?.id) || []
})

const memberAnnualTotal = computed(() => {
  return financeStore.memberAnnualTotal(authStore.user?.id) || 0
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    if (!financeStore.titheRecords.length) {
      await financeStore.fetchContributions()
    }
  } catch (err) {
    error.value = 'Failed to load contribution history'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const downloadGivingStatement = () => {
  snackbar.value = true
  // In a real app, this would hit a PDF generation endpoint
  console.log('Generating annual statement for', authStore.user?.name)
  
  // Create a simple CSV download as a "Statement" fallback
  const headers = ['Date', 'Category', 'Method', 'Amount']
  const rows = contributions.value.map(c => [
    c.date,
    c.category,
    c.method || 'Online',
    c.amount
  ])
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `Giving_Statement_${currentYear}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

.text-x-tiny {
  font-size: 0.55rem;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
  transform: translateY(-1px);
}
</style>
