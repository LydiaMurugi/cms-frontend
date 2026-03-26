<template>
  <div class="admin-settings-view">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">
        {{ isImpersonating || !isSuperAdmin ? 'Church Settings' : 'Platform Settings' }}
      </h1>
      <p class="text-caption text-grey-darken-1">
        {{ isImpersonating || !isSuperAdmin 
          ? 'Configure branding and parameters for this specific church.' 
          : 'Configure global system parameters and platform-wide defaults.' 
        }}
      </p>
    </div>

    <v-row v-if="!hasPermission('manage_settings') && !isSuperAdmin">
       <v-col cols="12">
         <v-alert type="warning" variant="tonal" rounded="md">
           You do not have permission to modify these settings.
         </v-alert>
       </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" lg="8">
        
        <!-- ========================================== -->
        <!-- PLATFORM SETTINGS (Super Admin Only) -->
        <!-- ========================================== -->
        <template v-if="isSuperAdmin && !isImpersonating">
          <!-- Platform Identity -->
          <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Platform Identity">
            <div class="pa-2">
              <v-row dense>
                <v-col cols="12" md="6">
                  <BaseInput v-model="settings.churchName" label="Platform Name" placeholder="e.g. ChurchMS Global" />
                </v-col>
                <v-col cols="12" md="6">
                  <BaseInput v-model="settings.email" label="Support Email" placeholder="support@churchms.com" />
                </v-col>
              </v-row>
            </div>
          </BaseCard>

          <!-- System Controls -->
          <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="System Controls">
            <div class="pa-2">
              <v-row dense>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.maintenanceMode"
                    label="Global Maintenance Mode"
                    color="error"
                    inset
                    hide-details
                    class="mb-2"
                  />
                  <p class="text-caption text-grey ml-14">When enabled, all church portals will show a maintenance page. Only Super Admins can log in.</p>
                </v-col>
                <v-col cols="12" class="mt-4">
                  <v-switch
                    v-model="settings.allowNewRegistrations"
                    label="Allow Public Signups"
                    color="success"
                    inset
                    hide-details
                  />
                </v-col>
              </v-row>
            </div>
          </BaseCard>

          <!-- Global Defaults for New Churches -->
          <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Global Church Defaults">
            <div class="pa-2">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.defaultCurrency"
                    :items="CURRENCIES"
                    label="Default Church Currency"
                    variant="outlined"
                    density="comfortable"
                    rounded="md"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.defaultLanguage"
                    :items="['English', 'Spanish', 'French', 'Swahili']"
                    label="Default System Language"
                    variant="outlined"
                    density="comfortable"
                    rounded="md"
                  />
                </v-col>
              </v-row>
            </div>
          </BaseCard>
        </template>

        <!-- ========================================== -->
        <!-- CHURCH SETTINGS (Church Admin / Managed) -->
        <!-- ========================================== -->
        <template v-else>
          <!-- Church Branding -->
          <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Church Branding">
            <div class="pa-2">
              <v-row dense>
                <v-col cols="12" md="6">
                  <BaseInput v-model="settings.churchName" label="Church Name" />
                </v-col>
                <v-col cols="12" md="6">
                  <BaseInput v-model="settings.email" label="Official Email" />
                </v-col>
                
                <v-col cols="12" class="mt-2">
                  <div class="text-tiny font-weight-bold text-primary text-uppercase mb-2">Theme Primary Color</div>
                  <div class="d-flex align-center gap-4 mb-4">
                    <v-color-picker v-model="settings.primaryColor" hide-inputs show-swatches elevation="0" width="200" mode="hex" />
                    <div class="flex-grow-1">
                      <p class="text-caption text-medium-emphasis">This color defines the look of your specific church portal.</p>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-file-input label="Upload Church Logo" prepend-icon="mdi-camera" variant="outlined" density="comfortable" rounded="md" color="primary" @change="uploadLogo" />
                </v-col>
              </v-row>
            </div>
          </BaseCard>

          <!-- Financial Settings -->
          <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Financial Settings">
            <div class="pa-2">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select v-model="settings.currency" :items="CURRENCIES" label="Currency" variant="outlined" density="comfortable" rounded="md" color="primary" />
                </v-col>
                <v-col cols="12" md="6">
                  <BaseInput v-model="settings.taxId" label="Tax ID / Registration #" />
                </v-col>
              </v-row>
            </div>
          </BaseCard>
        </template>

        <!-- Actions -->
        <div class="d-flex gap-3 mt-8 px-2">
          <BaseButton color="primary" size="large" rounded="md" class="px-10" @click="save">
            Save Changes
          </BaseButton>
          <BaseButton variant="text" color="medium-emphasis">Cancel</BaseButton>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success" rounded="md" elevation="0">
      Settings saved successfully
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAuthStore } from '@/stores/authStore'
import { usePermissions } from '@/composables/usePermissions'
import { CURRENCIES } from '@/constants/settings'
import api from '@/plugins/axios'

const success = ref(false)
const settingsStore = useSettingsStore()
const auth = useAuthStore()
const { hasPermission, isSuperAdmin } = usePermissions()

const isImpersonating = computed(() => auth.isImpersonating)

// Local reactive settings to prevent direct store mutation before save
const settings = reactive({
  churchName: '',
  email: '',
  logoUrl: '',
  currency: 'USD',
  taxId: '',
  enableStripe: false,
  stripeKey: '',
  primaryColor: '#795548' // Default Scroll Brown
})

onMounted(async () => {
  if (hasPermission('manage_settings')) {
    await settingsStore.fetchSettings()
    // Populate local state
    Object.assign(settings, settingsStore.settings)
  }
})

const save = async () => {
  const result = await settingsStore.saveSettings(settings)
  if (result.success) {
    success.value = true
  }
}

const uploadLogo = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('logo', file)

  try {
    const res = await api.post('/settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    settings.logoUrl = res.data.url
  } catch (err) {
    console.error('Failed to upload logo:', err)
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.text-tiny {
  font-size: 0.65rem;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
