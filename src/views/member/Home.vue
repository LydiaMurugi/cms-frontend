<template>
  <v-container class="pa-4 bg-background">
    <!-- Greeting -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-h5 font-weight-bold text-primary">
          Hello, {{ store.userName }}!
        </div>
        <div class="text-subtitle-2 text-grey">
          We're glad to have you with us today.
        </div>
      </v-col>
    </v-row>

    <!-- Sunday Service -->
    <v-row dense v-if="store.upcomingService">
      <v-col cols="12">
        <v-card color="primary" class="rounded-xl pa-4 mb-4" elevation="4">
          <v-row align="center">
            <v-col cols="8">
              <div class="text-h6 font-weight-bold text-white">
                {{ store.upcomingService.title }}
              </div>
              <div class="text-caption text-white opacity-80 mb-2">
                Join us live at {{ store.upcomingService.time }}
              </div>

              <v-btn
                color="white"
                variant="flat"
                size="small"
                class="text-primary font-weight-bold"
                @click="store.goToLivestream"
              >
                Join Livestream
              </v-btn>
            </v-col>

            <v-col cols="4" class="text-right">
              <v-icon
                icon="mdi-video-outline"
                size="64"
                color="white"
                class="opacity-40"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Giving Summary -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card variant="outlined" class="rounded-xl border-dashed">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-grey">
                Total Given This Year
              </div>
              <div class="text-h5 font-weight-bold text-success">
                {{ store.formattedGivingTotal }}
              </div>
            </div>

            <v-btn
              color="success"
              variant="tonal"
              size="small"
              @click="store.goToGivingHistory"
            >
              History
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Programs -->
    <v-row class="mb-2">
      <v-col cols="12" class="d-flex align-center justify-space-between pb-0">
        <div class="text-subtitle-1 font-weight-bold">
          Upcoming Programs
        </div>

        <v-btn
          variant="text"
          color="primary"
          size="small"
          @click="store.goToPrograms"
        >
          See All
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
   <v-col v-for="program in programStore. upcomingPrograms" :key="program.id" cols="12">
        <v-card
          class="rounded-xl mb-2"
          elevation="1"
          @click="store.viewProgram(program.id)"
        >
          <div class="d-flex">
            <v-img
              :src="program.image || defaultProgramImage"
              width="100"
              height="100"
              cover
              class="rounded-s-xl"
            />

            <div class="pa-3 flex-grow-1">
              <div
                class="text-caption text-secondary font-weight-bold text-uppercase"
              >
                {{ program.category }}
              </div>

              <div class="text-subtitle-1 font-weight-bold mb-1">
                {{ program.title }}
              </div>

              <div class="text-caption text-grey d-flex align-center">
                <v-icon icon="mdi-calendar" size="14" class="mr-1" />
                {{ program.date }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resources -->
    <v-row class="mt-4 mb-2">
      <v-col cols="12" class="pb-0">
        <div class="text-subtitle-1 font-weight-bold">
          Latest Resources
        </div>
      </v-col>
    </v-row>

    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="resource in store.resources"
        :key="resource.id"
      >
        <v-card width="160" class="ma-2 rounded-xl" elevation="2">
          <v-img
            :src="resource.image || defaultResourceImage"
            height="100"
            cover
          />

          <v-card-text class="pa-2">
            <div class="text-caption font-weight-bold text-truncate">
              {{ resource.title }}
            </div>

            <div class="text-caption text-grey">
              {{ resource.date }}
            </div>
          </v-card-text>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue"
import { useMemberDashboardStore } from "@/stores/memberDashboardStore"
import { useProgramStore } from "@/stores/programStore"

const store = useMemberDashboardStore()
const programStore = useProgramStore()

const defaultProgramImage =
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=300"

const defaultResourceImage =
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=300"

onMounted(async () => {
  await store.fetchDashboard()
  await programStore.fetchPrograms()
})
</script>

<style scoped>
.opacity-80 {
  opacity: 0.8;
}

.opacity-40 {
  opacity: 0.4;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:active {
  transform: scale(0.98);
}
</style>