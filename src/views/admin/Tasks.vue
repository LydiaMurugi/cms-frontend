<template>
  <div class="tasks-kanban-view">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Duty Board</h1>
        <p class="text-caption text-grey-darken-1">Manage workflows with drag-and-drop actions</p>
      </div>
      <div class="d-flex gap-2">
        <BaseInput
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search..."
          hide-details
          clearable
          density="compact"
          class="mr-2"
          style="width: 240px"
        />
        <BaseButton
          v-if="isAdmin"
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          rounded="md"
          @click="openAssignDialog"
        >
          Assign Duty
        </BaseButton>
      </div>
    </div>

    <!-- Kanban Columns Container -->
    <div class="kanban-wrapper overflow-x-auto pb-6">
      <div class="d-flex ga-4 align-start" style="min-width: 1000px; min-height: 500px">
        
        <!-- Generic Column Template -->
        <div 
          v-for="col in columns" 
          :key="col.status"
          class="kanban-column d-flex flex-column rounded-md"
          @dragover.prevent
          @drop="onDrop($event, col.status)"
        >
          <!-- Column Header -->
          <div class="d-flex align-center justify-space-between mb-3 px-2">
            <div class="d-flex align-center">
              <v-icon :icon="col.icon" size="18" :color="col.color" class="mr-2" />
              <span class="text-subtitle-2 font-weight-bold text-uppercase text-grey-darken-3">
                {{ col.title }}
              </span>
              <v-chip size="x-small" :color="col.color" variant="tonal" class="ml-2 font-weight-bold">
                {{ col.tasks.length }}
              </v-chip>
            </div>
          </div>

          <!-- Column Content (Dynamic Height) -->
          <div class="column-content pa-2 bg-grey-lighten-4 rounded-md border-thin border-dashed">
            
            <div v-if="dutyStore.loading && !dutyStore.duties.length" class="text-center py-8">
              <v-progress-circular indeterminate size="24" color="primary" />
            </div>

            <!-- Task Cards -->
            <div 
              v-for="duty in col.tasks" 
              :key="duty.id"
              class="task-item mb-3"
              :draggable="duty.status !== 'Submitted'"
              @dragstart="onDragStart($event, duty)"
            >
              <BaseCard
                elevation="0"
                rounded="md"
                class="border-thin bg-white hover-shadow transition-all pa-3"
                :class="{ 'cursor-move': duty.status !== 'Submitted' }"
                no-padding
              >
                <div class="d-flex justify-space-between align-start mb-2">
                  <div class="text-caption font-weight-bold text-primary line-clamp-2 pr-4">
                    {{ duty.title }}
                  </div>
                  <v-menu v-if="isAdmin" location="bottom end">
                    <template #activator="{ props }">
                      <v-btn icon="mdi-dots-vertical" variant="text" size="x-small" color="grey" v-bind="props" class="mt-n1 mr-n1" />
                    </template>
                    <v-list density="compact" class="pa-1 rounded-md border-thin">
                      <v-list-item v-if="duty.status !== 'Submitted'" prepend-icon="mdi-pencil-outline" title="Edit" @click="openEditDialog(duty)" />
                      <v-list-item prepend-icon="mdi-delete-outline" title="Delete" class="text-error" @click="confirmDelete(duty)" />
                    </v-list>
                  </v-menu>
                </div>

                <div class="d-flex align-center mb-3">
                  <v-icon icon="mdi-clock-outline" size="12" color="grey" class="mr-1" />
                  <span class="text-tiny text-grey">{{ formatDate(duty.date) }}</span>
                  <v-spacer />
                  <v-chip size="x-small" variant="flat" color="primary-lighten-5" class="text-primary text-tiny font-weight-bold" rounded="sm">
                    {{ duty.category || 'General' }}
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-space-between mt-auto">
                  <div class="d-flex align-center">
                    <v-avatar color="primary-lighten-5" size="24" rounded="sm" class="mr-2">
                      <span class="text-tiny text-primary font-weight-bold">{{ (duty.assigned_name || '?').charAt(0) }}</span>
                    </v-avatar>
                    <div class="d-flex flex-column">
                      <span class="text-tiny font-weight-bold text-truncate text-grey-darken-2" style="max-width: 120px">
                        {{ duty.assigned_name || 'Unassigned' }}
                      </span>
                      <!-- Trello-style Badges -->
                      <div class="d-flex align-center mt-1">
                        <v-tooltip text="View/Edit Details" location="bottom">
                          <template #activator="{ props }">
                            <v-icon 
                              v-bind="props"
                              icon="mdi-eye-outline" 
                              size="16" 
                              :color="duty.notes ? 'primary' : 'grey-lighten-1'" 
                              class="cursor-pointer"
                              @click.stop="openNotesDialog(duty)"
                            />
                          </template>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                  
                  <BaseButton 
                    v-if="duty.status !== 'Submitted' && (col.status === 'In Progress' || col.status === 'Submitted')"
                    size="x-small" 
                    variant="tonal" 
                    color="success"
                    rounded="sm"
                    @click="openSubmitReport(duty)"
                  >
                    Report
                  </BaseButton>
                  <v-icon v-if="duty.status === 'Submitted'" icon="mdi-check-decagram" color="success" size="18" />
                </div>
              </BaseCard>
            </div>

            <!-- Empty Column State -->
            <div v-if="!col.tasks.length && !dutyStore.loading" class="d-flex flex-column align-center justify-center py-12 opacity-30">
              <v-icon :icon="col.icon" size="32" />
              <span class="text-tiny mt-1 font-weight-bold">Drop Here</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Dialogs -->
    <BaseModal v-model="showFormDialog" :title="isEditing ? 'Edit Task' : 'New Task'" max-width="500">
      <v-form ref="dutyForm" v-model="isFormValid" class="pa-2">
        <BaseInput v-model="formPayload.title" label="Title" :rules="[rules.required]" />
        <v-autocomplete
          v-model="formPayload.assigned_id"
          :items="memberStore.members"
          item-title="name"
          item-value="id"
          label="Assign Member"
          variant="outlined"
          density="comfortable"
          rounded="md"
          clearable
          class="mb-2"
        />
        <BaseInput v-model="formPayload.date" label="Due Date" type="date" :rules="[rules.required]" />
        <v-select 
          v-model="formPayload.category"
          :items="['Service', 'Maintenance', 'Admin', 'Teaching', 'Outreach', 'Other']"
          label="Category"
          variant="outlined"
          density="comfortable"
          rounded="md"
        />
      </v-form>
      <template #actions>
        <BaseButton variant="text" @click="showFormDialog = false">Cancel</BaseButton>
        <BaseButton color="primary" @click="handleSaveDuty" :loading="dutyStore.loading" :disabled="!isFormValid">
          {{ isEditing ? 'Save Changes' : 'Assign' }}
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showReportDialog" title="Complete Task" max-width="500">
      <div class="pa-2">
        <div class="mb-4">
          <div class="text-caption font-weight-bold text-primary mb-1">Task</div>
          <div class="text-body-2">{{ selectedDuty?.title }}</div>
        </div>
        <v-textarea v-model="reportNotes" label="Completion Details" placeholder="Summary of work done..." variant="outlined" density="comfortable" rounded="md" rows="4" autofocus />
      </div>
      <template #actions>
        <BaseButton variant="text" @click="showReportDialog = false">Cancel</BaseButton>
        <BaseButton color="success" @click="handleSubmitReport" :loading="dutyStore.loading">Submit & Close</BaseButton>
      </template>
    </BaseModal>

    <!-- UI Feedback -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" rounded="md" elevation="0">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Task Details & Comments Modal -->
    <BaseModal v-model="showNotesDialog" :title="'Details & Comments: ' + selectedDuty?.title" max-width="600">
      <div class="pa-2">
        <!-- Task Description/Instructions (Static) -->
        <div class="mb-6">
          <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-2">Instructions</div>
          <div class="pa-3 bg-grey-lighten-5 rounded-md border-thin text-body-2 text-medium-emphasis">
            {{ selectedDuty?.notes || 'No specific instructions provided.' }}
          </div>
        </div>

        <v-divider class="mb-6 border-opacity-25" />

        <!-- Comments List -->
        <div class="mb-6">
          <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-3">Activity Feed</div>
          
          <div v-if="!selectedDuty?.comments?.length" class="text-center py-6 opacity-50">
            <v-icon icon="mdi-message-outline" size="24" class="mb-1" />
            <p class="text-tiny">No updates yet.</p>
          </div>

          <div v-else class="comments-scroll-area pr-2" style="max-height: 250px; overflow-y: auto;">
            <div v-for="(comment, index) in selectedDuty.comments" :key="index" class="d-flex mb-4">
              <v-avatar color="primary-lighten-5" size="28" rounded="sm" class="mr-3 border-thin mt-1">
                <span class="text-tiny text-primary font-weight-bold">{{ comment.user?.charAt(0) || '?' }}</span>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-tiny font-weight-bold text-primary">{{ comment.user }}</span>
                  <span class="text-tiny text-grey">{{ formatDate(comment.date) }}</span>
                </div>
                <div class="text-caption text-medium-emphasis leading-tight bg-grey-lighten-5 pa-2 rounded-sm border-thin">
                  {{ comment.text }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-divider class="mb-6 border-opacity-25" />

        <!-- Add Comment Input -->
        <div class="add-comment">
          <v-textarea
            v-model="newComment"
            placeholder="Add a progress update or comment..."
            variant="outlined"
            density="comfortable"
            rounded="md"
            color="primary"
            rows="2"
            auto-grow
            hide-details
            class="mb-3"
          />
          <div class="d-flex justify-end">
            <BaseButton 
              color="primary" 
              size="small" 
              :loading="dutyStore.loading" 
              :disabled="!newComment.trim()"
              @click="handleAddComment"
            >
              Add Update
            </BaseButton>
          </div>
        </div>
      </div>
      <template #actions>
        <BaseButton variant="text" color="primary" @click="showNotesDialog = false">Close</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useDutyStore } from '@/stores/dutyStore'
