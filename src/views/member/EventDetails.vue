<template>
  <v-container class="pa-4 pa-md-6 main-content-container">

    <!-- Back Button -->
    <div class="mb-4">
      <BaseButton
        variant="text"
        color="primary"
        size="small"
        rounded="md"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        Back to Events
      </BaseButton>
    </div>

    <!-- Error Alert -->
    <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6 rounded-pill" height="2" />

    <!-- Event Content -->
    <template v-if="event.id && !loading">
      <v-row>
        <!-- Main Content -->
        <v-col cols="12" md="8">
          <!-- Event Image with Fallback and Verses -->
          <v-img
            :src="getProgramImage(event)"
            height="400"
            cover
            class="rounded-md mb-6 border-thin shadow-none"
          >
            <!-- Overlay verses only if it's the fallback image -->
            <div v-if="!event.image" class="fill-height d-flex align-center justify-center">
              <div class="verse-overlay-modern pa-4 text-center w-100">
                <p class="verse-text-modern mb-0">"Let all that you do be done in love."</p>
                <p class="verse-ref-modern">1 Corinthians 16:14</p>
              </div>
            </div>
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                <v-progress-circular indeterminate color="primary" size="48" />
              </div>
            </template>
          </v-img>

          <!-- Event Details Card -->
          <BaseCard title="Event Information" class="mb-6 border-thin" elevation="0" rounded="md">
            <v-row class="pa-2">
              <v-col cols="6" class="mb-2">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-calendar-blank" size="20" color="primary" />
                  <div>
                    <p class="text-tiny text-medium-emphasis mb-0">Date</p>
                    <p class="text-caption font-weight-bold">{{ formatDate(event.date) }}</p>
                  </div>
                </div>
              </v-col>

              <v-col cols="6" class="mb-2">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-clock-outline" size="20" color="primary" />
                  <div>
                    <p class="text-tiny text-medium-emphasis mb-0">Time</p>
                    <p class="text-caption font-weight-bold">{{ event.time || 'TBD' }}</p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-map-marker-outline" size="20" color="primary" />
                  <div>
                    <p class="text-tiny text-medium-emphasis mb-0">Location</p>
                    <p class="text-caption font-weight-bold">{{ event.location || 'Church Compound' }}</p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </BaseCard>

          <!-- Description -->
          <BaseCard title="Description" class="mb-6 border-thin" elevation="0" rounded="md">
            <div class="pa-2">
              <p class="text-body-2 text-medium-emphasis leading-relaxed mb-0">
                {{ event.description || 'No description available for this event.' }}
              </p>
            </div>
          </BaseCard>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
          <!-- Register Card -->
          <BaseCard class="mb-6 border-thin" elevation="0" rounded="md">
            <div class="pa-4 text-center">
              <h3 class="text-subtitle-1 font-weight-bold mb-1">Ready to Attend?</h3>
              <p class="text-caption text-medium-emphasis mb-4">
                Sign up now to reserve your spot.
              </p>

              <BaseButton
                color="success"
                variant="tonal"
                size="small"
                rounded="sm"
                prepend-icon="mdi-check-circle-outline"
                class="w-100"
                @click="registerEvent"
              >
                Register Now
              </BaseButton>
            </div>
          </BaseCard>

          <!-- Share Card -->
          <BaseCard class="mb-6 border-thin" elevation="0" rounded="md">
            <div class="pa-4">
              <h3 class="text-subtitle-2 font-weight-bold mb-3">Share Event</h3>
              <div class="d-flex gap-2">
                <v-btn icon variant="tonal" color="primary" size="x-small" rounded="md">
                  <v-icon icon="mdi-facebook" size="18" />
                </v-btn>
                <v-btn icon variant="tonal" color="primary" size="x-small" rounded="md">
                  <v-icon icon="mdi-twitter" size="18" />
                </v-btn>
                <v-btn icon variant="tonal" color="primary" size="x-small" rounded="md">
                  <v-icon icon="mdi-email" size="18" />
                </v-btn>
                <v-btn icon variant="tonal" color="primary" size="x-small" rounded="md" @click="copyLink">
                  <v-icon icon="mdi-link" size="18" />
                </v-btn>
              </div>
            </div>
          </BaseCard>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgramStore } from '@/stores/programStore'
import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const router = useRouter()
const route = useRoute()
const programStore = useProgramStore()

const loading = ref(false)
const error = ref(null)
const event = ref({})

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker'

// Helper to get fallback image
const getProgramImage = (item) => {
  return item.image || DEFAULT_CHURCH_IMAGE
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const eventId = route.params.id
    await programStore.fetchPrograms()
    const found = programStore.programs.find((p) => p.id === parseInt(eventId))
    if (found) {
      event.value = found
    } else {
      error.value = 'Event not found'
    }
  } catch (err) {
    error.value = 'Failed to load event details'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.push('/member/events')
}

const registerEvent = () => {
  alert('Thank you! You have been registered for this event.')
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('Event link copied to clipboard!')
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
.main-content-container {
  max-width: 900px;
  margin: 0 auto;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.text-tiny {
  font-size: 0.65rem !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.verse-overlay-modern {
  background: rgba(121, 85, 72, 0.4);
  backdrop-filter: blur(1px);
}

.verse-text-modern {
  font-size: 1.2rem;
  font-style: italic;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
}

.verse-ref-modern {
  font-size: 0.8rem;
  color: #FAF6F0;
  font-weight: 500;
  margin-top: 4px;
}

.leading-relaxed {
  line-height: 1.6;
}
</style>
