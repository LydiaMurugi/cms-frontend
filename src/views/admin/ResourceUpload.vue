<template>
  <div class="resource-upload-view">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Resource Upload Center</h1>
      <p class="text-caption text-grey-darken-1">Manage sermon notes, study guides, and multi-media</p>
    </div>

    <v-row justify="center">
      <v-col cols="12" lg="8">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white pa-4">
          <v-form ref="form" v-model="isFormValid">
            <!-- Step 1: File -->
            <div class="text-subtitle-2 font-weight-bold mb-4 text-primary d-flex align-center">
              <v-icon icon="mdi-numeric-1-circle" class="mr-2" />
              Select Resource File
            </div>

            <v-file-input
              v-model="file"
              label="Choose image or document"
              variant="outlined"
              prepend-icon="mdi-cloud-upload"
              rounded="md"
              density="comfortable"
              color="primary"
              :rules="[rules.required]"
              show-size
              @update:model-value="handleFilePreview"
            />

            <!-- Preview if it's an image -->
            <div v-if="previewUrl" class="mt-4 mb-6 text-center">
              <v-img :src="previewUrl" max-height="200" rounded="md" class="border-thin mx-auto bg-grey-lighten-4" />
              <BaseButton variant="text" size="x-small" color="error" class="mt-2" @click="clearPreview">
                Remove Image
              </BaseButton>
            </div>

            <v-divider class="my-6 border-opacity-25" />

            <!-- Step 2: Details -->
            <div class="text-subtitle-2 font-weight-bold mb-4 text-primary d-flex align-center">
              <v-icon icon="mdi-numeric-2-circle" class="mr-2" />
              Resource Details
            </div>

            <v-row dense>
              <v-col cols="12" md="8">
                <BaseInput
                  v-model="resource.title"
                  label="Title"
                  placeholder="e.g. Sunday Sermon Notes"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="resource.category"
                  :items="RESOURCE_CATEGORIES"
                  label="Category"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="resource.description"
                  label="Description"
                  variant="outlined"
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  rows="3"
                />
              </v-col>
            </v-row>

            <v-divider class="my-6 border-opacity-25" />

            <!-- Step 3: Visibility -->
            <div class="text-subtitle-2 font-weight-bold mb-4 text-primary d-flex align-center">
              <v-icon icon="mdi-numeric-3-circle" class="mr-2" />
              Visibility & Permissions
            </div>

            <v-switch
              v-model="resource.isPublic"
              color="primary"
              inset
              :label="resource.isPublic ? 'Visible to all members' : 'Restricted to group'"
              class="ml-2"
            />

            <v-select
              v-if="!resource.isPublic"
              v-model="resource.targetGroup"
              :items="memberStore.groups"
              label="Select Target Group"
              variant="outlined"
              density="comfortable"
              rounded="md"
              color="primary"
              class="mt-2"
            />

            <!-- Progress -->
            <v-expand-transition>
              <div v-if="uploading" class="mt-6">
                <div class="text-caption font-weight-bold mb-1 d-flex justify-space-between">
                  <span>Uploading to Cloudinary...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
                <v-progress-linear
                  v-model="uploadProgress"
                  height="8"
                  color="success"
                  rounded="pill"
                  striped
                />
              </div>
            </v-expand-transition>

            <!-- Actions -->
            <div class="d-flex gap-3 mt-8">
              <v-spacer />
              <BaseButton variant="text" color="medium-emphasis" @click="resetForm">
                Clear
              </BaseButton>
              <BaseButton
                color="primary"
                :loading="uploading"
                :disabled="!isFormValid"
                class="px-8"
                @click="submit"
              >
                Start Upload
              </BaseButton>
            </div>
          </v-form>
        </BaseCard>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success" rounded="md" elevation="0">
      Resource uploaded and hosted on Cloudinary!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useResourceStore } from '@/stores/resourceStore'
import { useMemberStore } from '@/stores/memberStore'
import { RESOURCE_CATEGORIES } from '@/constants/resourceConstants'
import { uploadImage } from '@/services/cloudinaryService'

const resourceStore = useResourceStore()
const memberStore = useMemberStore()

const form = ref(null)
const isFormValid = ref(false)
const success = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const file = ref(null)
const previewUrl = ref(null)

const resource = reactive({
  title: '',
  category: '',
  description: '',
  isPublic: true,
  targetGroup: null,
})

const rules = {
  required: v => !!v || 'Required',
}

const handleFilePreview = (newFile) => {
  if (newFile && newFile[0] && newFile[0].type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(newFile[0])
  } else {
    previewUrl.value = null
  }
}

const clearPreview = () => {
  file.value = null
  previewUrl.value = null
}

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  uploading.value = true
  uploadProgress.value = 10 // Start progress
  
  try {
    // 1. Upload to Cloudinary
    const cloudinaryUrl = await uploadImage(file.value[0])
    uploadProgress.value = 70 // Cloudinary done
    
    // 2. Save to our database via store
    await resourceStore.uploadResource({ 
      ...resource, 
      url: cloudinaryUrl 
    })
    
    uploadProgress.value = 100
    success.value = true
    resetForm()
  } catch (error) {
    console.error(error)
    alert('Upload failed. Please check your Cloudinary configuration.')
  } finally {
    uploading.value = false
  }
}

const resetForm = () => {
  form.value.reset()
  resource.isPublic = true
  previewUrl.value = null
  file.value = null
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.gap-3 { gap: 12px; }
</style>
