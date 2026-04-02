<template>
  <v-container class="pa-4 pa-md-6 main-content-container">

    <!-- Profile Banner & Avatar -->
    <BaseCard rounded="md" elevation="0" class="mb-6 border-thin bg-white overflow-hidden">
      <div class="profile-banner"></div>
      <v-card-text class="d-flex flex-column align-center py-6 mt-n12">
        <div class="position-relative">
          <v-avatar size="100" color="primary" class="mb-3 border-4 border-white shadow-lg rounded-lg">
            <v-img v-if="auth.user?.avatar" :src="auth.user.avatar" cover />
            <span v-else class="text-h4 font-weight-bold text-white">{{ initials }}</span>
          </v-avatar>
          <v-btn
            icon="mdi-camera"
            size="x-small"
            color="secondary"
            class="avatar-edit-btn"
            @click="triggerAvatarUpload"
            :loading="uploadingAvatar"
          />
          <input type="file" ref="avatarInput" class="d-none" accept="image/*" @change="handleAvatarChange" />
        </div>

        <h2 class="text-h6 font-weight-bold mt-2 text-primary">{{ auth.user?.name }}</h2>
        <p class="text-caption text-medium-emphasis">{{ auth.user?.email }}</p>

        <div class="d-flex gap-2 mt-4 flex-wrap justify-center">
          <v-chip color="primary" variant="tonal" size="x-small" rounded="md" prepend-icon="mdi-shield-account">
            {{ auth.user?.role }}
          </v-chip>
          <v-chip :color="auth.user?.status === 'Active' ? 'success' : 'warning'" variant="tonal" size="x-small" rounded="md" prepend-icon="mdi-circle-medium">
            {{ auth.user?.status || 'Active' }}
          </v-chip>
        </div>
      </v-card-text>
    </BaseCard>

    <!-- Profile Sections -->
    <v-tabs v-model="activeTab" color="primary" grow class="mb-6 border-b">
      <v-tab value="personal" class="text-none font-weight-bold">Personal Info</v-tab>
      <v-tab value="security" class="text-none font-weight-bold">Security</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Personal Info Tab -->
      <v-window-item value="personal">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white pa-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="text-subtitle-1 font-weight-bold text-primary">Details</div>
            <BaseButton v-if="!editMode" variant="text" size="small" prepend-icon="mdi-pencil" @click="editMode = true">Edit</BaseButton>
          </div>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row dense>
              <v-col cols="12" sm="6">
                <BaseInput v-model="editForm.name" label="Full Name" :readonly="!editMode" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseInput v-model="editForm.email" label="Email Address" readonly hint="Email cannot be changed" />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseInput v-model="editForm.phone" label="Phone Number" :readonly="!editMode" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editForm.gender"
                  :items="['Male', 'Female', 'Other']"
                  label="Gender"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  :readonly="!editMode"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseInput v-model="editForm.birthdate" label="Date of Birth" type="date" :readonly="!editMode" />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.address"
                  label="Home Address"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  rows="2"
                  :readonly="!editMode"
                  color="primary"
                />
              </v-col>
            </v-row>

            <div v-if="editMode" class="d-flex gap-2 mt-6">
              <v-spacer />
              <BaseButton variant="text" color="medium-emphasis" @click="cancelEdit">Cancel</BaseButton>
              <BaseButton color="primary" :loading="auth.loading" @click="saveProfile">Save Profile</BaseButton>
            </div>
          </v-form>
        </BaseCard>
      </v-window-item>

      <!-- Security Tab -->
      <v-window-item value="security">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white pa-6" title="Update Password">
          <p class="text-caption text-medium-emphasis mb-6">Enter your new password below to update your account security.</p>
          
          <BaseInput v-model="passwords.new" label="New Password" type="password" class="mb-4" />
          <BaseInput v-model="passwords.confirm" label="Confirm New Password" type="password" class="mb-6" />
          
          <BaseButton block color="primary" variant="tonal" :disabled="!passwords.new" @click="handlePasswordChange">Update Password</BaseButton>
        </BaseCard>

        <BaseButton block variant="text" color="error" class="mt-6" prepend-icon="mdi-logout" @click="handleLogout">Sign Out of All Devices</BaseButton>
      </v-window-item>
    </v-window>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" color="success" timeout="3000" rounded="md" elevation="0">
      Profile updated successfully!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { uploadImage } from '@/services/cloudinaryService'

const auth = useAuthStore()
const router = useRouter()

const activeTab = ref('personal')
const editMode = ref(false)
const valid = ref(false)
const form = ref(null)
const avatarInput = ref(null)
const uploadingAvatar = ref(false)
const snackbar = ref(false)

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthdate: '',
  address: '',
})

const passwords = reactive({
  new: '',
  confirm: '',
})

const rules = {
  required: v => !!v || 'Required',
}

const initials = computed(() => {
  if (!auth.user?.name) return '?'
  return auth.user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

onMounted(() => {
  if (auth.user) {
    Object.assign(editForm, {
      name: auth.user.name || '',
      email: auth.user.email || '',
      phone: auth.user.phone || '',
      gender: auth.user.gender || '',
      birthdate: auth.user.birthdate ? new Date(auth.user.birthdate).toISOString().split('T')[0] : '',
      address: auth.user.address || '',
    })
  }
})

const triggerAvatarUpload = () => avatarInput.value.click()

const handleAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const url = await uploadImage(file)
    await auth.updateProfile({ avatar: url })
    snackbar.value = true
  } catch (err) {
    console.error(err)
  } finally {
    uploadingAvatar.value = false
  }
}

const saveProfile = async () => {
  const result = await auth.updateProfile({ ...editForm })
  if (result.success) {
    editMode.value = false
    snackbar.value = true
  }
}

const handlePasswordChange = async () => {
  if (passwords.new !== passwords.confirm) {
    alert('Passwords do not match')
    return
  }
  const result = await auth.changePassword(passwords.new)
  if (result.success) {
    passwords.new = ''
    passwords.confirm = ''
    alert('Password updated successfully')
  }
}

const cancelEdit = () => {
  editMode.value = false
  // Reset form data from store
  onMounted() 
}

const handleLogout = () => {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
.profile-banner {
  height: 100px;
  background: linear-gradient(135deg, #5D4037 0%, #795548 100%);
}
.border-thin { border: 1px solid rgba(121, 85, 72, 0.1) !important; }
.shadow-lg { box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
.avatar-edit-btn {
  position: absolute;
  bottom: 15px;
  right: 0;
  border: 2px solid white !important;
}
.main-content-container { max-width: 700px; margin: 0 auto; }
.gap-2 { gap: 8px; }
</style>
