<template>
  <div class="tasks-view">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Duty Allocations</h1>
        <p class="text-caption text-grey-darken-1">Assign responsibilities and track leadership reports</p>
      </div>
      <BaseButton
        color="primary"
        prepend-icon="mdi-account-plus"
        size="small"
        rounded="md"
        @click="showAssignDialog = true"
      >
        Assign Duty
      </BaseButton>
    </div>

    <!-- Filters - Flat -->
    <BaseCard class="mb-6 border-thin bg-white" elevation="0" rounded="md">
      <div class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" md="6">
            <BaseInput
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search duties or leaders..."
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-chip-group v-model="statusFilter" mandatory class="justify-md-end">
              <v-chip value="All" size="small" variant="outlined" filter>All</v-chip>
              <v-chip value="Pending" size="small" color="warning" variant="tonal" filter>Pending</v-chip>
              <v-chip value="Submitted" size="small" color="success" variant="tonal" filter>Submitted</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </div>
    </BaseCard>

    <!-- Duties Grid -->
    <v-row dense>
      <v-col
        v-for="duty in filteredDuties"
        :key="duty.id"
        cols="12"
        md="6"
        lg="4"
      >
        <BaseCard
          elevation="0"
          rounded="md"
          class="border-thin bg-white h-100 no-padding"
        >
          <div class="pa-4 border-t-priority" :style="{ borderTopColor: getStatusColor(duty.status) }">
            <div class="d-flex justify-space-between align-start mb-2">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-primary">{{ duty.title }}</h3>
                <p class="text-tiny text-medium-emphasis uppercase-none">Due: {{ duty.date }}</p>
              </div>
              <v-chip
                :color="getStatusColor(duty.status)"
                size="x-small"
                variant="flat"
                rounded="md"
                class="text-tiny font-weight-bold"
              >
                {{ duty.status }}
              </v-chip>
            </div>

            <v-divider class="my-3 border-opacity-25" />

            <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-2">
              Assigned Leader
            </div>

            <div class="d-flex align-center">
              <v-avatar color="primary-lighten-5" size="32" rounded="md" class="mr-3 border-thin">
                <span class="text-tiny text-primary font-weight-bold">{{ (duty.assigned_name || '?').charAt(0) }}</span>
              </v-avatar>
              <div>
                <p class="text-caption font-weight-bold mb-0">{{ duty.assigned_name || 'Unassigned' }}</p>
                <p class="text-tiny text-medium-emphasis mb-0">{{ duty.category || 'General' }}</p>
              </div>
            </div>

            <div class="mt-6 d-flex justify-end gap-2">
              <BaseButton
                v-if="duty.status === 'Pending'"
                size="x-small"
                color="primary"
                variant="tonal"
                rounded="md"
                @click="openSubmitReport(duty)"
              >
                Submit Report
              </BaseButton>

              <BaseButton
                v-if="duty.status === 'Submitted'"
                size="x-small"
                variant="text"
                color="primary"
                rounded="md"
                @click="viewReport(duty)"
              >
                View Report
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <BaseModal v-model="showAssignDialog" title="Assign New Duty" max-width="500">
      <div class="pa-2">
        <BaseInput v-model="newDuty.title" label="Duty Title" class="mb-2" />
        <v-autocomplete
          v-model="newDuty.assigned_id"
          :items="memberStore.members"
          item-title="name"
          item-value="id"
          label="Select Leader"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mb-2"
        />
        <BaseInput v-model="newDuty.date" label="Due Date" type="date" class="mb-2" />
        <BaseInput v-model="newDuty.category" label="Category" class="mb-2" />
        <v-textarea
          v-model="newDuty.notes"
          label="Instructions"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          rows="3"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showAssignDialog = false">Cancel</BaseButton>
        <BaseButton @click="assignDuty">Assign Duty</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showReportDialog" title="Submit Duty Report" max-width="500">
      <div class="pa-2">
        <v-textarea
          v-model="reportNotes"
          label="Report Notes"
          rows="4"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showReportDialog = false">Cancel</BaseButton>
        <BaseButton color="success" @click="submitReport">Submit</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showViewDialog" title="Duty Report" max-width="500">
      <div class="pa-2 text-body-2 text-medium-emphasis">
        {{ selectedDuty?.notes }}
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showViewDialog = false">Close</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDutyStore } from '@/stores/dutyStore'
import { useMemberStore } from '@/stores/memberStore'
import api from '@/plugins/axios'

const dutyStore = useDutyStore()
const memberStore = useMemberStore()

const search = ref('')
const statusFilter = ref('All')

const showAssignDialog = ref(false)
const showReportDialog = ref(false)
const showViewDialog = ref(false)

const selectedDuty = ref(null)
const reportNotes = ref('')

const newDuty = ref({
  title: '',
  assigned_id: null,
  date: '',
  category: '',
  notes: '',
})

onMounted(async () => {
  await dutyStore.fetchDuties()
})

const filteredDuties = computed(() => {
  return dutyStore.duties.filter(duty => {
    const matchesSearch =
      duty.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      duty.assigned_name?.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus =
      statusFilter.value === 'All' ||
      duty.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status) => {
  if (status === 'Submitted') return 'success'
  return 'warning'
}

const assignDuty = async () => {
  try {
    await api.post('/duties', newDuty.value)
    await dutyStore.fetchDuties()
    showAssignDialog.value = false
    newDuty.value = { title: '', assigned_id: null, date: '', category: '', notes: '' }
  } catch (err) {
    console.error(err)
  }
}

const openSubmitReport = (duty) => {
  selectedDuty.value = duty
  reportNotes.value = duty.notes || ''
  showReportDialog.value = true
}

const submitReport = async () => {
  try {
    await api.put(`/duties/${selectedDuty.value.id}/submit`, {
      notes: reportNotes.value,
    })
    await dutyStore.fetchDuties()
    showReportDialog.value = false
  } catch (err) {
    console.error(err)
  }
}

const viewReport = (duty) => {
  selectedDuty.value = duty
  showViewDialog.value = true
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-t-priority {
  border-top-width: 4px !important;
  border-top-style: solid !important;
}

.text-tiny {
  font-size: 0.65rem;
}

.uppercase-none {
  text-transform: none !important;
}

.gap-2 { gap: 8px; }
</style>
