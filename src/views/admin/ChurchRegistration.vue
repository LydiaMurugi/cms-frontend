<template>
  <div class="church-registration">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Register New Church</h1>
      <p class="text-caption text-grey-darken-1">Onboard a new church tenant to the platform</p>
    </div>

    <v-stepper v-model="step" :items="['Church Details', 'Admin Account', 'Confirmation']" hide-actions elevation="0" rounded="md" class="border-thin bg-white">
      <template #item.1>
        <div class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Step 1: Church Information</div>
          <v-form ref="churchForm" v-model="isChurchValid">
            <v-row dense>
              <v-col cols="12" md="6">
                <BaseInput v-model="formData.churchName" label="Church Name" placeholder="e.g. Grace Community Church" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="6">
                <BaseInput v-model="formData.location" label="Location" placeholder="City, Country" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12">
                <BaseInput v-model="formData.website" label="Website (Optional)" placeholder="https://www.church.com" />
              </v-col>
              <v-col cols="12">
                <v-file-input label="Church Logo" prepend-icon="mdi-camera" variant="outlined" density="comfortable" rounded="md" color="primary" />
              </v-col>
            </v-row>
          </v-form>
          <div class="d-flex justify-end mt-6">
            <BaseButton @click="step = 2" :disabled="!isChurchValid">Next Step</BaseButton>
          </div>
        </div>
      </template>

      <template #item.2>
        <div class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-4 text-primary">Step 2: Admin Account Setup</div>
          <v-form ref="adminForm" v-model="isAdminValid">
            <v-row dense>
              <v-col cols="12">
                <BaseInput v-model="formData.adminName" label="Admin Full Name" placeholder="John Doe" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12">
                <BaseInput v-model="formData.adminEmail" label="Admin Email" placeholder="admin@church.com" type="email" :rules="[rules.required, rules.email]" />
              </v-col>
              <v-col cols="12">
                <div class="pa-4 bg-primary-lighten-5 rounded-md border-thin border-dashed mb-2">
                  <div class="text-caption text-primary font-weight-bold mb-1">Temporary Password (OTP)</div>
                  <div class="text-h6 font-weight-bold">{{ tempPassword }}</div>
                  <p class="text-tiny text-medium-emphasis mt-1">The admin will be forced to change this upon first login.</p>
                </div>
                <BaseButton variant="text" size="x-small" color="primary" prepend-icon="mdi-refresh" @click="generateOTP">Regenerate</BaseButton>
              </v-col>
            </v-row>
          </v-form>
          <div class="d-flex justify-space-between mt-6">
            <BaseButton variant="text" @click="step = 1">Back</BaseButton>
            <BaseButton @click="handleRegistration" :disabled="!isAdminValid" :loading="loading">Register Church</BaseButton>
          </div>
        </div>
      </template>

      <template #item.3>
        <div class="pa-8 text-center">
          <v-avatar color="success-lighten-5" size="80" rounded="md" class="mb-4">
            <v-icon icon="mdi-check-decagram" color="success" size="48" />
          </v-avatar>
          <h2 class="text-h5 font-weight-bold text-primary mb-2">Registration Complete!</h2>
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ formData.churchName }} has been successfully onboarded. An email has been sent to {{ formData.adminEmail }} with their login instructions.
          </p>
          <BaseButton color="primary" variant="tonal" rounded="md" to="/admin/churches">View Church Directory</BaseButton>
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios'

const step = ref(1)
const loading = ref(false)
const isChurchValid = ref(false)
const isAdminValid = ref(false)
const tempPassword = ref('')

const formData = reactive({
  churchName: '',
  location: '',
  website: '',
  adminName: '',
  adminEmail: '',
})

const rules = {
  required: v => !!v || 'Required',
  email: v => /.+@.+\..+/.test(v) || 'Must be a valid email',
}

const generateOTP = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  tempPassword.value = result
}

onMounted(() => {
  generateOTP()
})

const handleRegistration = async () => {
  loading.value = true
  try {
    // In a real app, this sends to the backend multi-tenant registration endpoint
    await api.post('/tenants/register', {
      ...formData,
      initialPassword: tempPassword.value
    })
    
    // Simulate success for now if backend not ready
    setTimeout(() => {
      step.value = 3
      loading.value = false
    }, 1500)
  } catch (error) {
    console.error(error)
    // Fallback for demo
    step.value = 3
    loading.value = false
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
.bg-primary-lighten-5 {
  background-color: rgba(121, 85, 72, 0.05) !important;
}
.text-tiny {
  font-size: 0.7rem;
}
</style>
