<template>
  <v-container class="pa-4 pa-md-6 main-content-container">

    <!-- Banner Card with Avatar - Scroll Theme -->
    <BaseCard rounded="md" elevation="0" class="mb-6 border-thin bg-white">
      <v-card-text class="d-flex flex-column align-center py-6">

        <v-avatar size="80" color="primary" class="mb-3 rounded-lg">
          <v-img
            v-if="auth.user?.avatar"
            :src="auth.user.avatar"
            :alt="auth.user.name"
          />
          <span v-else class="text-h4 font-weight-bold text-white">
            {{ initials }}
          </span>
        </v-avatar>

        <h2 class="text-h6 font-weight-bold mt-2 text-primary">{{ auth.user?.name }}</h2>
        <p class="text-caption text-medium-emphasis">{{ auth.user?.email }}</p>

        <!-- Role + Status chips -->
        <div class="d-flex gap-2 mt-4 flex-wrap justify-center">
          <v-chip
            v-if="auth.user?.role"
            color="primary"
            variant="tonal"
            size="x-small"
            rounded="md"
            prepend-icon="mdi-shield-account"
          >
            {{ capitalize(auth.user.role) }}
          </v-chip>

          <v-chip
            :color="auth.user?.status === 'Active' ? 'success' : 'warning'"
            variant="tonal"
            size="x-small"
            rounded="md"
            prepend-icon="mdi-circle-medium"
          >
            {{ auth.user?.status || 'Active' }}
          </v-chip>
        </div>

      </v-card-text>
    </BaseCard>

    <!-- DISPLAY MODE -->
    <template v-if="!editMode">

      <!-- Personal Info -->
      <BaseCard title="Personal Information" elevation="0" rounded="md" class="mb-4 border-thin bg-white">
        <v-list lines="two" class="pa-0 bg-transparent">
          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Full Name"
            :subtitle="auth.user?.name || '—'"
          />
          <v-divider class="border-opacity-25" />

          <v-list-item
            prepend-icon="mdi-email-outline"
            title="Email Address"
            :subtitle="auth.user?.email || '—'"
          />
          <v-divider class="border-opacity-25" />

          <v-list-item
            prepend-icon="mdi-phone-outline"
            title="Phone Number"
            :subtitle="auth.user?.phone || '—'"
          />
        </v-list>
      </BaseCard>

      <!-- Actions - Standardized Tonal Buttons -->
      <div class="d-flex gap-3 mt-6">
        <BaseButton
          variant="tonal"
          color="primary"
          size="small"
          rounded="md"
          class="flex-grow-1"
          @click="editMode = true"
        >
          Edit Profile
        </BaseButton>
        <BaseButton
          variant="tonal"
          color="error"
          size="small"
          rounded="md"
          class="flex-grow-1"
          @click="handleLogout"
        >
          Sign Out
        </BaseButton>
      </div>

    </template>

    <!-- EDIT MODE -->
    <template v-else>
      <BaseCard title="Edit Profile" elevation="0" rounded="md" class="border-thin bg-white">
        <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
          {{ error }}
        </v-alert>

        <v-form ref="form" v-model="valid" lazy-validation class="pa-2">
          <BaseInput
            v-model="editForm.name"
            label="Full Name"
            :rules="nameRules"
            class="mb-3"
          />

          <BaseInput
            v-model="editForm.email"
            label="Email Address"
            type="email"
            :rules="emailRules"
            class="mb-3"
          />

          <BaseInput
            v-model="editForm.phone"
            label="Phone Number"
            class="mb-3"
          />
        </v-form>

        <template #actions>
          <div class="d-flex gap-2 w-100">
            <BaseButton
              variant="text"
              color="medium-emphasis"
              size="small"
              rounded="md"
              class="flex-grow-1"
              @click="cancelEdit"
            >
              Cancel
            </BaseButton>
            <BaseButton
              :loading="auth.loading"
              :disabled="!valid"
              variant="tonal"
              color="primary"
              size="small"
              rounded="md"
              class="flex-grow-1"
              @click="saveProfile"
            >
              Save Changes
            </BaseButton>
          </div>
        </template>
      </BaseCard>
    </template>

  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// State
const editMode = ref(false)
const valid = ref(false)
const error = ref(null)
const form = ref(null)

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
})

// Validation rules
const nameRules = [
  (v) => !!v || 'Name is required',
  (v) => (v && v.length >= 2) || 'Name must be at least 2 characters',
]

const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

// Computed
const initials = computed(() => {
  if (!auth.user?.name) return '?'
  return auth.user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// Lifecycle
onMounted(() => {
  if (auth.user) {
    editForm.name = auth.user.name || ''
    editForm.email = auth.user.email || ''
    editForm.phone = auth.user.phone || ''
  }
})

// Methods
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleLogout = () => {
  auth.logout()
  router.replace('/login')
}

const cancelEdit = () => {
  editMode.value = false
  error.value = null
  if (auth.user) {
    editForm.name = auth.user.name || ''
    editForm.email = auth.user.email || ''
    editForm.phone = auth.user.phone || ''
  }
}

const saveProfile = async () => {
  const isValid = await form.value.validate()
  if (!isValid) return

  error.value = null
  const { success } = await auth.updateProfile({
    name: editForm.name,
    email: editForm.email,
    phone: editForm.phone,
  })

  if (success) {
    editMode.value = false
  } else {
    error.value = auth.error || 'Failed to update profile'
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.main-content-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
