<template>
  <v-container fluid class="fill-height bg-background">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <BaseCard elevation="0" rounded="md" class="pa-8 border-thin bg-white">
          <div v-if="!success && !error">
            <div class="text-center mb-8">
              <v-avatar color="primary-lighten-5" size="64" rounded="md" class="mb-4">
                <v-icon icon="mdi-shield-key-outline" color="primary" size="32" />
              </v-avatar>
              <h1 class="text-h5 font-weight-bold text-primary">Welcome!</h1>
              <p class="text-caption text-grey-darken-1">Set a password to activate your account.</p>
            </div>

            <v-form ref="form" v-model="isValid" @submit.prevent="handleSetPassword">
              <BaseInput
                v-model="password"
                label="New Password"
                :type="showPass ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPass = !showPass"
                :rules="[rules.required, rules.min]"
                class="mb-4"
              />

              <BaseInput
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                prepend-inner-icon="mdi-lock-check-outline"
                :rules="[rules.required, rules.match]"
                class="mb-6"
              />

              <BaseButton
                block
                color="primary"
                size="large"
                rounded="md"
                :loading="loading"
                :disabled="!isValid"
                type="submit"
              >
                Activate Account
              </BaseButton>
            </v-form>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center">
            <v-avatar color="error-lighten-5" size="64" class="mb-4">
              <v-icon icon="mdi-alert-circle-outline" color="error" size="32" />
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-error mb-2">Invalid or Expired Link</h2>
            <p class="text-body-2 text-grey-darken-1 mb-6">This invitation link is no longer valid. Please contact your administrator.</p>
            <BaseButton variant="text" color="primary" to="/login">Go to Login</BaseButton>
          </div>

          <!-- Success State -->
          <div v-else class="text-center">
            <v-avatar color="success-lighten-5" size="64" class="mb-4">
              <v-icon icon="mdi-check-decagram" color="success" size="32" />
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-success mb-2">Account Activated!</h2>
            <p class="text-body-2 text-grey-darken-1 mb-6">Your password has been set. You can now log in to the member app.</p>
            <BaseButton block color="primary" size="large" rounded="md" to="/login">
              Login to Member App
            </BaseButton>
          </div>
        </BaseCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const isValid = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref(null)
const showPass = ref(false)
const form = ref(null)

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
const token = route.query.token

const rules = {
  required: v => !!v || 'Required',
  min: v => v.length >= 8 || 'Minimum 8 characters',
  match: v => v === password.value || 'Passwords do not match'
}

const handleSetPassword = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // Use a clean axios instance to bypass global interceptors/tokens
    await axios.post(`${baseURL}/users/set-password`, {
      token: token,
      password: password.value
    })
    success.value = true
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Failed to set password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.border-thin { border: 1px solid rgba(121, 85, 72, 0.1) !important; }
</style>
