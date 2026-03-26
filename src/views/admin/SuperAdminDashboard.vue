<template>
  <div class="super-admin-dashboard">
    <!-- Welcome Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Platform Control Center</h1>
      <p class="text-caption text-grey-darken-1">Global overview of all church tenants and system health.</p>
    </div>

    <!-- Platform Metrics -->
    <v-row dense>
      <v-col cols="12" sm="6" lg="3">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
          <div class="d-flex align-center pa-4">
            <v-avatar color="primary-lighten-5" size="48" rounded="md" class="mr-3">
              <v-icon icon="mdi-office-building" color="primary" size="24" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Total Churches</div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ churchStore.churches.length }}
              </div>
            </div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
          <div class="d-flex align-center pa-4">
            <v-avatar color="secondary-lighten-5" size="48" rounded="md" class="mr-3">
              <v-icon icon="mdi-account-multiple" color="secondary" size="24" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Total Members</div>
              <div class="text-h5 font-weight-bold text-secondary">
                {{ totalGlobalMembers }}
              </div>
            </div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
          <div class="d-flex align-center pa-4">
            <v-avatar color="success-lighten-5" size="48" rounded="md" class="mr-3">
              <v-icon icon="mdi-check-decagram" color="success" size="24" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey-darken-1 line-height-1 mb-1">Active Tenants</div>
              <div class="text-h5 font-weight-bold text-success">
                {{ activeTenantsCount }}
              </div>
            </div>
          </div>
        </BaseCard>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white mb-2" no-padding>
          <div class="d-flex align-center pa-4">
            <v-avatar color="warning-lighten-5" size="48" rounded="md" class="mr-3">
              <v-icon icon="mdi-shield-check" color="warning" size="24" />
            </v-avatar>
            <div>
              <div class="text-overline text-grey-darken-1 line-height-1 mb-1">System Status</div>
              <div class="text-h6 font-weight-bold text-warning">
                Healthy
              </div>
            </div>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Recent Registrations -->
    <v-row class="mt-4">
      <v-col cols="12">
        <BaseCard class="border-thin bg-white" title="Recent Church Registrations" elevation="0" rounded="md" no-padding>
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-primary">Church Name</th>
                <th class="text-left font-weight-bold text-primary">Location</th>
                <th class="text-left font-weight-bold text-primary">Admin</th>
                <th class="text-left font-weight-bold text-primary">Status</th>
                <th class="text-right font-weight-bold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="church in churchStore.churches.slice(0, 5)" :key="church.id">
                <td class="font-weight-bold">{{ church.name || church.churchName }}</td>
                <td>{{ church.location }}</td>
                <td>{{ church.admin_email || church.adminEmail || 'N/A' }}</td>
                <td>
                  <v-chip 
                    size="x-small" 
                    :color="getStatusColor(church.status)" 
                    variant="tonal" 
                    rounded="md"
                  >
                    {{ church.status || 'Active' }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn icon="mdi-eye-outline" variant="text" size="small" color="primary" @click="router.push('/admin/churches')" />
                </td>
              </tr>
            </tbody>
          </v-table>
          <template #actions>
            <BaseButton block variant="text" size="small" color="primary" to="/admin/churches">
              View All Churches
            </BaseButton>
          </template>
        </BaseCard>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import { useRouter } from 'vue-router'

const churchStore = useChurchStore()
const router = useRouter()

// Re-fetch data every time the component is mounted to ensure status updates reflect
onMounted(async () => {
  await churchStore.fetchChurches()
})

const totalGlobalMembers = computed(() => {
  return churchStore.churches.reduce((acc, c) => acc + (parseInt(c.member_count || c.memberCount) || 0), 0)
})

const activeTenantsCount = computed(() => {
  return churchStore.churches.filter(c => (c.status || 'Active') === 'Active').length
})

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || 'active'
  if (s === 'active') return 'success'
  if (s === 'suspended') return 'error'
  return 'grey'
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
.line-height-1 {
  line-height: 1;
}
</style>
