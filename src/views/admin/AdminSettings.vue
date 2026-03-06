<template>
  <v-container fluid class="bg-background pa-6">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-primary">
          System Settings
        </h1>
        <p class="text-subtitle-1 text-grey">
          Configure global church parameters and integrations
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- MAIN SETTINGS -->
      <v-col cols="12" lg="8">
        <v-expansion-panels
          v-model="panel"
          multiple
          variant="accordion"
          class="rounded-xl overflow-hidden"
        >
          <!-- Church Branding -->
          <v-expansion-panel>
            <v-expansion-panel-title class="font-weight-bold py-4">
              <v-icon icon="mdi-church" color="primary" class="mr-4" />
              Church Profile & Branding
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pa-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.churchName"
                    label="Church Name"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.email"
                    label="Official Email"
                  />
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    label="Upload Logo"
                    prepend-icon="mdi-camera"
                    @change="uploadLogo"
                  />
                  <v-img
                    v-if="settings.logoUrl"
                    :src="settings.logoUrl"
                    max-height="120"
                    class="mt-2 rounded-lg"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Financial -->
          <v-expansion-panel>
            <v-expansion-panel-title class="font-weight-bold py-4">
              <v-icon icon="mdi-finance" color="success" class="mr-4" />
              Financial Configuration
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pa-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.currency"
                    :items="CURRENCIES"
                    label="Default Currency"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.taxId"
                    label="Tax ID / Registration #"
                  />
                </v-col>

                <v-col cols="12">
                  <v-switch
                    v-model="settings.enableStripe"
                    label="Enable Online Giving (Stripe)"
                    color="success"
                  />
                  <v-text-field
                    v-if="settings.enableStripe"
                    v-model="settings.stripeKey"
                    type="password"
                    label="Stripe API Key"
                    class="mt-2"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div class="mt-8 d-flex ga-4">
          <v-btn color="primary" size="large" @click="save">
            Save Changes
          </v-btn>
          <v-btn variant="outlined">Cancel</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success">
      Settings saved successfully
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { CURRENCIES } from '@/constants/settings'
import api from '@/plugins/axios'

const panel = ref([0])
const success = ref(false)
const settingsStore = useSettingsStore()
const { settings } = settingsStore

// Fetch existing settings on mount
onMounted(async () => {
  await settingsStore.fetchSettings()
})

// Save settings
const save = async () => {
  const result = await settingsStore.saveSettings()
  if (result.success) {
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  }
}

// Upload church logo
const uploadLogo = async (file) => {
  if (!file) return

  const formData = new FormData()
  formData.append('logo', file)

  try {
    const res = await api.post('/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Update logo URL in store
    settings.logoUrl = res.data.url
    console.log('Logo uploaded successfully')
  } catch (err) {
    console.error('Failed to upload logo:', err)
  }
}
</script>
