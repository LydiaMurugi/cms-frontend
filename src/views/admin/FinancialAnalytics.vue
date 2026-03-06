<template>
  <v-container fluid class="bg-background pa-6">

    <!-- Header -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary">
          Financial Analytics
        </h1>
        <p class="text-subtitle-1 text-grey">
          Analyze giving trends and performance
        </p>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-btn-toggle
          v-model="timeframe"
          variant="outlined"
          color="primary"
          mandatory
        >
          <v-btn value="3m">3 Months</v-btn>
          <v-btn value="6m">6 Months</v-btn>
          <v-btn value="1y">1 Year</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- KPI Cards -->
    <v-row class="mb-6">
      <v-col
        v-for="kpi in financeStore.analyticsKPIs"
        :key="kpi.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-2">
              <v-icon :icon="kpi.icon" :color="kpi.color" />
            </div>
            <div class="text-h5 font-weight-bold">
              ${{ kpi.value.toLocaleString() }}
            </div>
            <div class="text-caption text-grey">
              {{ kpi.title }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart Placeholder -->
    <v-card class="mb-6">
      <v-card-title class="font-weight-bold text-primary">
        Monthly Contribution Trends
      </v-card-title>
      <v-card-text>
        <v-sheet
          height="300"
          class="d-flex align-center justify-center bg-grey-lighten-4 rounded-lg"
        >
          <div class="text-center text-grey">
            <v-icon icon="mdi-chart-line" size="56" />
            <div class="text-caption">
              Chart will use financeStore.monthlyTotals
            </div>
          </div>
        </v-sheet>
      </v-card-text>
    </v-card>
<!-- Category Breakdown -->
<v-card class="mb-6">
  <v-card-title class="font-weight-bold text-primary">
    Contributions by Category
  </v-card-title>

  <v-card-text>
    <v-list dense>
      <v-list-item
        v-for="cat in financeStore.categoryAnalytics"
        :key="cat.category"
      >
        <template #prepend>
          <v-icon icon="mdi-circle" :color="cat.color" size="10" />
        </template>

        <v-list-item-title>
          {{ cat.category }}
        </v-list-item-title>

        <template #append>
          <span class="font-weight-bold">
            ${{ cat.amount.toLocaleString() }}
          </span>
        </template>
      </v-list-item>
    </v-list>
  </v-card-text>
</v-card>
    <!-- Top Contributors -->
    <v-card>
      <v-card-title class="font-weight-bold text-primary">
        Top Contributors
      </v-card-title>
      <v-table hover>
        <thead>
          <tr>
            <th>Member</th>
            <th class="text-right">Total</th>
            <th class="text-right">Last Contribution</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in financeStore.topContributors" :key="c.name">
            <td>{{ c.name }}</td>
            <td class="text-right font-weight-bold text-success">
              ${{ c.total.toLocaleString() }}
            </td>
            <td class="text-right text-caption">
              {{ c.lastDate }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

  </v-container>
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
