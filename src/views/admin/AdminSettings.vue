<template>
  <div class="admin-settings-view">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">System Settings</h1>
      <p class="text-caption text-grey-darken-1">Configure global church parameters and multi-tenant branding</p>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <!-- Multi-Tenant Branding Section -->
        <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Church Branding">
          <div class="pa-2">
            <v-row dense>
              <v-col cols="12" md="6">
                <BaseInput v-model="settings.churchName" label="Church Name" placeholder="Your Church Name" :disabled="!hasPermission('manage_settings')" />
              </v-col>
              <v-col cols="12" md="6">
                <BaseInput v-model="settings.email" label="Official Email" placeholder="contact@church.com" :disabled="!hasPermission('manage_settings')" />
              </v-col>
              
              <v-col cols="12" class="mt-2">
                <div class="text-tiny font-weight-bold text-primary text-uppercase mb-2">Theme Primary Color</div>
                <div class="d-flex align-center gap-4 mb-4">
                  <v-color-picker 
                    v-model="settings.primaryColor" 
                    hide-inputs 
                    show-swatches 
                    elevation="0"
                    width="200"
                    mode="hex"
                    :disabled="!hasPermission('manage_settings')"
                  />
                  <div class="flex-grow-1">
                    <p class="text-caption text-medium-emphasis">This color will be used for buttons, icons, and highlights across the platform for your members.</p>
                    <div class="d-flex align-center gap-2 mt-2">
                      <div :style="{ backgroundColor: settings.primaryColor, width: '24px', height: '24px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }"></div>
                      <span class="text-caption font-weight-bold">{{ settings.primaryColor }}</span>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-if="hasPermission('manage_settings')"
                  label="Upload Church Logo"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  @change="uploadLogo"
                />
                <v-img
                  v-if="settings.logoUrl"
                  :src="settings.logoUrl"
                  max-height="100"
                  contain
                  class="mt-2 rounded-md border-thin bg-grey-lighten-5"
                />
              </v-col>
            </v-row>
          </div>
        </BaseCard>

        <!-- Financial Configuration -->
        <BaseCard elevation="0" rounded="md" class="mb-6 border-thin bg-white" title="Financial Settings">
          <div class="pa-2">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  v-model="settings.currency"
                  :items="CURRENCIES"
                  label="Default Currency"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  :disabled="!hasPermission('manage_settings')"
                />
              </v-col>
              <v-col cols="12" md="6">
                <BaseInput v-model="settings.taxId" label="Tax ID / Registration #" :disabled="!hasPermission('manage_settings')" />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.enableStripe"
                  label="Enable Online Giving (Stripe)"
                  color="success"
                  inset
                  :disabled="!hasPermission('manage_settings')"
                />
                <BaseInput
                  v-if="settings.enableStripe"
                  v-model="settings.stripeKey"
                  type="password"
                  label="Stripe API Key"
                  class="mt-2"
                  :disabled="!hasPermission('manage_settings')"
                />
              </v-col>
            </v-row>
          </div>
        </BaseCard>

        <!-- Actions -->
        <div v-if="hasPermission('manage_settings')" class="d-flex gap-3 mt-8 px-2">
          <BaseButton
            color="primary"
            size="large"
            rounded="md"
            class="px-10"
            @click="save"
          >
            Save Changes
          </BaseButton>
          <BaseButton variant="text" color="medium-emphasis">Cancel</BaseButton>
        </div>
        <div v-else class="mt-8 px-2 text-caption text-grey italic">
          You do not have permission to modify system settings.
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success" rounded="md" elevation="0">
      Settings saved successfully
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePermissions } from '@/composables/usePermissions'
import { CURRENCIES } from '@/constants/settings'
import api from '@/plugins/axios'

const success = ref(false)
const settingsStore = useSettingsStore()
const { hasPermission } = usePermissions()

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
