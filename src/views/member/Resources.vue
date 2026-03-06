<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Resources Library</v-card-title>
      <v-row>
        <v-col v-for="resource in resources" :key="resource.id" cols="12" md="4">
          <v-card>
            <v-img v-if="resource.image" :src="resource.image" height="150"></v-img>
            <v-card-title>{{ resource.title }}</v-card-title>
            <v-card-actions>
              <v-btn @click="downloadResource(resource)">Download</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResourceStore } from '@/stores/resourceStore'

const resourceStore = useResourceStore()
const resources = ref([])

onMounted(async () => {
  await resourceStore.fetchResources()
  resources.value = resourceStore.resources
})

const downloadResource = (resource) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}
</script>