<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <!-- Brand -->
        <div class="text-center mb-8">
          <v-avatar color="primary" size="80" class="elevation-4 mb-4">
            <v-icon icon="mdi-church" size="48" color="white" />
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-primary">
            Church MS
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Management System
          </p>
        </div>

        <v-card elevation="8" class="pa-6 rounded-xl">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Login
          </v-card-title>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              placeholder="admin@church.com"
              type="email"
              required
              class="mb-2"
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              placeholder="••••••••"
              type="password"
              required
              class="mb-4"
            />

            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4 text-caption"
            >
              {{ errorMsg }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              elevation="2"
              class="font-weight-bold"
              :loading="authStore.loading"
            >
              Sign In
            </v-btn>
          </v-form>

          <v-card-actions class="justify-center mt-4">
            <v-btn variant="text" size="small" color="secondary">
              Forgot Password?
            </v-btn>
          </v-card-actions>
        </v-card>

        <p class="text-center mt-8 text-caption text-grey">
          © 2024 Your Church Name. All rights reserved.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''

  const result = await authStore.login(email.value, password.value)

  if (!result.success) {
    errorMsg.value = result.message
    return
  }

  // Role-based redirection
  if (authStore.role === 'admin' || authStore.role === 'leader') {
    router.push('/admin/dashboard')
  } else if (authStore.role === 'member') {
    router.push('/member/home')
  } else {
    // Fallback safety
    router.push('/')
  }
}
</script>

