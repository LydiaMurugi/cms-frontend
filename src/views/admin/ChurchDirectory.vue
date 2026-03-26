<template>
  <div class="church-directory">
    <div class="d-flex justify-space-between align-center mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Church Directory</h1>
        <p class="text-caption text-grey-darken-1">Manage all church tenants on the platform</p>
      </div>
      <BaseButton prepend-icon="mdi-plus" to="/admin/churches/register">
        Register Church
      </BaseButton>
    </div>

    <v-row v-if="churchStore.loading">
      <v-col v-for="n in 3" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader type="article, actions" class="border-thin rounded-md" />
      </v-col>
    </v-row>

    <v-row v-else-if="churchStore.churches.length > 0">
      <v-col v-for="church in churchStore.churches" :key="church.id" cols="12" md="6" lg="4">
        <BaseCard elevation="0" rounded="md" class="border-thin bg-white h-100">
          <div class="d-flex align-center mb-4">
            <v-avatar color="primary-lighten-5" size="56" rounded="md" class="mr-4">
              <v-icon icon="mdi-church" color="primary" size="32" />
            </v-avatar>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-primary">{{ church.name || church.churchName }}</h3>
              <div class="text-caption text-grey">{{ church.location }}</div>
            </div>
          </div>

          <div class="d-flex justify-space-between text-caption mb-2">
            <span class="text-grey">Members:</span>
            <span class="font-weight-bold">{{ church.member_count || church.memberCount || 0 }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption mb-4">
            <span class="text-grey">Admin:</span>
            <span class="font-weight-bold text-truncate ml-2">{{ church.admin_email || church.adminEmail || 'N/A' }}</span>
          </div>

          <v-divider class="mb-4 border-opacity-25" />

          <div class="d-flex justify-end gap-2">
            <v-btn 
              v-if="authStore.isSuperAdmin"
              variant="text" 
              size="small" 
              color="error" 
              rounded="md"
              @click="confirmDeleteChurch(church)"
            >
              Delete
            </v-btn>
            <v-btn 
              variant="text" 
              size="small" 
              color="primary" 
              rounded="md"
              @click="openEditModal(church)"
            >
              Edit
            </v-btn>
            <v-btn 
              variant="tonal" 
              size="small" 
              color="primary" 
              rounded="md"
              @click="manageChurch(church.id)"
            >
              Manage
            </v-btn>
          </div>
        </BaseCard>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-12">
        <v-icon icon="mdi-office-building-off-outline" size="64" color="grey-lighten-2" class="mb-4" />
        <h3 class="text-h6 text-grey">No churches found</h3>
        <p class="text-caption text-grey mb-4">Start by registering your first church tenant.</p>
      </v-col>
    </v-row>

    <!-- Edit Church Modal -->
    <BaseModal v-model="showEditModal" title="Edit Church Details" max-width="500">
      <div class="pa-2">
        <BaseInput v-model="editingChurch.churchName" label="Church Name" class="mb-4" />
        <BaseInput v-model="editingChurch.location" label="Location" class="mb-4" />
        <v-select
          v-model="editingChurch.status"
          label="Status"
          :items="['Active', 'Inactive', 'Suspended']"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mb-2"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" @click="showEditModal = false">Cancel</BaseButton>
        <BaseButton @click="saveChurchEdit" :loading="churchStore.loading">Save Changes</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const churchStore = useChurchStore()
const authStore = useAuthStore()
const router = useRouter()

const showEditModal = ref(false)
const editingChurch = reactive({
  id: null,
  churchName: '',
  location: '',
  status: 'Active'
})

onMounted(() => {
  churchStore.fetchChurches()
})

const openEditModal = (church) => {
  editingChurch.id = church.id
  editingChurch.churchName = church.churchName || church.name
  editingChurch.location = church.location
  editingChurch.status = church.status || 'Active'
  showEditModal.value = true
}

const saveChurchEdit = async () => {
  const result = await churchStore.updateChurch(editingChurch.id, {
    churchName: editingChurch.churchName,
    location: editingChurch.location,
    status: editingChurch.status
  })
  
  if (result.success) {
    showEditModal.value = false
  }
}

const manageChurch = (id) => {
  authStore.setManagedTenant(id)
  router.push('/admin/dashboard')
}

const confirmDeleteChurch = async (church) => {
  const name = church.name || church.churchName
  if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone and will remove all associated data.`)) {
    await churchStore.deleteChurch(church.id)
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
.gap-2 {
  gap: 8px;
}
</style>
