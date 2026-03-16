<template>
  <div class="member-home-view">
    <!-- Greeting Section -->
    <div class="mb-6 px-2">
      <h2 class="text-h5 font-weight-bold text-primary">
        Hello, {{ store.userName }}!
      </h2>
      <p class="text-subtitle-2 text-medium-emphasis mt-1">
        We're glad to have you with us today.
      </p>
    </div>

    <!-- Service Card - Flat Style -->
    <BaseCard
      v-if="store.upcomingService"
      elevation="0"
      rounded="md"
      color="primary"
      class="mb-6 modern-service-card"
    >
      <div class="d-flex align-center justify-space-between pa-6">
        <div class="flex-grow-1 pr-4">
          <h3 class="text-h6 font-weight-bold text-white mb-1">
            {{ store.upcomingService.title }}
          </h3>
          <p class="text-caption text-white-70 mb-4">
            Join us live at {{ store.upcomingService.time }}
          </p>
          <BaseButton
            color="white"
            variant="flat"
            size="small"
            class="text-primary font-weight-bold px-4"
            rounded="md"
            @click="store.goToLivestream"
          >
            Join Livestream
          </BaseButton>
        </div>
        <v-icon
          icon="mdi-video-outline"
          size="56"
          color="white"
          class="opacity-40"
        />
      </div>
    </BaseCard>

    <!-- Giving Summary - Flat with Border -->
    <BaseCard 
      elevation="0" 
      rounded="md" 
      class="mb-6 border-thin bg-white"
    >
      <div class="d-flex align-center justify-space-between pa-5">
        <div>
          <p class="text-caption text-medium-emphasis mb-1">
            Total Given (2024)
          </p>
          <h4 class="text-h5 font-weight-bold text-success">
            {{ store.formattedGivingTotal }}
          </h4>
        </div>
        <BaseButton
          color="success"
          variant="tonal"
          size="small"
          rounded="md"
          @click="store.goToGivingHistory"
        >
          History
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Programs Section -->
    <div class="d-flex align-center justify-space-between mb-4 px-2">
      <h3 class="text-subtitle-1 font-weight-bold">Upcoming Programs</h3>
      <v-btn variant="text" color="primary" size="small" class="text-none" @click="store.goToPrograms">
        See All
      </v-btn>
    </div>

    <div class="programs-list">
      <BaseCard
        v-for="program in programStore.upcomingPrograms"
        :key="program.id"
        elevation="0"
        rounded="md"
        class="mb-4 border-thin bg-white overflow-hidden clickable-card"
        @click="store.viewProgram(program.id)"
      >
        <div class="d-flex align-center">
          <v-img
            :src="getProgramImage(program)"
            width="100"
            height="100"
            cover
          >
            <!-- Overlay verses only if it's the fallback image -->
            <div v-if="!program.image" class="fill-height d-flex align-end justify-center">
              <div class="verse-overlay-modern pa-1 text-center w-100">
                <span class="verse-text-modern">"The Lord is my shepherd"</span>
              </div>
            </div>
            
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                <v-progress-circular indeterminate color="primary" size="20" width="2" />
              </div>
            </template>
          </v-img>
          <div class="pa-4 flex-grow-1 min-width-0">
            <p class="text-overline text-secondary font-weight-bold mb-0 line-height-1">
              {{ program.category }}
            </p>
            <h4 class="text-subtitle-1 font-weight-bold text-truncate mb-1">
              {{ program.title }}
            </h4>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-calendar-blank" size="14" class="mr-1" />
              {{ program.date }}
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Latest Resources -->
    <div class="mt-8 mb-4 px-2">
      <h3 class="text-subtitle-1 font-weight-bold">Resources</h3>
    </div>

    <v-slide-group show-arrows="always" class="mx-n2">
      <v-slide-group-item v-for="resource in store.resources" :key="resource.id">
        <BaseCard
          width="160"
          elevation="0"
          rounded="md"
          class="ma-2 border-thin bg-white overflow-hidden clickable-card"
        >
          <v-img :src="getProgramImage(resource)" height="100" cover>
            <div v-if="!resource.image" class="fill-height d-flex align-center justify-center">
              <div class="verse-overlay-modern pa-1 text-center w-100">
                <span class="verse-text-tiny-modern">"God is love"</span>
              </div>
            </div>
          </v-img>
          <div class="pa-3">
            <p class="text-caption font-weight-bold text-truncate mb-0">
              {{ resource.title }}
            </p>
            <p class="text-caption text-medium-emphasis small-text mt-1">
              {{ resource.date }}
            </p>
          </div>
        </BaseCard>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMemberDashboardStore } from '@/stores/memberDashboardStore'
import { useProgramStore } from '@/stores/programStore'

import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const store = useMemberDashboardStore()
const programStore = useProgramStore()

// Remove local defaults and use centralized constant
const defaultProgramImage = DEFAULT_CHURCH_IMAGE
const defaultResourceImage = DEFAULT_CHURCH_IMAGE

// Helper to get fallback image
const getProgramImage = (item) => {
  return item.image || DEFAULT_CHURCH_IMAGE
}

onMounted(async () => {
  await store.fetchDashboard()
  await programStore.fetchPrograms()
})
</script>

<style scoped>
.member-home-view {
  padding-bottom: 24px;
}

.modern-service-card {
  background: linear-gradient(135deg, #5D4037 0%, #795548 100%);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.clickable-card {
  transition: transform 0.1s ease, background-color 0.2s ease;
  cursor: pointer;
}

.clickable-card:active {
  transform: scale(0.98);
  background-color: #f8fafc;
}

.line-height-1 {
  line-height: 1;
}

.small-text {
  font-size: 10px;
}

.min-width-0 {
  min-width: 0;
}

.opacity-40 {
  opacity: 0.4;
}

.opacity-20 {
  opacity: 0.2;
}

.verse-overlay-modern {
  background: linear-gradient(to top, rgba(121, 85, 72, 0.8), transparent);
  padding-bottom: 8px !important;
}

.verse-text-modern {
  font-size: 0.65rem;
  font-style: italic;
  font-weight: 700;
  color: #FAF6F0;
  letter-spacing: 0.02em;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
}

.verse-text-tiny-modern {
  font-size: 0.6rem;
  font-style: italic;
  color: white;
  font-weight: 800;
  background: rgba(121, 85, 72, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
