<template>
  <div class="financial-reports">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Financial Reports</h1>
        <p class="text-caption text-grey-darken-1">Analyze giving trends and performance</p>
      </div>

      <v-btn-toggle
        v-model="timeframe"
        variant="outlined"
        color="primary"
        density="compact"
        rounded="md"
        mandatory
      >
        <v-btn value="3" size="small">3M</v-btn>
        <v-btn value="6" size="small">6M</v-btn>
        <v-btn value="12" size="small">1Y</v-btn>
      </v-btn-toggle>
    </div>

    <!-- KPI Cards - Flat Design -->
    <v-row dense class="mb-4">
      <v-col
        v-for="kpi in financeStore.analyticsKPIs"
        :key="kpi.title"
        cols="12"
        sm="6"
        md="3"
      >
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white pa-4 mb-2">
          <div class="d-flex justify-space-between align-center mb-2">
            <v-avatar :color="kpi.color + '-lighten-5'" size="32" rounded="md">
              <v-icon :icon="kpi.icon" :color="kpi.color" size="18" />
            </v-avatar>
          </div>
          <div class="text-h6 font-weight-bold text-primary">
            {{ kpi.title.includes('Records') || kpi.title.includes('Contributors') ? kpi.value : '$' + kpi.value.toLocaleString() }}
          </div>
          <div class="text-tiny text-grey-darken-1 font-weight-bold text-uppercase">
            {{ kpi.title }}
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Trend Chart -->
      <v-col cols="12" lg="8">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100" title="Monthly Contribution Trends">
          <div class="pa-4">
            <v-sparkline
              :model-value="chartValues"
              :labels="chartLabels"
              color="primary"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
              auto-draw
            >
              <template #label="label">
                {{ label.value }}
              </template>
            </v-sparkline>
            
            <div class="d-flex justify-space-between mt-4 px-4 text-tiny font-weight-bold text-grey">
              <span v-for="label in chartLabels" :key="label">{{ label }}</span>
            </div>
          </div>
        </BaseCard>
      </v-col>

      <!-- Category Breakdown -->
      <v-col cols="12" lg="4">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100" title="By Category">
          <v-list density="compact" class="pa-0 bg-transparent">
            <template v-for="(cat, i) in financeStore.categoryAnalytics" :key="cat.category">
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-circle" :color="cat.color" size="10" class="mr-2" />
                </template>
                <v-list-item-title class="text-caption font-weight-bold">{{ cat.category }}</v-list-item-title>
                <template #append>
                  <div class="text-right">
                    <div class="text-caption font-weight-bold text-primary">
                      ${{ cat.amount.toLocaleString() }}
                    </div>
                    <div class="text-tiny text-grey">{{ cat.percentage }}%</div>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="i < financeStore.categoryAnalytics.length - 1" class="border-opacity-25" />
            </template>
          </v-list>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Top Contributors -->
    <BaseCard elevation="0" rounded="md" class="border-thin bg-white mt-6 overflow-hidden" title="Top Contributors" no-padding>
      <v-table hover class="bg-transparent custom-table">
        <thead>
          <tr>
            <th class="text-left text-tiny font-weight-bold">Member</th>
            <th class="text-right text-tiny font-weight-bold">Total Contribution</th>
            <th class="text-right text-tiny font-weight-bold">Last Gift Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in financeStore.topContributors" :key="c.memberId">
            <td class="text-caption font-weight-bold">
              <div class="d-flex align-center">
                <v-avatar size="24" color="primary-lighten-5" class="mr-2">
                  <span class="text-tiny text-primary">{{ c.name.charAt(0) }}</span>
                </v-avatar>
                {{ c.name }}
              </div>
            </td>
            <td class="text-right text-caption font-weight-bold text-success">
              ${{ c.total.toLocaleString() }}
            </td>
            <td class="text-right text-tiny text-medium-emphasis">
              {{ formatDate(c.lastDate) }}
            </td>
          </tr>
          <tr v-if="!financeStore.topContributors.length">
            <td colspan="3" class="text-center py-4 text-grey text-caption">No records found</td>
          </tr>
        </tbody>
      </v-table>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'

const financeStore = useFinanceStore()
const timeframe = ref('6')

const chartData = computed(() => {
  return financeStore.monthlyTotals(parseInt(timeframe.value))
})

const chartValues = computed(() => chartData.value.map(d => d.total))
const chartLabels = computed(() => chartData.value.map(d => d.label))

onMounted(() => {
  financeStore.fetchContributions()
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.text-tiny {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.bg-parchment-light {
  background-color: #fdfaf7 !important;
}

:deep(.custom-table) {
  background: transparent !important;
}

:deep(.custom-table thead) {
  background-color: #fcfaf7 !important;
}

:deep(.custom-table thead th) {
  text-transform: uppercase;
  color: #795548 !important;
  height: 40px !important;
}
</style>
