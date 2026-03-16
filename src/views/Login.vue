<template>
  <v-container fluid class="fill-height bg-background">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <!-- Brand -->
        <div class="text-center mb-8">
          <v-avatar color="primary" size="80" rounded="md" class="mb-4">
            <v-icon icon="mdi-church" size="48" color="white" />
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-primary">
            Church MS
          </h1>
          <p class="text-subtitle-1 text-grey-darken-2">
            Management System
          </p>
        </div>

        <BaseCard rounded="md" class="pa-6 border-thin bg-surface" title="Login">
          <v-form @submit.prevent="handleLogin">
            <BaseInput
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              placeholder="admin@church.com"
              type="email"
              required
              persistent-placeholder
            />

            <BaseInput
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              placeholder="••••••••"
              type="password"
              required
              persistent-placeholder
            />

            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="compact"
              rounded="md"
              class="mb-4 text-caption"
            >
              {{ errorMsg }}
            </v-alert>

            <BaseButton
              type="submit"
              size="large"
              block
              rounded="md"
              class="font-weight-bold"
              :loading="authStore.loading"
            >
              Sign In
            </BaseButton>
          </v-form>

          <template #actions>
            <div class="w-100 text-center">
              <BaseButton variant="text" size="small" color="secondary" @click="handleForgotPassword">
                Forgot Password?
              </BaseButton>
            </div>
          </template>
        </BaseCard>

        <p class="text-center mt-8 text-caption text-grey-darken-1">
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

const handleForgotPassword = () => {
  // Logic for password recovery
  alert('Redirecting to password recovery...')
}

const handleLogin = async () => {
  errorMsg.value = ''

  const result = await authStore.login(email.value, password.value)

  if (!result.success) {
    errorMsg.value = result.message
    return
  }

  // Role-based redirection
  if (authStore.isAdmin) {
    router.push('/admin/dashboard')
  } else if (authStore.isMember) {
    router.push('/member/home')
  } else {
    // Fallback safety
    router.push('/')
  }
}
</script>

<style scoped>
.bg-background {
  background-color: var(--color-background) !important;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
</style>
