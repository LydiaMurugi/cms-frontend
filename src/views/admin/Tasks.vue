<template>
  <v-container fluid class="bg-background pa-6">
    <!-- Header Section -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary">Duty Allocations</h1>
        <p class="text-subtitle-1 text-grey">
          Assign responsibilities and track leadership reports
        </p>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus"
          size="large"
          @click="showAssignDialog = true"
        >
          Assign New Duty
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6 rounded-lg" elevation="2">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search duties or leaders..."
              variant="outlined"
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-chip-group v-model="statusFilter" mandatory>
              <v-chip value="All">All</v-chip>
              <v-chip value="Pending" color="warning">Pending</v-chip>
              <v-chip value="Submitted" color="success">Submitted</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Duties -->
    <v-row>
      <v-col
        v-for="duty in filteredDuties"
        :key="duty.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          elevation="2"
          class="rounded-lg h-100 border-t-lg"
          :style="{ borderTopColor: getStatusColor(duty.status) }"
        >
          <v-card-item>
            <v-card-title>{{ duty.title }}</v-card-title>
            <v-card-subtitle>
              Due: {{ duty.date }}
            </v-card-subtitle>
          </v-card-item>

          <v-divider />

          <v-card-text>
            <div class="text-overline text-grey mb-1">
              Assigned Leader
            </div>

            <v-list-item class="px-0">
              <v-list-item-title class="font-weight-bold">
                {{ duty.assigned_name || 'Unassigned' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ duty.category || 'No category' }}
              </v-list-item-subtitle>
            </v-list-item>

            <div class="mt-4 d-flex align-center justify-space-between">
              <v-chip
                :color="getStatusColor(duty.status)"
                size="small"
              >
                {{ duty.status }}
              </v-chip>

              <v-btn
                v-if="duty.status === 'Pending'"
                size="small"
                color="primary"
                variant="tonal"
                @click="openSubmitReport(duty)"
              >
                Submit Report
              </v-btn>

              <v-btn
                v-if="duty.status === 'Submitted'"
                size="small"
                variant="text"
                @click="viewReport(duty)"
              >
                View Report
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assign Duty Dialog -->
    <v-dialog v-model="showAssignDialog" max-width="500">
      <v-card class="pa-4 rounded-xl">
        <v-card-title>Assign New Duty</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newDuty.title"
            label="Duty Title"
            variant="outlined"
          />

          <v-autocomplete
            v-model="newDuty.assigned_id"
            :items="memberStore.members"
            item-title="name"
            item-value="id"
            label="Select Leader"
            variant="outlined"
          />

          <v-text-field
            v-model="newDuty.date"
            label="Due Date"
            type="date"
            variant="outlined"
          />

          <v-text-field
            v-model="newDuty.category"
            label="Category"
            variant="outlined"
          />

          <v-textarea
            v-model="newDuty.notes"
            label="Instructions"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showAssignDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="assignDuty">
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Submit Report Dialog -->
    <v-dialog v-model="showReportDialog" max-width="500">
      <v-card class="pa-4 rounded-xl">
        <v-card-title>Submit Duty Report</v-card-title>

        <v-card-text>
          <v-textarea
            v-model="reportNotes"
            label="Report Notes"
            rows="4"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showReportDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" @click="submitReport">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Report -->
    <v-dialog v-model="showViewDialog" max-width="500">
      <v-card class="pa-4 rounded-xl">
        <v-card-title>Duty Report</v-card-title>

        <v-card-text>
          {{ selectedDuty?.notes }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="showViewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
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

    newDuty.value = {
      title: '',
      assigned_id: null,
      date: '',
      category: '',
      notes: '',
    }
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
.border-t-lg {
  border-top-width: 6px !important;
  border-top-style: solid !important;
}
</style>