import { useMemberStore } from '@/stores/memberStore'
import { useAuthStore } from '@/stores/authStore'
import { usePermissions } from '@/composables/usePermissions'

const dutyStore = useDutyStore()
const memberStore = useMemberStore()
const authStore = useAuthStore()
const { isAdmin } = usePermissions()

const search = ref('')
const showFormDialog = ref(false)
const showReportDialog = ref(false)
const showNotesDialog = ref(false)
const isEditing = ref(false)
const isFormValid = ref(false)
const dutyForm = ref(null)
const selectedDuty = ref(null)
const reportNotes = ref('')
const newComment = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const formPayload = reactive({ id: null, title: '', assigned_id: null, date: '', status: 'Pending', category: 'Service', notes: '' })
const rules = { required: v => !!v || 'Required' }

// Column Definitions with live data filtering
const columns = computed(() => {
  const all = dutyStore.duties.filter(d => {
    const q = search.value.toLowerCase()
    return d.title?.toLowerCase().includes(q) || d.assigned_name?.toLowerCase().includes(q)
  })

  return [
    { status: 'Pending', title: 'To Do', icon: 'mdi-clipboard-outline', color: 'warning', tasks: all.filter(t => t.status === 'Pending') },
    { status: 'In Progress', title: 'In Progress', icon: 'mdi-progress-clock', color: 'info', tasks: all.filter(t => t.status === 'In Progress') },
    { status: 'Blocked', title: 'Blocked', icon: 'mdi-alert-octagon', color: 'error', tasks: all.filter(t => t.status === 'Blocked') },
    { status: 'Submitted', title: 'Done', icon: 'mdi-check-circle', color: 'success', tasks: all.filter(t => t.status === 'Submitted') }
  ]
})

