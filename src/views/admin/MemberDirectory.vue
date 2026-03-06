<template>
  <v-container fluid class="bg-background pa-6">
    <!-- Header Section -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary">
          Member Directory
        </h1>
        <p class="text-subtitle-1 text-grey">
          Manage and organize your congregation groups
        </p>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          to="/admin/register"
          elevation="2"
        >
          Add New Member
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search and Filter Bar -->
    <v-card class="mb-6 rounded-lg" elevation="2">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search by name, email, or phone..."
              variant="outlined"
              hide-details
              clearable
              density="comfortable"
              class="bg-white"
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex ga-2">
            <v-select
              v-model="selectedGroup"
              :items="['All Groups', ...memberStore.groups]"
              label="Filter by Group"
              variant="outlined"
              hide-details
              density="comfortable"
            />

            <v-btn
              icon="mdi-tune-variant"
              variant="tonal"
              color="primary"
              @click="showAdvancedFilters = !showAdvancedFilters"
            />
          </v-col>
        </v-row>

        <!-- Advanced Filters -->
        <v-row v-if="showAdvancedFilters" class="mt-4 animated fadeIn">
          <v-col cols="12">
            <div
              class="text-caption font-weight-bold mb-2 text-uppercase text-grey"
            >
              Quick Status Filter
            </div>

            <v-chip-group
              v-model="statusFilter"
              selected-class="bg-primary text-white"
              mandatory
            >
              <v-chip value="All">All Statuses</v-chip>
              <v-chip value="Active" color="success" variant="outlined">
                Active
              </v-chip>
              <v-chip value="Inactive" color="error" variant="outlined">
                Inactive
              </v-chip>
              <v-chip value="Pending" color="warning" variant="outlined">
                Pending
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="rounded-lg" elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredMembers"
        :search="searchQuery"
        :loading="memberStore.loading"
        hover
        class="elevation-0"
      >
        <template #item.group="{ item }">
          <v-chip size="small" variant="flat" color="info">
            {{ item.group }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            class="text-uppercase font-weight-bold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            variant="text"
            color="grey-darken-1"
            size="small"
            @click="editMember(item)"
          />
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            color="grey-darken-1"
            size="small"
          />
        </template>

        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon size="64" color="grey-lighten-1">
              mdi-account-search-outline
            </v-icon>
            <div class="text-h6 text-grey mt-2">
              No members found matching your criteria
            </div>
            <v-btn color="primary" variant="text" @click="resetFilters">
              Clear all filters
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import { headers } from '@/constants/memberTableHeaders'
import { useMemberFilters } from '@/composables/useMemberFilters'

const memberStore = useMemberStore()

const {
  searchQuery,
  selectedGroup,
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
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeIn {
  animation-name: fadeIn;
}
</style>
