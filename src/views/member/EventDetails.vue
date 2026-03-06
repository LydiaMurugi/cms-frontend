<template>
  <v-container>
    <v-card v-if="event" class="pa-4">
      <v-card-title>{{ event.title }}</v-card-title>
      <v-card-subtitle>{{ formatDate(event.date) }}</v-card-subtitle>
      <v-card-text>
        <p>{{ event.description }}</p>
        <v-btn v-if="event.livestream_url" @click="goToLivestream" color="primary">
          Watch Livestream
        </v-btn>
      </v-card-text>
    </v-card>
    <v-alert v-else type="error">Event not found.</v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProgramStore } from '@/stores/programStore'

const route = useRoute()
const programStore = useProgramStore()
const event = ref(null)

onMounted(async () => {
  const eventId = route.params.id
  await programStore.fetchPrograms()
  event.value = programStore.programs.find(p => p.id == eventId)
})

const goToLivestream = () => {
  if (event.value?.livestream_url) {
    window.open(event.value.livestream_url, '_blank')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>