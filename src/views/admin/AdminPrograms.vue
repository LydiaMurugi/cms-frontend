<template>
  <div class="admin-programs-view">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Program Management</h1>
        <p class="text-caption text-grey-darken-1">Schedule events and feature key programs for members</p>
      </div>
      <BaseButton
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        rounded="md"
        @click="openCreateModal"
      >
        Create Program
      </BaseButton>
    </div>

    <!-- Programs List -->
    <v-row>
      <v-col v-for="program in programStore.programs" :key="program.id" cols="12" md="6" lg="4">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100 overflow-hidden" no-padding>
          <v-img :src="program.image || DEFAULT_CHURCH_IMAGE" height="150" cover class="bg-grey-lighten-4">
            <v-chip
              v-if="program.isFeatured"
              color="warning"
              size="x-small"
              variant="flat"
              class="ma-2 font-weight-bold"
              prepend-icon="mdi-star"
            >
              FEATURED
            </v-chip>
          </v-img>
          
          <div class="pa-4">
            <div class="d-flex justify-space-between align-start mb-1">
              <p class="text-tiny font-weight-bold text-secondary text-uppercase">{{ program.category }}</p>
              <span class="text-tiny text-grey">{{ program.date }}</span>
            </div>
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-2">{{ program.title }}</h3>
            <p class="text-caption text-medium-emphasis line-clamp-2 mb-4">{{ program.description }}</p>
            
            <div class="d-flex gap-2">
              <BaseButton variant="tonal" size="x-small" color="primary" @click="openEditModal(program)">
                Edit
              </BaseButton>
              <BaseButton variant="text" size="x-small" color="error" @click="confirmDelete(program)">
                Delete
              </BaseButton>
              <v-spacer />
              <v-btn
                :icon="program.isFeatured ? 'mdi-star' : 'mdi-star-outline'"
                variant="text"
                size="small"
                :color="program.isFeatured ? 'warning' : 'grey'"
                @click="toggleFeatured(program)"
              />
            </div>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Create/Edit Modal -->
    <BaseModal v-model="showModal" :title="isEditing ? 'Edit Program' : 'New Program'" max-width="600">
      <v-form ref="form" v-model="isFormValid" class="pa-2">
        <v-row dense>
          <v-col cols="12">
            <BaseInput v-model="formData.title" label="Program Title" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.category"
              :items="['Service', 'Youth', 'Outreach', 'Seminar', 'Conference']"
              label="Category"
              variant="outlined"
              density="comfortable"
              rounded="md"
              color="primary"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <BaseInput v-model="formData.date" label="Date" type="date" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              label="Description"
              rows="3"
              variant="outlined"
              density="comfortable"
              rounded="md"
              color="primary"
            />
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="formData.isFeatured"
              label="Feature this program on member home dashboard"
              color="primary"
              hide-details
            />
          </v-col>
        </v-row>
      </v-form>
      <template #actions>
        <BaseButton variant="text" @click="showModal = false">Cancel</BaseButton>
        <BaseButton color="primary" :loading="loading" :disabled="!isFormValid" @click="saveProgram">
          {{ isEditing ? 'Update' : 'Create' }}
        </BaseButton>
      </template>
    </BaseModal>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProgramStore } from '@/stores/programStore'
import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const programStore = useProgramStore()

const showModal = ref(false)
const isEditing = ref(false)
const isFormValid = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const formData = reactive({
  id: null,
  title: '',
  category: 'Service',
  date: '',
  description: '',
  isFeatured: false,
})

const rules = {
  required: v => !!v || 'Required',
}

onMounted(() => {
  programStore.fetchPrograms()
})

const openCreateModal = () => {
  isEditing.value = false
  Object.assign(formData, {
    id: null,
    title: '',
    category: 'Service',
    date: '',
    description: '',
    isFeatured: false,
  })
  showModal.value = true
}

const openEditModal = (program) => {
  isEditing.value = true
  Object.assign(formData, { ...program })
  showModal.value = true
}

const saveProgram = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await programStore.updateProgram(formData.id, { ...formData })
      showSnackbar('Program updated successfully')
    } else {
      await programStore.createProgram({ ...formData })
      showSnackbar('Program created successfully')
    }
    showModal.value = false
  } catch (err) {
    showSnackbar('Failed to save program', 'error')
  } finally {
    loading.value = false
  }
}

const toggleFeatured = async (program) => {
  try {
    await programStore.updateProgram(program.id, {
      ...program,
      isFeatured: !program.isFeatured
    })
    showSnackbar(program.isFeatured ? 'Program unfeatured' : 'Program featured!')
  } catch (err) {
    showSnackbar('Action failed', 'error')
  }
}

const confirmDelete = async (program) => {
  if (confirm(`Delete "${program.title}"?`)) {
    await programStore.deleteProgram(program.id)
    showSnackbar('Program removed')
  }
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.gap-2 { gap: 8px; }
.text-tiny { font-size: 0.65rem; }
</style>