onMounted(async () => {
  await dutyStore.fetchDuties()
  if (!memberStore.members.length) await memberStore.fetchMembers()
})

const onDragStart = (evt, duty) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.setData('dutyID', duty.id)
}

const onDrop = async (evt, newStatus) => {
  const dutyID = evt.dataTransfer.getData('dutyID')
  const duty = dutyStore.duties.find(d => d.id == dutyID)
  
  if (duty && duty.status !== newStatus) {
    if (newStatus === 'Submitted') {
      openSubmitReport(duty)
      return
    }
    
    try {
      // Optimistic update
      const oldStatus = duty.status
      duty.status = newStatus 
      const res = await dutyStore.updateDuty(duty.id, { ...duty, status: newStatus })
      if (!res.success) duty.status = oldStatus
      else showSuccess(`Status updated to ${newStatus}`)
    } catch (err) {
      showError('Sync failed')
    }
  }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'

const getStatusColor = (status) => {
  const map = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Blocked': 'error',
    'Submitted': 'success'
  }
  return map[status] || 'grey'
}

const openAssignDialog = () => {
  isEditing.value = false
  Object.assign(formPayload, { id: null, title: '', assigned_id: null, date: '', status: 'Pending', category: 'Service', notes: '' })
  showFormDialog.value = true
}

