<template>
  <v-container class="fill-height bg-background">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <BaseCard elevation="0" rounded="md" class="pa-10 border-thin bg-white">
          <v-icon
            icon="mdi-map-marker-question-outline"
            size="100"
            color="primary-lighten-2"
            class="mb-6"
          />
          
          <h1 class="text-h3 font-weight-bold text-primary mb-2">404</h1>
          <h2 class="text-h5 font-weight-bold mb-4">Page Not Found</h2>
          
          <p class="text-body-1 text-grey-darken-1 mb-8">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>

          <BaseButton
            color="primary"
            size="large"
            rounded="md"
            prepend-icon="mdi-home"
            @click="goHome"
          >
            Back to Home
          </BaseButton>
        </BaseCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => {
  if (authStore.isAdmin) {
    router.push('/admin/dashboard')
  } else if (authStore.isAuthenticated) {
    router.push('/member/home')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
</style>
