<template>
  <v-container fluid class="bg-background pa-6 fill-height align-start">
    <!-- Header Area -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary">Church Projects</h1>
        <p class="text-subtitle-1 text-grey">
          Manage church initiatives and monitor progress
        </p>
      </v-col>

      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          @click="showAddProjectDialog = true"
        >
          New Project
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-progress-linear
      v-if="projectStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Kanban Board Columns -->
    <v-row class="kanban-container">
      <v-col
        v-for="column in columns"
        :key="column.title"
        cols="12"
        md="4"
      >
        <v-card
          variant="tonal"
          :color="column.color"
          class="rounded-lg mb-4"
        >
          <v-card-title class="d-flex align-center font-weight-bold">
            {{ column.title }}
            <v-spacer />
            <v-chip size="small" :color="column.color">
              {{ getProjectCount(column.status) }}
            </v-chip>
          </v-card-title>
        </v-card>

        <!-- Project Cards -->
        <div class="project-list">
          <v-card
            v-for="project in getProjectsByStatus(column.status)"
            :key="project.id"
            elevation="2"
            class="mb-4 rounded-lg border-s-lg"
            :style="{ borderInlineStartColor: getPriorityColor(project.priority) }"
            @click="viewProjectDetails(project.id)"
          >
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <span
                  class="text-caption font-weight-bold text-uppercase text-grey"
                >
                  {{ project.priority }}
                </span>
                <v-icon icon="mdi-dots-vertical" size="small" color="grey" />
              </div>

              <div class="text-h6 font-weight-bold mb-3">
                {{ project.title }}
              </div>

              <div class="d-flex align-center mb-1">
                <span class="text-caption text-grey">Progress</span>
                <v-spacer />
                <span class="text-caption font-weight-bold">
                  {{ project.progress }}%
                </span>
              </div>

              <v-progress-linear
                :model-value="project.progress"
                :color="column.color"
                height="6"
                rounded
              />
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-3">
              <span class="text-caption text-grey">
                {{ project.assignedTo }}
              </span>

              <v-spacer />

              <v-btn
                variant="text"
                size="small"
                icon="mdi-arrow-right-bold-circle-outline"
                @click.stop="moveProject(project.id, column.nextStatus)"
                v-if="column.nextStatus"
              />
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Add Project Dialog -->
    <v-dialog v-model="showAddProjectDialog" max-width="500">
      <v-card title="Add New Project" class="pa-4 rounded-xl">
        <v-card-actions>
          <v-spacer />
          <v-btn text="Cancel" @click="showAddProjectDialog = false" />
          <v-btn
            color="primary"
            text="Create"
            @click="showAddProjectDialog = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useRouter } from 'vue-router'

const projectStore = useProjectStore()
const router = useRouter()

const showAddProjectDialog = ref(false)

/* Load projects from API */
onMounted(async () => {
  if (!projectStore.projects.length) {
    await projectStore.fetchProjects()
  }
})

const columns = [
  {
    title: 'To Do',
    status: 'To Do',
    color: 'grey-darken-1',
    nextStatus: 'In Progress',
  },
  {
    title: 'In Progress',
    status: 'In Progress',
    color: 'info',
    nextStatus: 'Completed',
  },
  {
    title: 'Completed',
    status: 'Completed',
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
    Medium: '#3498DB',
    High: '#E67E22',
    Urgent: '#E74C3C',
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
.kanban-container {
  height: calc(100vh - 200px);
  overflow-x: auto;
}

.project-list {
  min-height: 500px;
}

.border-s-lg {
  border-inline-start-width: 4px !important;
  border-inline-start-style: solid !important;
}
</style>