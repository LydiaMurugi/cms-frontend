<template>
  <div class="project-board-view">
    <!-- Header Area -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Church Projects</h1>
        <p class="text-caption text-grey-darken-1">Manage church initiatives and monitor progress</p>
      </div>
      <BaseButton
        v-if="hasPermission('manage_projects')"
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        rounded="md"
        @click="showAddProjectDialog = true"
      >
        New Project
      </BaseButton>
    </div>

    <!-- Loading -->
    <v-progress-linear
      v-if="projectStore.loading"
      indeterminate
      color="primary"
      class="mb-4 rounded-pill"
      height="2"
    />

    <!-- Kanban Board Columns -->
    <v-row class="kanban-container" dense>
      <v-col
        v-for="column in columns"
        :key="column.title"
        cols="12"
        md="4"
      >
        <!-- Column Header -->
        <BaseCard
          elevation="0"
          rounded="md"
          class="border-thin bg-white mb-4"
          no-padding
        >
          <div class="pa-3 d-flex align-center">
            <v-icon :icon="column.icon" :color="column.color" size="20" class="mr-2" />
            <span class="text-subtitle-2 font-weight-bold">{{ column.title }}</span>
            <v-spacer />
            <v-chip size="x-small" :color="column.color" variant="tonal" rounded="md" class="font-weight-bold">
              {{ getProjectCount(column.status) }}
            </v-chip>
          </div>
        </BaseCard>

        <!-- Project Cards -->
        <div class="project-list">
          <BaseCard
            v-for="project in getProjectsByStatus(column.status)"
            :key="project.id"
            elevation="0"
            rounded="md"
            class="mb-3 border-thin bg-white clickable-card"
            no-padding
            @click="viewProjectDetails(project.id)"
          >
            <div class="pa-4 border-s-priority" :style="{ borderInlineStartColor: getPriorityColor(project.priority) }">
              <div class="d-flex justify-space-between align-center mb-2">
                <v-chip
                  size="x-small"
                  variant="outlined"
                  class="text-tiny font-weight-bold"
                  :style="{ color: getPriorityColor(project.priority), borderColor: getPriorityColor(project.priority) }"
                >
                  {{ project.priority }}
                </v-chip>
                <BaseButton icon="mdi-dots-vertical" variant="text" size="x-small" color="grey" />
              </div>

              <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">
                {{ project.title }}
              </div>

              <div class="d-flex align-center mb-1">
                <span class="text-tiny text-medium-emphasis font-weight-bold uppercase-none">Progress</span>
                <v-spacer />
                <span class="text-tiny font-weight-bold text-primary">
                  {{ project.progress }}%
                </span>
              </div>

              <v-progress-linear
                :model-value="project.progress"
                :color="column.color"
                height="4"
                rounded="pill"
              />

              <div class="mt-4 d-flex align-center">
                <v-avatar size="24" color="primary-lighten-5" class="mr-2 border-thin">
                  <span class="text-tiny text-primary font-weight-bold">{{ project.assignedTo.charAt(0) }}</span>
                </v-avatar>
                <span class="text-tiny text-medium-emphasis">{{ project.assignedTo }}</span>
                
                <v-spacer />
                
                <BaseButton
                  v-if="column.nextStatus && hasPermission('manage_projects')"
                  variant="text"
                  size="x-small"
                  color="primary"
                  icon="mdi-arrow-right"
                  @click.stop="moveProject(project.id, column.nextStatus)"
                />
              </div>
            </div>
          </BaseCard>
        </div>
      </v-col>
    </v-row>

    <!-- Add Project Dialog -->
    <BaseModal v-model="showAddProjectDialog" title="Add New Project" max-width="500">
      <div class="pa-2">
        <BaseInput v-model="newProject.title" label="Project Title" placeholder="e.g. Roof Renovation" />
        <v-select
          v-model="newProject.priority"
          label="Priority"
          :items="['Low', 'Medium', 'High', 'Urgent']"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mt-2"
        />
        <v-autocomplete
          v-model="newProject.assignedTo"
          :items="['Admin', 'Deacon', 'Pastor', 'Volunteer']"
          label="Assign To"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mt-2"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" @click="showAddProjectDialog = false">Cancel</BaseButton>
        <BaseButton @click="createProject" :loading="projectStore.loading">Create Project</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'

const projectStore = useProjectStore()
const authStore = useAuthStore()
const router = useRouter()
const { hasPermission } = usePermissions()

const showAddProjectDialog = ref(false)
const newProject = reactive({
  title: '',
  priority: 'Medium',
  assignedTo: '',
})

onMounted(async () => {
  if (hasPermission('manage_projects') || hasPermission('view_dashboard')) {
    if (!projectStore.projects.length) {
      await projectStore.fetchProjects()
    }
  }
})

const createProject = async () => {
  if (!newProject.title) return
  
  await projectStore.addProject({
    ...newProject,
    status: 'To Do',
    progress: 0,
    tenantId: authStore.tenantId
  })
  
  showAddProjectDialog.value = false
  newProject.title = ''
}

const columns = [
  {
    title: 'To Do',
    status: 'To Do',
    icon: 'mdi-circle-outline',
    color: 'grey-darken-1',
    nextStatus: 'In Progress',
  },
  {
    title: 'In Progress',
    status: 'In Progress',
    icon: 'mdi-progress-clock',
    color: 'secondary',
    nextStatus: 'Completed',
  },
  {
    title: 'Completed',
    status: 'Completed',
    icon: 'mdi-check-circle-outline',
    color: 'success',
    nextStatus: null,
  },
]

const getProjectsByStatus = (status) => {
  return projectStore.projects.filter((p) => p.status === status)
}

const getProjectCount = (status) => {
  return getProjectsByStatus(status).length
}

const getPriorityColor = (priority) => {
  const map = {
    Low: '#95A5A6',
    Medium: '#795548',
    High: '#A67C52',
    Urgent: '#B03A2E',
  }
  return map[priority] || '#BDC3C7'
}

const moveProject = async (id, newStatus) => {
  await projectStore.moveProject(id, newStatus)
}

const viewProjectDetails = (id) => {
  router.push(`/admin/projects/${id}`)
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-s-priority {
  border-inline-start-width: 4px !important;
  border-inline-start-style: solid !important;
}

.text-tiny {
  font-size: 0.65rem;
}

.clickable-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.clickable-card:hover {
  border-color: #795548 !important;
}

.uppercase-none {
  text-transform: none !important;
}
</style>
