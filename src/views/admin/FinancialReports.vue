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
        <v-btn value="3m" size="small">3M</v-btn>
        <v-btn value="6m" size="small">6M</v-btn>
        <v-btn value="1y" size="small">1Y</v-btn>
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
            ${{ kpi.value.toLocaleString() }}
          </div>
          <div class="text-tiny text-grey-darken-1 font-weight-bold text-uppercase">
            {{ kpi.title }}
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Chart Placeholder -->
      <v-col cols="12" lg="8">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100" title="Monthly Contribution Trends">
          <v-sheet
            height="300"
            class="d-flex align-center justify-center bg-parchment-light rounded-md border-dashed border-thin mt-2"
          >
            <div class="text-center text-grey">
              <v-icon icon="mdi-chart-line" size="48" color="grey-lighten-2" class="mb-2" />
              <div class="text-caption">Visualization data from financeStore.monthlyTotals</div>
            </div>
          </v-sheet>
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
                  <span class="text-caption font-weight-bold text-primary">
                    ${{ cat.amount.toLocaleString() }}
                  </span>
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
            <th class="text-right text-tiny font-weight-bold">Total</th>
            <th class="text-right text-tiny font-weight-bold">Last Gift</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in financeStore.topContributors" :key="c.name">
            <td class="text-caption font-weight-bold">{{ c.name }}</td>
            <td class="text-right text-caption font-weight-bold text-success">
              ${{ c.total.toLocaleString() }}
            </td>
            <td class="text-right text-tiny text-medium-emphasis">
              {{ c.lastDate }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'

const financeStore = useFinanceStore()
const timeframe = ref('6m')

onMounted(() => {
  financeStore.fetchContributions()
})
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

:deep(.custom-table .v-data-table-header) {
  background-color: #fcfaf7;
}

:deep(.custom-table thead th) {
  text-transform: uppercase;
  color: #795548 !important;
}
</style>