const openEditDialog = (duty) => {
  isEditing.value = true
  Object.assign(formPayload, {
    id: duty.id,
    title: duty.title,
    assigned_id: duty.assigned_id,
    date: duty.date ? new Date(duty.date).toISOString().split('T')[0] : '',
    status: duty.status,
    category: duty.category || 'Service',
    notes: duty.notes || ''
  })
  showFormDialog.value = true
}

const handleSaveDuty = async () => {
  const { valid } = await dutyForm.value.validate()
  if (!valid) return
  const payload = { ...formPayload, tenantId: authStore.tenantId }
  const result = isEditing.value ? await dutyStore.updateDuty(formPayload.id, payload) : await dutyStore.createDuty(payload)
  if (result.success) {
    showSuccess('Task Saved')
    showFormDialog.value = false
    dutyStore.fetchDuties()
  } else showError(result.error)
}

const openSubmitReport = (duty) => {
  selectedDuty.value = duty
  reportNotes.value = duty.notes || ''
  showReportDialog.value = true
}

const openNotesDialog = (duty) => {
  selectedDuty.value = duty
  newComment.value = ''
  showNotesDialog.value = true
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    user: authStore.user?.name || 'Admin',
    text: newComment.value,
    date: new Date().toISOString()
  }
  
  const updatedComments = [...(selectedDuty.value.comments || []), comment]
  
  const result = await dutyStore.updateDuty(selectedDuty.value.id, {
    ...selectedDuty.value,
    comments: updatedComments
  })
  
  if (result.success) {
    showSuccess('Update added')
    newComment.value = ''
    // Refresh to get updated comments array from store
    const updatedDuty = dutyStore.duties.find(d => d.id === selectedDuty.value.id)
    if (updatedDuty) selectedDuty.value = updatedDuty
  } else showError(result.error)
}

const handleSubmitReport = async () => {
  if (!reportNotes.value.trim()) return
  const result = await dutyStore.submitReport(selectedDuty.value.id, reportNotes.value)
  if (result.success) {
    showSuccess('Task Completed')
    showReportDialog.value = false
    dutyStore.fetchDuties()
  } else showError(result.error)
}

const confirmDelete = async (duty) => {
  if (confirm(`Delete this task?`)) {
    const result = await dutyStore.deleteDuty(duty.id)
    if (result.success) showSuccess('Deleted')
  }
}

const showSuccess = (msg) => { snackbarText.value = msg; snackbarColor.value = 'success'; snackbar.value = true }
const showError = (msg) => { snackbarText.value = msg; snackbarColor.value = 'error'; snackbar.value = true }
</script>

<style scoped>
:deep(.v-chip__content) {
  color: white !important;
}
.kanban-wrapper { width: 100%; }
.kanban-column { width: 280px; min-width: 280px; background: transparent; }
.column-content { min-height: 200px; transition: min-height 0.3s ease; }
.cursor-move { cursor: grab; }
.cursor-move:active { cursor: grabbing; }
.hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.text-tiny { font-size: 0.65rem; }
.gap-2 { gap: 8px; }
.leading-tight { line-height: 1.25; }
.comments-scroll-area::-webkit-scrollbar { width: 4px; }
.comments-scroll-area::-webkit-scrollbar-thumb { background: rgba(121, 85, 72, 0.1); border-radius: 4px; }
</style>
