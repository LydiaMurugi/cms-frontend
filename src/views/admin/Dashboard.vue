<template>
  <v-container fluid class="bg-background pa-6">
    <!-- Welcome Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-primary">
          Dashboard Overview
        </h1>
        <p class="text-subtitle-1 text-grey">
          Welcome back, Admin. Here is what's happening today.
        </p>
      </v-col>
    </v-row>

    <!-- KPI Metrics Cards -->
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="2" class="rounded-lg border-s-xl border-primary">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar color="primary-lighten-5" size="56" class="mr-4">
              <v-icon icon="mdi-account-group" color="primary" size="32" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey">Total Congregation</div>
              <div class="text-h4 font-weight-bold">
                {{ memberStore.totalCongregation }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="2" class="rounded-lg border-s-xl border-secondary">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar color="secondary-lighten-5" size="56" class="mr-4">
              <v-icon icon="mdi-chart-line" color="secondary" size="32" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey">Active Projects</div>
              <div class="text-h4 font-weight-bold">
                {{ projectStore.projects.length }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="2" class="rounded-lg border-s-xl border-success">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar color="success-lighten-5" size="56" class="mr-4">
              <v-icon icon="mdi-currency-usd" color="success" size="32" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey">Monthly Tithes</div>
              <div class="text-h4 font-weight-bold">
                $
                {{ financeStore.totalContributions.toLocaleString() }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="2" class="rounded-lg border-s-xl border-warning">
          <v-card-text class="d-flex align-center pa-6">
            <v-avatar color="warning-lighten-5" size="56" class="mr-4">
              <v-icon icon="mdi-calendar-clock" color="warning" size="32" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey">Pending Tasks</div>
              <div class="text-h4 font-weight-bold">
                {{ dutyStore.duties.length }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Grid -->
    <v-row class="mt-4">
      <!-- Growth Trends -->
      <v-col cols="12" lg="8">
        <v-card class="rounded-lg h-100" elevation="2">
          <v-card-title class="d-flex align-center pt-4 px-6">
            <span>Congregation Growth</span>
            <v-spacer />
            <v-btn
              variant="text"
              color="primary"
              density="comfortable"
              icon="mdi-dots-vertical"
            />
          </v-card-title>

          <v-card-text class="pa-6">
            <v-sheet
              color="grey-lighten-4"
              height="300"
              width="100%"
              class="d-flex align-center justify-center rounded-lg border-dashed border-thin"
            >
              <div class="text-center">
                <v-icon
                  icon="mdi-chart-areaspline"
                  size="64"
                  color="grey-lighten-1"
                />
                <div class="text-grey">
                  Chart Visualization Integration Area
                </div>
              </div>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Activities -->
      <v-col cols="12" lg="4">
        <v-card class="rounded-lg h-100" elevation="2">
          <v-card-title class="pt-4 px-6">
            Recent Activities
          </v-card-title>

          <v-divider />

          <v-list lines="two" class="pa-2">
            <v-list-item
              v-for="(activity, i) in recentActivities"
              :key="i"
              :title="activity.title"
              :subtitle="activity.time"
            >
              <template #prepend>
                <v-avatar
                  :color="activity.color"
                  size="32"
                  class="mr-3"
                >
                  <v-icon
                    :icon="activity.icon"
                    size="18"
                    color="white"
                  />
                </v-avatar>
              </template>

              <template #append>
                <v-btn
                  icon="mdi-chevron-right"
                  variant="text"
                  size="small"
                  color="grey"
                />
              </template>
            </v-list-item>
          </v-list>

          <v-card-actions class="pa-4 pt-0">
            <v-btn block variant="tonal" color="primary">
              View All logs
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import { useProjectStore } from '@/stores/projectStore'
import { useFinanceStore } from '@/stores/financeStore'
import { useDutyStore } from '@/stores/dutyStore'
import { useDashboardData } from '@/composables/useDashboardData'

const memberStore = useMemberStore()
const projectStore = useProjectStore()
const financeStore = useFinanceStore()
const dutyStore = useDutyStore()

const { recentActivities } = useDashboardData()

onMounted(() => {
  dutyStore.fetchDuties()
})
</script>

<style scoped>
.border-s-xl {
  border-inline-start-width: 6px !important;
  border-inline-start-style: solid !important;
}
</style>
