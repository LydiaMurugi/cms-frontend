<template>
  <div class="project-board-view h-100 d-flex flex-column">
    <!-- Header Area -->
    <div class="d-flex align-center justify-space-between mb-6 px-4">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Church Projects</h1>
        <p class="text-caption text-grey-darken-1">Manage church initiatives and monitor progress</p>
      </div>
      <div class="d-flex gap-2">
        <BaseInput
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search projects..."
          hide-details
          clearable
          density="compact"
          style="width: 240px"
        />
        <BaseButton
          v-if="hasPermission('manage_projects')"
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          rounded="md"
          @click="openAddDialog"
        >
          New Project
        </BaseButton>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="kanban-wrapper px-4 pb-4 flex-grow-1 overflow-x-auto">
      <div class="d-flex ga-4 h-100" style="min-width: 1000px">
        
        <!-- Kanban Columns -->
        <div 
          v-for="col in columns" 
          :key="col.status"
          class="kanban-column d-flex flex-column"
          @dragover.prevent
          @drop="onDrop($event, col.status)"
        >
          <!-- Column Header -->
          <div class="column-header d-flex align-center justify-space-between mb-3 px-2">
            <div class="d-flex align-center">
              <v-icon :icon="col.icon" size="18" :color="col.color" class="mr-2" />
              <span class="text-subtitle-2 font-weight-bold text-uppercase text-grey-darken-3">
                {{ col.title }}
              </span>
              <v-chip size="x-small" :color="col.color" variant="tonal" class="ml-2 font-weight-bold">
                {{ getProjectsByStatus(col.status).length }}
              </v-chip>
            </div>
          </div>

          <!-- Column Content (Draggable Area) -->
          <div class="column-content flex-grow-1 pa-2 bg-grey-lighten-4 rounded-md border-thin border-dashed">
            
            <div v-if="projectStore.loading && !projectStore.projects.length" class="text-center py-8">
              <v-progress-circular indeterminate size="24" color="primary" />
            </div>

            <!-- Project Cards -->
            <div 
              v-for="project in filteredProjects(col.status)" 
              :key="project.id"
              class="project-item mb-3"
              draggable="true"
              @dragstart="onDragStart($event, project)"
              @click="viewProjectDetails(project.id)"
            >
              <BaseCard
                elevation="0"
                rounded="md"
                class="border-thin bg-white hover-shadow transition-all pa-0 overflow-hidden cursor-move"
                no-padding
              >
                <div class="pa-4 border-s-priority" :style="{ borderInlineStartColor: getPriorityColor(project.priority) }">
                  <div class="d-flex justify-space-between align-start mb-2">
                    <v-chip
                      size="x-small"
                      variant="outlined"
                      class="text-tiny font-weight-bold"
                      :style="{ color: getPriorityColor(project.priority), borderColor: getPriorityColor(project.priority) }"
                    >
                      {{ project.priority }}
                    </v-chip>
                    
                    <v-menu v-if="hasPermission('manage_projects')" location="bottom end">
                      <template #activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" variant="text" size="x-small" color="grey" v-bind="props" class="mt-n1 mr-n1" @click.stop />
                      </template>
                      <v-list density="compact" class="pa-1 rounded-md border-thin">
                        <v-list-item prepend-icon="mdi-pencil-outline" title="Edit Details" @click.stop="openEditDialog(project)" />
                        <v-list-item prepend-icon="mdi-file-download-outline" title="Download Report" @click.stop="downloadProjectReport(project)" />
                        <v-list-item prepend-icon="mdi-delete-outline" title="Delete Project" class="text-error" @click.stop="confirmDelete(project)" />
                      </v-list>
                    </v-menu>
                  </div>

                  <div class="text-subtitle-2 font-weight-bold mb-3 text-primary line-clamp-2">
                    {{ project.title }}
                  </div>

                  <div class="d-flex align-center mb-1">
                    <span class="text-tiny text-medium-emphasis font-weight-bold">Progress</span>
                    <v-spacer />
                    <span class="text-tiny font-weight-bold text-primary">
                      {{ project.progress }}%
                    </span>
                  </div>

                  <v-progress-linear
                    :model-value="project.progress"
                    :color="col.color"
                    height="4"
                    rounded="pill"
                    class="mb-4"
                  />

                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-avatar size="20" color="primary-lighten-5" class="mr-2 border-thin">
                        <span class="text-tiny text-primary font-weight-bold">{{ project.assignedTo?.charAt(0) || '?' }}</span>
                      </v-avatar>
                      <span class="text-tiny text-medium-emphasis text-truncate" style="max-width: 100px">
                        {{ project.assignedTo || 'Unassigned' }}
                      </span>
                    </div>
                    
                    <v-icon v-if="project.status === 'Completed'" icon="mdi-check-decagram" color="success" size="18" />
                    <v-icon v-else-if="col.nextStatus" icon="mdi-arrow-right" color="primary" size="16" class="opacity-50" />
                  </div>
                </div>
              </BaseCard>
            </div>

            <!-- Empty Column State -->
            <div v-if="!filteredProjects(col.status).length && !projectStore.loading" class="d-flex flex-column align-center justify-center py-12 opacity-30">
              <v-icon :icon="col.icon" size="32" />
              <span class="text-tiny mt-1 font-weight-bold">Drop Here</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Add/Edit Project Dialog -->
    <BaseModal v-model="showFormDialog" :title="isEditing ? 'Edit Project' : 'New Project'" max-width="500">
      <v-form ref="projectForm" v-model="isFormValid" class="pa-2">
        <BaseInput v-model="formPayload.title" label="Project Title" placeholder="e.g. Roof Renovation" :rules="[rules.required]" />
        
        <v-row dense class="mt-2">
          <v-col cols="12" sm="6">
            <v-select
              v-model="formPayload.priority"
              label="Priority"
              :items="['Low', 'Medium', 'High', 'Urgent']"
              variant="outlined"
              density="comfortable"
              rounded="md"
              color="primary"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <BaseInput 
              v-model.number="formPayload.budget" 
              label="Budget ($)" 
              placeholder="0.00" 
              type="number"
              prepend-inner-icon="mdi-cash"
            />
          </v-col>
        </v-row>
        
        <v-autocomplete
          v-model="formPayload.assignedTo"
          :items="memberStore.members"
          item-title="name"
          item-value="name"
          label="Assign To"
          placeholder="Select a member"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mt-2"
          clearable
        />

        <div v-if="isEditing" class="mt-4">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-caption font-weight-bold">Progress</span>
            <span class="text-caption font-weight-bold text-primary">{{ formPayload.progress }}%</span>
          </div>
          <v-slider
            v-model="formPayload.progress"
            color="primary"
            track-color="primary-lighten-4"
            density="compact"
            hide-details
            step="5"
          />
        </div>
      </v-form>
      <template #actions>
        <BaseButton variant="text" @click="showFormDialog = false">Cancel</BaseButton>
        <BaseButton 
          color="primary" 
          @click="handleSaveProject" 
          :loading="projectStore.loading" 
          :disabled="!isFormValid"
        >
          {{ isEditing ? 'Save Changes' : 'Create Project' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- UI Feedback -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" rounded="md" elevation="0">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useMemberStore } from '@/stores/memberStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'

const projectStore = useProjectStore()
const memberStore = useMemberStore()
const authStore = useAuthStore()
const router = useRouter()
const { hasPermission } = usePermissions()

const search = ref('')
const showFormDialog = ref(false)
const isEditing = ref(false)
const isFormValid = ref(false)
const projectForm = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const formPayload = reactive({
  id: null,
  title: '',
  priority: 'Medium',
  assignedTo: '',
  progress: 0,
  status: 'To Do',
  budget: 0
})

const rules = { required: v => !!v || 'Required' }

const columns = [
  { title: 'To Do', status: 'To Do', icon: 'mdi-circle-outline', color: 'grey-darken-1', nextStatus: 'In Progress' },
  { title: 'In Progress', status: 'In Progress', icon: 'mdi-progress-clock', color: 'secondary', nextStatus: 'Completed' },
  { title: 'Completed', status: 'Completed', icon: 'mdi-check-circle-outline', color: 'success', nextStatus: null }
]

onMounted(async () => {
  if (hasPermission('manage_projects') || hasPermission('view_dashboard')) {
    projectStore.fetchProjects()
    if (!memberStore.members.length) memberStore.fetchMembers()
  }
})

const filteredProjects = (status) => {
  return projectStore.projects.filter(p => {
    const q = search.value.toLowerCase()
    const matchesSearch = p.title?.toLowerCase().includes(q) || p.assignedTo?.toLowerCase().includes(q)
    return p.status === status && matchesSearch
  })
}

const getProjectsByStatus = (status) => projectStore.projects.filter(p => p.status === status)

const getProjectCount = (status) => getProjectsByStatus(status).length

const getPriorityColor = (priority) => {
  const map = { Low: '#95A5A6', Medium: '#795548', High: '#A67C52', Urgent: '#B03A2E' }
  return map[priority] || '#BDC3C7'
}

/* Drag and Drop Logic */
const onDragStart = (evt, project) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.setData('projectID', project.id)
}

const onDrop = async (evt, newStatus) => {
  const projectID = evt.dataTransfer.getData('projectID')
  const project = projectStore.projects.find(p => p.id == projectID)
  
  if (project && project.status !== newStatus) {
    try {
      // Optimistic update
      const oldStatus = project.status
      project.status = newStatus
      
      const result = await projectStore.moveProject(project.id, newStatus)
      if (result.success) {
        showSuccess(`Project moved to ${newStatus}`)
      } else {
        project.status = oldStatus
        showError(result.error)
      }
    } catch (err) {
      showError('Sync failed')
    }
  }
}

/* Modal Handlers */
const openAddDialog = () => {
  isEditing.value = false
  Object.assign(formPayload, { id: null, title: '', priority: 'Medium', assignedTo: '', progress: 0, status: 'To Do', budget: 0 })
  showFormDialog.value = true
}

const openEditDialog = (project) => {
  isEditing.value = true
  Object.assign(formPayload, {
    id: project.id,
    title: project.title,
    priority: project.priority || 'Medium',
    assignedTo: project.assignedTo || '',
    progress: project.progress || 0,
    status: project.status,
    budget: project.budget || 0
  })
  showFormDialog.value = true
}

const handleSaveProject = async () => {
  const { valid } = await projectForm.value.validate()
  if (!valid) return

  const payload = { ...formPayload, tenantId: authStore.tenantId }
  const result = isEditing.value 
    ? await projectStore.updateProject(formPayload.id, payload)
    : await projectStore.addProject(payload)
  
  if (result.success) {
    showSuccess(isEditing.value ? 'Project updated' : 'Project created')
    showFormDialog.value = false
    projectStore.fetchProjects()
  } else {
    showError(result.error)
  }
}

const confirmDelete = async (project) => {
  if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
    const result = await projectStore.deleteProject(project.id)
    if (result.success) showSuccess('Project deleted')
    else showError(result.error)
  }
}

