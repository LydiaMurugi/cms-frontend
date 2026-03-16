<template>
  <v-container fluid class="fill-height bg-background">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <BaseCard elevation="0" rounded="md" class="pa-6 border-thin bg-white">
          <!-- Progress Indicator -->
          <v-progress-linear
            v-model="progress"
            color="primary"
            height="4"
            rounded="pill"
            class="mb-6"
          />

          <div class="text-center mb-6">
            <v-avatar color="primary-lighten-5" size="56" rounded="md" class="mb-3">
              <v-icon
                icon="mdi-account-plus"
                size="28"
                color="primary"
              />
            </v-avatar>
            <h1 class="text-h5 font-weight-bold text-primary">
              Member Registration
            </h1>
            <p class="text-caption text-grey-darken-1">
              Create a new profile in the church database
            </p>
          </div>

          <v-form
            ref="form"
            v-model="isFormValid"
            @submit.prevent="handleRegister"
          >
            <v-row dense>
              <!-- Personal Details -->
              <v-col cols="12" sm="6">
                <BaseInput
                  v-model="formData.firstName"
                  label="First Name"
                  placeholder="John"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-account-outline"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <BaseInput
                  v-model="formData.lastName"
                  label="Last Name"
                  placeholder="Doe"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-account-outline"
                />
              </v-col>

              <v-col cols="12">
                <BaseInput
                  v-model="formData.email"
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email-outline"
                />
              </v-col>

              <v-col cols="12">
                <BaseInput
                  v-model="formData.phone"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  prepend-inner-icon="mdi-phone-outline"
                />
              </v-col>

              <!-- Interest Group Selection -->
              <v-col cols="12">
                <v-select
                  v-model="formData.group"
                  :items="memberStore.groups"
                  label="Assign to Church Group"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  prepend-inner-icon="mdi-account-group-outline"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12">
                <BaseInput
                  v-model="formData.password"
                  label="Initial Password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  @click:append-inner="showPassword = !showPassword"
                  prepend-inner-icon="mdi-lock-outline"
                  :rules="[rules.required, rules.min]"
                />
              </v-col>
            </v-row>

            <BaseButton
              type="submit"
              color="primary"
              block
              size="large"
              class="mt-6"
              rounded="md"
              :loading="loading"
              :disabled="!isFormValid"
            >
              Create Account
            </BaseButton>

            <div class="text-center mt-4">
              <span class="text-caption text-grey-darken-1">
                Already have an account?
              </span>
              <BaseButton
                variant="text"
                color="secondary"
                size="small"
                to="/login"
                class="px-1"
              >
                Login here
              </BaseButton>
            </div>
          </v-form>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar v-model="successMsg" color="success" timeout="3000" rounded="md" elevation="0">
      Member registered successfully!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMemberStore } from '@/stores/memberStore'
import { useRouter } from 'vue-router'

const memberStore = useMemberStore()
const router = useRouter()

const form = ref(null)
const isFormValid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const successMsg = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  group: '',
  password: '',
  status: 'Active',
})

// Progress calculation based on filled fields
const progress = computed(() => {
  const fields = Object.values(formData).filter(v => v !== '')
  return (fields.length / Object.keys(formData).length) * 100
})

const rules = {
  required: value => !!value || 'Field is required.',
  min: v => v.length >= 8 || 'Min 8 characters',
  email: value => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
}

const handleRegister = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    // set loading properly on the ref
    loading.value = true

    try {
      // include phone and password so the backend receives a complete payload
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        group: formData.group,
        status: 'Active',
      }

      await memberStore.addMember(payload)
      successMsg.value = true

      setTimeout(() => {
        router.push('/admin/members')
      }, 1500)
    } finally {
      loading.value = false
    }
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
</style>
