<template>
  <v-container class="pa-6">
    <h1 class="text-h4 font-weight-bold mb-4">
      Project Details
    </h1>

    <!-- Loading -->
    <v-progress-linear
      v-if="projectStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Not found -->
    <v-alert v-if="!project && !projectStore.loading" type="error">
      Project not found
    </v-alert>

    <!-- Project -->
    <v-card v-if="project" class="pa-4 rounded-lg">
      <div class="text-h6 font-weight-bold mb-2">
        {{ project.title }}
      </div>

      <p class="text-grey mb-2">
        Priority: {{ project.priority }}
      </p>

      <p class="text-grey mb-2">
        Status: {{ project.status }}
      </p>

      <p class="text-grey mb-2">
        Assigned To: {{ project.assignedTo }}
      </p>

      <p class="text-grey mb-2">
        Budget: ${{ project.budget }}
      </p>

      <p class="text-grey">
        Progress: {{ project.progress }}%
      </p>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const route = useRoute()
const projectStore = useProjectStore()

const projectId = route.params.id

onMounted(async () => {
  if (!projectStore.projects.length) {
    await projectStore.fetchProjects()
  }
})

const project = computed(() => {
  return projectStore.projects.find(
    (p) => String(p.id) === String(projectId)
  )
})
</script>