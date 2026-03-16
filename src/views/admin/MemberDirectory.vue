<template>
  <div class="member-directory">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Member Directory</h1>
        <p class="text-caption text-grey-darken-1">Manage and organize your congregation groups</p>
      </div>
      <BaseButton
        v-if="hasPermission('manage_members')"
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        to="/admin/register"
        rounded="md"
      >
        Add Member
      </BaseButton>
    </div>

    <!-- Search and Filter Bar - Flat -->
    <BaseCard class="mb-6 border-thin bg-white" elevation="0" rounded="md">
      <div class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" md="8">
            <BaseInput
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search by name, email, or phone..."
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex gap-2">
            <v-select
              v-model="selectedGroup"
              :items="['All Groups', ...memberStore.groups]"
              placeholder="Filter by Group"
              variant="outlined"
              hide-details
              density="comfortable"
              rounded="md"
              color="primary"
            />

            <BaseButton
              icon="mdi-tune-variant"
              variant="tonal"
              color="primary"
              size="small"
              rounded="md"
              @click="showAdvancedFilters = !showAdvancedFilters"
            />
          </v-col>
        </v-row>

        <!-- Advanced Filters -->
        <v-expand-transition>
          <div v-if="showAdvancedFilters" class="mt-4 pt-4 border-t">
            <div class="text-tiny font-weight-bold mb-2 text-uppercase text-grey-darken-1">
              Quick Status Filter
            </div>

            <v-chip-group
              v-model="statusFilter"
              selected-class="bg-primary text-white"
              mandatory
            >
              <v-chip value="All" size="small" variant="outlined" filter>All Statuses</v-chip>
              <v-chip value="Active" size="small" color="success" variant="tonal" filter>Active</v-chip>
              <v-chip value="Inactive" size="small" color="error" variant="tonal" filter>Inactive</v-chip>
              <v-chip value="Pending" size="small" color="warning" variant="tonal" filter>Pending</v-chip>
            </v-chip-group>
          </div>
        </v-expand-transition>
      </div>
    </BaseCard>

    <!-- Data Table Card - Flat -->
    <BaseCard class="border-thin bg-white overflow-hidden" elevation="0" rounded="md" no-padding>
      <v-data-table
        :headers="headers"
        :items="filteredMembers"
        :search="searchQuery"
        :loading="memberStore.loading"
        hover
        class="bg-transparent custom-table"
      >
        <template #item.group="{ item }">
          <v-chip size="x-small" variant="tonal" color="secondary" rounded="md">
            {{ item.group }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
            rounded="md"
            class="text-uppercase font-weight-bold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div v-if="hasPermission('manage_members')" class="d-flex gap-1">
            <BaseButton
              icon="mdi-pencil-outline"
              variant="text"
              color="primary"
              size="x-small"
              @click="editMember(item)"
            />
            <BaseButton
              icon="mdi-dots-vertical"
              variant="text"
              color="grey"
              size="x-small"
            />
          </div>
          <div v-else class="text-caption text-grey italic">View only</div>
        </template>

        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon size="48" color="grey-lighten-2" class="mb-3">
              mdi-account-search-outline
            </v-icon>
            <div class="text-subtitle-2 text-grey mb-4">
              No members found matching your criteria
            </div>
            <BaseButton color="primary" variant="text" size="small" @click="resetFilters">
              Clear all filters
            </BaseButton>
          </div>
        </template>
      </v-data-table>
    </BaseCard>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import { headers } from '@/constants/memberTableHeaders'
import { useMemberFilters } from '@/composables/useMemberFilters'
import { usePermissions } from '@/composables/usePermissions'

const memberStore = useMemberStore()
const { hasPermission } = usePermissions()

const {
  searchQuery,
...
  statusFilter,
  showAdvancedFilters,
  filteredMembers,
  resetFilters,
  getStatusColor,
  editMember,
} = useMemberFilters(memberStore)

onMounted(() => {
  memberStore.fetchMembers()
})
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-t {
  border-top: 1px solid rgba(121, 85, 72, 0.05) !important;
}

.text-tiny {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }

:deep(.custom-table .v-data-table-header) {
  background-color: #fcfaf7;
}

:deep(.custom-table .v-data-table-header th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.7rem !important;
  color: #795548 !important;
}
</style>