const viewProjectDetails = (id) => {
  router.push(`/admin/projects/${id}`)
}

const downloadProjectReport = (project) => {
  const headers = ['ID', 'Title', 'Priority', 'Status', 'Assigned To', 'Progress', 'Budget', 'Spent']
  const data = [
    project.id,
    project.title,
    project.priority,
    project.status,
    project.assignedTo || 'Unassigned',
    `${project.progress}%`,
    project.budget || 0,
    project.spent || 0
  ]
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + data.join(",")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `Project_Report_${project.title.replace(/\s+/g, '_')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  showSuccess('Report downloaded successfully')
}

const showSuccess = (msg) => { snackbarText.value = msg; snackbarColor.value = 'success'; snackbar.value = true }
const showError = (msg) => { snackbarText.value = msg; snackbarColor.value = 'error'; snackbar.value = true }
</script>

<style scoped>
.project-board-view { height: calc(100vh - 120px); overflow: hidden; }
.kanban-wrapper { width: 100%; overflow-y: hidden; }
.kanban-column { width: 320px; min-width: 320px; height: 100%; background: transparent; }
.column-content { overflow-y: auto; scrollbar-width: thin; min-height: 200px; }

.border-thin { border: 1px solid rgba(121, 85, 72, 0.1) !important; }
.border-s-priority { border-inline-start-width: 4px !important; border-inline-start-style: solid !important; }
.text-tiny { font-size: 0.65rem; }

.hover-shadow:hover { 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; 
  transform: translateY(-2px); 
}

.cursor-move { cursor: grab; }
.cursor-move:active { cursor: grabbing; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 { gap: 8px; }
</style>
