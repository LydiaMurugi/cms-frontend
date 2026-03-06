<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Event Calendar</v-card-title>
      <v-list v-if="programs.length > 0">
        <v-list-item v-for="program in programs" :key="program.id" @click="viewProgram(program.id)">
          <v-list-item-content>
            <v-list-item-title>{{ program.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(program.date) }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-alert v-else type="info">No events available.</v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgramStore } from '@/stores/programStore'

const router = useRouter()
const programStore = useProgramStore()
const programs = ref([])

onMounted(async () => {
  await programStore.fetchPrograms()
  programs.value = programStore.programs
})

const viewProgram = (programId) => {
  router.push(`/member/events/${programId}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>
