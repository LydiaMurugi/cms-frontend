<template>
  <div class="dashboard-wrapper">
    <SuperAdminDashboard v-if="isSuperAdmin" />
    <div v-else class="church-dashboard">
      <!-- Welcome Header -->
      <div class="mb-6 px-2">
        <h1 class="text-h5 font-weight-bold text-primary mb-1">
          {{ authStore.user?.tenantName || 'Church Dashboard' }}
        </h1>
        <p class="text-caption text-grey-darken-1">Welcome back, {{ authStore.user?.name }}. Here is your church overview.</p>
      </div>

      <!-- Quick Actions Buttons -->
      <div class="mb-8 px-2">
        <div class="text-tiny font-weight-bold mb-3 text-grey-darken-1 text-uppercase">
          Quick Actions
        </div>
        <div class="d-flex flex-wrap ga-2">
          <BaseButton 
            variant="text" 
            color="primary" 
            size="small"
            prepend-icon="mdi-account-plus" 
            @click="router.push('/admin/register')"
          >
            Register Member
          </BaseButton>

          <BaseButton 
            variant="text" 
            color="warning" 
            size="small"
            prepend-icon="mdi-clipboard-check" 
            @click="router.push('/admin/tasks')"
          >
            Assign Duty
          </BaseButton>

          <BaseButton 
            variant="text" 
            color="secondary" 
            size="small"
            prepend-icon="mdi-cloud-upload" 
            @click="router.push('/admin/resources')"
          >
            Upload Resource
          </BaseButton>

          <BaseButton 
            variant="text" 
            color="info" 
            size="small"
            prepend-icon="mdi-chat-processing" 
            @click="router.push('/admin/communication')"
          >
            Send Message
          </BaseButton>
        </div>
      </div>

      <!-- KPI Metrics Cards - Flat Design -->
      <v-row dense>
        <v-col v-if="hasPermission('manage_members')" cols="12" sm="6" lg="3">
          <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
            <div class="d-flex align-center pa-4">
              <v-avatar color="primary-lighten-5" size="48" rounded="md" class="mr-3">
                <v-icon icon="mdi-account-group" color="primary" size="24" />
              </v-avatar>
              <div>
                <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Congregation</div>
                <div class="text-h5 font-weight-bold text-primary">
                  {{ memberStore.totalCongregation }}
                </div>
              </div>
            </div>
          </BaseCard>
        </v-col>

        <v-col v-if="hasPermission('manage_projects')" cols="12" sm="6" lg="3">
          <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
            <div class="d-flex align-center pa-4">
              <v-avatar color="secondary-lighten-5" size="48" rounded="md" class="mr-3">
                <v-icon icon="mdi-chart-line" color="secondary" size="24" />
              </v-avatar>
              <div>
                <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Active Projects</div>
                <div class="text-h5 font-weight-bold text-secondary">
                  {{ projectStore.projects.length }}
                </div>
              </div>
            </div>
          </BaseCard>
        </v-col>

        <v-col v-if="hasPermission('manage_finances')" cols="12" sm="6" lg="3">
          <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
            <div class="d-flex align-center pa-4">
              <v-avatar color="success-lighten-5" size="48" rounded="md" class="mr-3">
                <v-icon icon="mdi-currency-usd" color="success" size="24" />
              </v-avatar>
              <div>
                <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Monthly Tithes</div>
                <div class="text-h5 font-weight-bold text-success">
                  ${{ financeStore.totalContributions.toLocaleString() }}
                </div>
              </div>
            </div>
          </BaseCard>
        </v-col>

        <v-col v-if="hasPermission('manage_tasks')" cols="12" sm="6" lg="3">
          <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
            <div class="d-flex align-center pa-4">
              <v-avatar color="warning-lighten-5" size="48" rounded="md" class="mr-3">
                <v-icon icon="mdi-calendar-clock" color="warning" size="24" />
              </v-avatar>
              <div>
                <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Pending Tasks</div>
                <div class="text-h5 font-weight-bold text-warning">
                  {{ dutyStore.duties.length }}
                </div>
              </div>
            </div>
          </BaseCard>
        </v-col>
      </v-row>

      <!-- Main Content Grid -->
      <v-row class="mt-4">
        <!-- Growth Trends -->
        <v-col cols="12" lg="8">
          <BaseCard class="h-100 border-thin bg-white" title="Congregation Growth" elevation="0" rounded="md">
            <v-sheet
              color="grey-lighten-5"
              height="320"
              width="100%"
              class="d-flex align-center justify-center rounded-md border-dashed border-thin mt-2"
            >
              <div class="text-center">
                <v-icon
                  icon="mdi-chart-areaspline"
                  size="48"
                  color="grey-lighten-2"
                  class="mb-2"
                />
                <div class="text-caption text-grey">
                  Growth visualization will appear here
                </div>
              </div>
            </v-sheet>
          </BaseCard>
        </v-col>

        <!-- Recent Activities -->
        <v-col cols="12" lg="4">
          <BaseCard class="h-100 border-thin bg-white" title="Recent Activities" elevation="0" rounded="md" no-padding>
            <v-list density="compact" class="pa-0 bg-transparent">
              <template v-for="(activity, i) in recentActivities" :key="i">
                <v-list-item class="py-3 px-4">
                  <template #prepend>
                    <v-avatar
                      :color="activity.color + '-lighten-5'"
                      size="36"
                      rounded="md"
                      class="mr-3 border-thin"
                    >
                      <v-icon
                        :icon="activity.icon"
                        size="18"
                        :color="activity.color"
                      />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-subtitle-2 font-weight-bold">{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-tiny">{{ activity.time }}</v-list-item-subtitle>

                  <template #append>
                    <v-icon icon="mdi-chevron-right" size="16" color="grey-lighten-1" />
                  </template>
                </v-list-item>
                <v-divider v-if="i < recentActivities.length - 1" class="border-opacity-25 mx-4" />
              </template>
            </v-list>

            <template #actions>
              <BaseButton block variant="text" size="small" color="primary">
                View Activity Log
              </BaseButton>
            </template>
          </BaseCard>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/memberStore'
import { useProjectStore } from '@/stores/projectStore'
import { useFinanceStore } from '@/stores/financeStore'
import { useDutyStore } from '@/stores/dutyStore'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardData } from '@/composables/useDashboardData'
import { usePermissions } from '@/composables/usePermissions'
import SuperAdminDashboard from './SuperAdminDashboard.vue'

const memberStore = useMemberStore()
const projectStore = useProjectStore()
const financeStore = useFinanceStore()
const dutyStore = useDutyStore()
const authStore = useAuthStore()
const router = useRouter()
const { hasPermission, isSuperAdmin } = usePermissions()

const { recentActivities } = useDashboardData()

onMounted(() => {
  if (!isSuperAdmin.value) {
    if (hasPermission('manage_tasks')) {
      dutyStore.fetchDuties()
    }
  }
})
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.line-height-1 {
  line-height: 1;
}

.text-tiny {
  font-size: 0.7rem;
}

.bg-grey-lighten-5 {
  background-color: #fcfaf7 !important; /* Slightly parchment tinted grey */
}
</style>
