<template>
  <div class="project-details-view">
    <!-- Back Button -->
    <div class="mb-4">
      <BaseButton
        variant="text"
        color="primary"
        size="small"
        rounded="md"
        prepend-icon="mdi-arrow-left"
        @click="router.back()"
      >
        Back to Projects
      </BaseButton>
    </div>

    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Project Details</h1>
      <p class="text-caption text-grey-darken-1">Detailed overview and metrics for this initiative</p>
    </div>

    <!-- Loading -->
    <v-progress-linear
      v-if="projectStore.loading"
      indeterminate
      color="primary"
      class="mb-4 rounded-pill"
      height="2"
    />

    <!-- Not found -->
    <v-alert v-if="!project && !projectStore.loading" type="error" variant="tonal" rounded="md" class="mb-4">
      Project not found
    </v-alert>

    <!-- Project Content -->
    <template v-if="project">
      <v-row>
        <v-col cols="12" md="8">
          <BaseCard elevation="0" rounded="md" class="pa-6 border-thin bg-white mb-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <h2 class="text-h6 font-weight-bold text-primary">{{ project.title }}</h2>
              <v-chip
                size="small"
                :color="getPriorityColor(project.priority)"
                variant="tonal"
                rounded="md"
                class="font-weight-bold"
              >
                {{ project.priority }}
              </v-chip>
            </div>

            <div class="mb-6">
              <div class="d-flex align-center mb-1">
                <span class="text-caption font-weight-bold text-grey-darken-1">Overall Progress</span>
                <v-spacer />
                <span class="text-subtitle-2 font-weight-bold text-primary">{{ project.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="project.progress"
                color="primary"
                height="10"
                rounded="pill"
              />
            </div>

            <div class="text-body-2 text-medium-emphasis leading-relaxed">
              {{ project.description || 'No description provided for this project.' }}
            </div>
          </BaseCard>

          <!-- Metrics Grid -->
          <v-row dense class="mb-6">
            <v-col cols="6">
              <BaseCard elevation="0" rounded="md" class="pa-4 border-thin bg-white h-100">
                <p class="text-tiny text-grey-darken-1 font-weight-bold text-uppercase mb-1">Budget</p>
                <h3 class="text-h6 font-weight-bold text-success">${{ (project.budget || 0).toLocaleString() }}</h3>
              </BaseCard>
            </v-col>
            <v-col cols="6">
              <BaseCard elevation="0" rounded="md" class="pa-4 border-thin bg-white h-100">
                <p class="text-tiny text-grey-darken-1 font-weight-bold text-uppercase mb-1">Status</p>
                <h3 class="text-h6 font-weight-bold text-secondary">{{ project.status }}</h3>
              </BaseCard>
            </v-col>
          </v-row>

          <!-- Comments Section -->
          <BaseCard elevation="0" rounded="md" class="pa-6 border-thin bg-white" title="Project Comments">
            <div class="comments-list mb-6">
              <div v-if="!project.comments?.length" class="text-center py-8 opacity-50">
                <v-icon icon="mdi-message-text-outline" size="32" class="mb-2" />
                <p class="text-caption">No comments yet. Start the conversation!</p>
              </div>
              
              <div v-for="(comment, index) in project.comments" :key="index" class="comment-item d-flex mb-4">
                <v-avatar color="primary-lighten-5" size="32" rounded="sm" class="mr-3 border-thin mt-1">
                  <span class="text-tiny text-primary font-weight-bold">{{ comment.user?.charAt(0) || '?' }}</span>
                </v-avatar>
                <div class="flex-grow-1 pa-3 bg-grey-lighten-5 rounded-md border-thin">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-caption font-weight-bold text-primary">{{ comment.user }}</span>
                    <span class="text-tiny text-grey">{{ formatDate(comment.date) }}</span>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">{{ comment.text }}</div>
                </div>
              </div>
            </div>

            <v-divider class="mb-6 border-opacity-25" />

            <div class="add-comment">
              <v-textarea
                v-model="newComment"
                placeholder="Write a comment or update..."
                variant="outlined"
                density="comfortable"
                rounded="md"
                color="primary"
                rows="3"
                hide-details
                class="mb-3"
              />
              <div class="d-flex justify-end">
                <BaseButton 
                  color="primary" 
                  size="small" 
                  :loading="addingComment" 
                  :disabled="!newComment.trim()"
                  @click="handleAddComment"
                >
                  Post Comment
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </v-col>

        <v-col cols="12" md="4">
          <BaseCard elevation="0" rounded="md" class="pa-4 border-thin bg-white mb-6" title="Assigned Team">
            <div class="d-flex align-center mt-2">
              <v-avatar color="primary-lighten-5" size="40" rounded="md" class="mr-3 border-thin">
                <v-icon icon="mdi-account" color="primary" />
              </v-avatar>
              <div>
                <p class="text-subtitle-2 font-weight-bold mb-0 text-primary">{{ project.assignedTo }}</p>
                <p class="text-tiny text-medium-emphasis mb-0 uppercase-none">Lead Project Coordinator</p>
              </div>
            </div>
          </BaseCard>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const projectId = route.params.id
const newComment = ref('')
const addingComment = ref(false)

onMounted(async () => {
  await projectStore.fetchProjectById(projectId)
})

const project = computed(() => {
  return projectStore.projects.find(
    (p) => String(p.id) === String(projectId)
  )
})

const getPriorityColor = (priority) => {
  const map = {
    Low: 'grey',
    Medium: 'primary',
    High: 'secondary',
    Urgent: 'error',
  }
  return map[priority] || 'grey'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return
  
  addingComment.value = true
  try {
    const comment = {
      user: authStore.user?.name || 'Admin',
      text: newComment.value,
      date: new Date().toISOString()
    }
    
    // Update locally and persist
    const updatedComments = [...(project.value.comments || []), comment]
    await projectStore.updateProject(project.value.id, {
      comments: updatedComments
    })
    
    newComment.value = ''
  } catch (err) {
    console.error(err)
  } finally {
    addingComment.value = false
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.text-tiny {
  font-size: 0.65rem;
}

.uppercase-none {
  text-transform: none !important;
}

.leading-relaxed {
  line-height: 1.6;
}

.gap-2 { gap: 8px; }
</style>
