<template>
  <div class="member-events-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-0">Events & Programs</h1>
      <p class="text-caption text-grey-darken-1">
        Discover upcoming church events and spiritual programs.
      </p>
    </div>

    <!-- Error Alert -->
    <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6 rounded-pill" height="2" />

    <!-- Events List -->
    <div v-if="programs.length > 0">
      <BaseCard
        v-for="program in programs"
        :key="program.id"
        elevation="0"
        rounded="md"
        class="mb-4 border-thin bg-white overflow-hidden clickable-card"
        @click="viewEventDetails(program.id)"
      >
        <!-- Event Image with Fallback and Floating Verse -->
        <v-img
          :src="getProgramImage(program)"
          height="160"
          cover
        >
          <!-- Floating Verse Over Fallback Photo -->
          <div v-if="!program.image" class="fill-height d-flex align-center justify-center">
            <div class="verse-overlay-modern pa-2 text-center w-100">
              <p class="verse-text-modern mb-0">"Faith comes by hearing"</p>
              <p class="verse-ref-modern">Romans 10:17</p>
            </div>
          </div>

          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
              <v-progress-circular indeterminate color="primary" size="32" />
            </div>
          </template>
        </v-img>

        <!-- Event Content -->
        <div class="pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <v-chip
              size="x-small"
              color="primary"
              variant="tonal"
              rounded="md"
              class="font-weight-bold"
            >
              {{ program.category }}
            </v-chip>
            
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-calendar-blank" size="14" class="mr-1" />
              {{ formatDate(program.date) }}
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            {{ program.title }}
          </h3>

          <!-- Description -->
          <p class="text-body-2 text-medium-emphasis mb-4 line-clamp-2">
            {{ program.description }}
          </p>

          <div class="d-flex align-center justify-space-between mt-auto">
            <div class="d-flex align-center gap-2 text-caption font-weight-medium text-grey-darken-1">
              <v-icon icon="mdi-map-marker-outline" size="16" color="primary" />
              {{ program.location || 'TBD' }}
            </div>

            <BaseButton
              variant="tonal"
              color="primary"
              size="small"
              rounded="md"
              @click.stop="viewEventDetails(program.id)"
            >
              Learn More
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else-if="!loading">
      <BaseCard elevation="0" rounded="md" class="pa-8 text-center border-thin bg-white">
        <v-icon icon="mdi-calendar-blank-outline" size="48" color="grey-lighten-1" class="mb-3" />
        <h3 class="text-subtitle-1 font-weight-bold mb-1">No Events Found</h3>
        <p class="text-caption text-medium-emphasis">
          Check back later for new programs.
        </p>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgramStore } from '@/stores/programStore'
import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const router = useRouter()
const programStore = useProgramStore()

const loading = ref(false)
const error = ref(null)
const programs = ref([])

// Helper to get fallback image
const getProgramImage = (item) => {
  return item.image || DEFAULT_CHURCH_IMAGE
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await programStore.fetchPrograms()
    programs.value = programStore.programs
  } catch (err) {
    error.value = 'Failed to load events'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const viewEventDetails = (programId) => {
  router.push(`/member/events/${programId}`)
}

const formatDate = (date) => {
  if (!date) return 'TBD'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.clickable-card {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.clickable-card:active {
  background-color: #f8fafc;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}

.verse-overlay-modern {
  background: rgba(121, 85, 72, 0.4);
  backdrop-filter: blur(1px);
}

.verse-text-modern {
  font-size: 0.85rem;
  font-style: italic;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
}

.verse-ref-modern {
  font-size: 0.65rem;
  color: #FAF6F0;
  font-weight: 500;
  margin-top: 2px;
}
</style>
