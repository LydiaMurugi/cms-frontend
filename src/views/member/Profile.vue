<template>
  <v-container class="pa-6 pa-md-10" max-width="700">

    <!-- Banner Card -->
    <v-card rounded="xl" elevation="0" class="mb-6 banner-card">
      <div class="banner-bg" />
      <v-card-text class="d-flex flex-column align-center py-8">

        <v-avatar size="96" class="avatar-ring mb-3">
          <v-img v-if="auth.user?.avatar" :src="auth.user.avatar" :alt="auth.user.name" />
          <span v-else class="text-h4 font-weight-bold text-white">{{ initials }}</span>
        </v-avatar>

        <h2 class="text-h5 font-weight-bold mt-1">{{ auth.user?.name }}</h2>
        <p class="text-medium-emphasis text-body-2">{{ auth.user?.email }}</p>

        <!-- Role + Status chips -->
        <div class="d-flex gap-2 mt-3 flex-wrap justify-center">
          <v-chip
            v-if="auth.user?.role"
            :color="roleColor"
            variant="tonal"
            size="small"
            prepend-icon="mdi-shield-account"
          >
            {{ capitalize(auth.user.role) }}
          </v-chip>

          <v-chip
            :color="auth.user?.status === 'Active' ? 'success' : 'warning'"
            variant="tonal"
            size="small"
            prepend-icon="mdi-circle-medium"
          >
            {{ auth.user?.status || 'Active' }}
          </v-chip>

          <v-chip
            v-if="auth.user?.ministry_group"
            color="secondary"
            variant="tonal"
            size="small"
            prepend-icon="mdi-account-group"
          >
            {{ auth.user.ministry_group }}
          </v-chip>
        </div>

      </v-card-text>
    </v-card>

    <!-- DISPLAY MODE -->
    <template v-if="!editMode">

      <!-- Personal Info -->
      <v-card rounded="xl" elevation="1" class="mb-5">
        <v-card-title class="section-label">Personal Information</v-card-title>

        <v-list lines="two" class="px-2">

          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Full Name"
            :subtitle="auth.user?.name || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-email-outline"
            title="Email Address"
            :subtitle="auth.user?.email || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-phone-outline"
            title="Phone Number"
            :subtitle="auth.user?.phone || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-map-marker-outline"
            title="Address"
            :subtitle="auth.user?.address || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-cake-variant-outline"
            title="Date of Birth"
            :subtitle="formatDate(auth.user?.birthdate) || '—'"
            rounded="lg"
          />

        </v-list>
      </v-card>

      <!-- Church Info -->
      <v-card rounded="xl" elevation="1" class="mb-5">
        <v-card-title class="section-label">Church Details</v-card-title>

        <v-list lines="two" class="px-2">

          <v-list-item
            prepend-icon="mdi-shield-account-outline"
            title="Role"
            :subtitle="capitalize(auth.user?.role) || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-account-group-outline"
            title="Ministry Group"
            :subtitle="auth.user?.ministry_group || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-calendar-check-outline"
            title="Date Joined"
            :subtitle="formatDate(auth.user?.joined) || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-calendar-outline"
            title="Account Created"
            :subtitle="memberSince || '—'"
            rounded="lg"
          />
          <v-divider inset />

          <v-list-item
            prepend-icon="mdi-circle-outline"
            title="Status"
            rounded="lg"
          >
            <template #subtitle>
              <v-chip
                :color="auth.user?.status === 'Active' ? 'success' : 'warning'"
                variant="tonal"
                size="x-small"
                class="mt-1"
              >
                {{ auth.user?.status || 'Active' }}
              </v-chip>
            </template>
          </v-list-item>

        </v-list>
      </v-card>

      <!-- Actions -->
      <v-card rounded="xl" elevation="1">
        <v-card-actions class="px-6 py-4 gap-3">
          <v-btn
            variant="tonal"
            color="primary"
            prepend-icon="mdi-pencil-outline"
            rounded="lg"
            class="flex-grow-1"
            @click="editMode = true"
          >
            Edit Profile
          </v-btn>
          <v-btn
            variant="tonal"
            color="error"
            prepend-icon="mdi-logout"
            rounded="lg"
            class="flex-grow-1"
            @click="handleLogout"
          >
            Sign Out
          </v-btn>
        </v-card-actions>
      </v-card>

    </template>

    <!-- EDIT MODE -->
    <template v-else>

      <v-card rounded="xl" elevation="1">
        <v-card-title class="section-label">Edit Profile</v-card-title>

        <v-card-text class="pa-6">
          <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
          </v-alert>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editForm.name"
              label="Full Name"
              prepend-icon="mdi-account-outline"
              :rules="nameRules"
              required
              outlined
              rounded="lg"
              class="mb-4"
            />

            <v-text-field
              v-model="editForm.email"
              label="Email Address"
              type="email"
              prepend-icon="mdi-email-outline"
              :rules="emailRules"
              required
              outlined
              rounded="lg"
              class="mb-4"
            />

            <v-text-field
              v-model="editForm.phone"
              label="Phone Number"
              prepend-icon="mdi-phone-outline"
              outlined
              rounded="lg"
              class="mb-4"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-5 pt-3 gap-3">
          <v-btn
            variant="outlined"
            color="medium-emphasis"
            rounded="lg"
            class="flex-grow-1"
            @click="cancelEdit"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="auth.loading"
            :disabled="!valid"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-content-save-outline"
            rounded="lg"
            class="flex-grow-1"
            @click="saveProfile"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>

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
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const memberSince = computed(() => formatDate(auth.user?.created_at))

const roleColor = computed(() => {
  const map = { admin: 'error', leader: 'primary', treasurer: 'warning', member: 'secondary' }
  return map[auth.user?.role] || 'primary'
})

// Lifecycle
onMounted(() => {
  // Pre-fill form with current user data
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

const formatDate = (val) => {
  if (!val) return null
  return new Date(val).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleLogout = () => {
  auth.logout()
  router.replace('/login')
}

const cancelEdit = () => {
  editMode.value = false
  error.value = null
  // Reset form to current user data
  if (auth.user) {
    editForm.name = auth.user.name || ''
    editForm.email = auth.user.email || ''
    editForm.phone = auth.user.phone || ''
  }
}

const saveProfile = async () => {
  // Validate form first
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
.banner-card {
  background: linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%);
  border: 1px solid #e0e7ff;
  position: relative;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top, #c7d2fe 0%, transparent 70%);
  opacity: 0.4;
  pointer-events: none;
}

.avatar-ring {
  background: linear-gradient(135deg, #6366f1, #818cf8);
  box-shadow: 0 0 0 4px white, 0 0 0 6px #c7d2fe;
}

.section-label {
  padding: 18px 24px 6px;
  font-size: 0.7rem !important;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  text-transform: uppercase;
}
</style>