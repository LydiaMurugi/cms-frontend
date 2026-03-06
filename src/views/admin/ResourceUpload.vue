<template>
  <v-container fluid class="bg-background pa-6">

    <!-- ================= Header ================= -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          Resource Upload Center
        </h1>
        <p class="text-subtitle-1 text-grey">
          Manage sermon notes, study guides, and multi-media
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-card elevation="2" class="rounded-xl pa-2">

          <v-form ref="form" v-model="isFormValid">

            <v-card-text>

              <!-- Step 1 -->
              <div class="text-h6 font-weight-bold mb-4 text-primary">
                1. Select Resource File
              </div>

              <v-file-input
                v-model="resource.file"
                label="Upload file"
                variant="outlined"
                prepend-icon="mdi-cloud-upload"
                :rules="[rules.required]"
                show-size
                counter
              />

              <v-divider class="my-6" />

              <!-- Step 2 -->
              <div class="text-h6 font-weight-bold mb-4 text-primary">
                2. Resource Details
              </div>

              <v-row dense>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="resource.title"
                    label="Title"
                    variant="outlined"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="resource.category"
                    :items="RESOURCE_CATEGORIES"
                    label="Category"
                    variant="outlined"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="resource.description"
                    label="Description"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-6" />

              <!-- Step 3 -->
              <div class="text-h6 font-weight-bold mb-4 text-primary">
                3. Visibility
              </div>

              <v-switch
                v-model="resource.isPublic"
                color="secondary"
                :label="resource.isPublic ? 'Public' : 'Restricted'"
              />

              <v-select
                v-if="!resource.isPublic"
                v-model="resource.targetGroup"
                :items="memberStore.groups"
                label="Target Group"
                variant="outlined"
              />

              <v-progress-linear
                v-if="resourceStore.uploadProgress"
                :model-value="resourceStore.uploadProgress"
                height="6"
                color="primary"
                class="mt-4"
              />

            </v-card-text>

            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn variant="text" @click="resetForm">
                Clear
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!isFormValid"
                @click="submit"
              >
                Upload
              </v-btn>
            </v-card-actions>

          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success">
      Resource uploaded successfully
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useResourceStore } from '@/stores/resourceStore'
import { useMemberStore } from '@/stores/memberStore'
import { RESOURCE_CATEGORIES } from '@/constants/resourceConstants'

const resourceStore = useResourceStore()
const memberStore = useMemberStore()

const form = ref(null)
const isFormValid = ref(false)
const success = ref(false)

const resource = reactive({
  file: null,
  title: '',
  category: '',
  description: '',
  isPublic: true,
  targetGroup: null,
})

const rules = {
  required: v => !!v || 'Required',
}

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  await resourceStore.uploadResource({ ...resource })

  success.value = true
  resetForm()
}

const resetForm = () => {
  form.value.reset()
  resource.isPublic = true
}
</script>
