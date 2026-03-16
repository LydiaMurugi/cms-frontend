<template>
  <div class="church-directory">
    <div class="d-flex justify-space-between align-center mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Church Directory</h1>
        <p class="text-caption text-grey-darken-1">Manage all church tenants on the platform</p>
      </div>
      <BaseButton prepend-icon="mdi-plus" to="/admin/churches/register">
        Add Church
      </BaseButton>
    </div>

<v-row v-if="churchStore.loading">
      <v-col v-for="n in 3" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader type="article, actions" class="border-thin rounded-md" />
      </v-col>
    </v-row>

    <v-row v-else-if="churchStore.churches.length > 0">
      <v-col v-for="church in churchStore.churches" :key="church.id" cols="12" md="6" lg="4">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100">
          <div class="d-flex align-center mb-4">
            <v-avatar color="primary-lighten-5" size="56" rounded="md" class="mr-4">
              <v-icon icon="mdi-church" color="primary" size="32" />
            </v-avatar>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-primary">{{ church.churchName || church.name }}</h3>
              <div class="text-caption text-grey">{{ church.location }}</div>
            </div>
          </div>

          <div class="d-flex justify-space-between text-caption mb-2">
            <span class="text-grey">Members:</span>
            <span class="font-weight-bold">{{ church.memberCount || 0 }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption mb-4">
            <span class="text-grey">Admin:</span>
            <span class="font-weight-bold">{{ church.adminEmail }}</span>
          </div>

          <v-divider class="mb-4 border-opacity-25" />

          <div class="d-flex justify-end gap-2">
            <v-btn variant="text" size="small" color="primary" rounded="md">Edit</v-btn>
            <v-btn variant="tonal" size="small" color="primary" rounded="md">Manage</v-btn>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-12">
        <v-icon icon="mdi-office-building-off-outline" size="64" color="grey-lighten-2" class="mb-4" />
        <h3 class="text-h6 text-grey">No churches found</h3>
        <p class="text-caption text-grey mb-4">Start by registering your first church tenant.</p>
        <BaseButton prepend-icon="mdi-plus" to="/admin/churches/register">Register Church</BaseButton>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const churchStore = useChurchStore()

onMounted(() => {
  churchStore.fetchChurches()
})
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
.gap-2 {
  gap: 8px;
}
</style>
