<template>
  <div class="member-resources-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-4 px-1">
      <h1 class="text-h5 font-weight-bold text-primary mb-0">Resources</h1>
      <p class="text-caption text-grey-darken-1">Access sermons, teachings, and spiritual materials for your group.</p>
    </div>

    <!-- Search Bar - Minimalist and Compact -->
    <div class="px-1 mb-3">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search teachings..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        rounded="md"
        bg-color="white"
        class="border-thin rounded-md overflow-hidden mini-input"
        hide-details
      />
    </div>

    <!-- Filter Chips - Tighter Spacing -->
    <v-slide-group show-arrows class="mb-3 px-0">
      <v-slide-group-item v-for="category in categories" :key="category">
        <v-chip
          class="mr-1 mb-1"
          size="x-small"
          rounded="md"
          :color="selectedCategory === category ? 'primary' : 'default'"
          :variant="selectedCategory === category ? 'flat' : 'outlined'"
          @click="selectedCategory = selectedCategory === category ? null : category"
        >
          {{ category }}
        </v-chip>
      </v-slide-group-item>
    </v-slide-group>

    <!-- Loading State -->
    <div v-if="resourceStore.loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Resources List -->
    <div v-else-if="filteredResources.length > 0" class="resources-grid">
      <BaseCard
        v-for="resource in filteredResources"
        :key="resource.id"
        elevation="0"
        rounded="md"
        class="mb-2 border-thin bg-white overflow-hidden clickable-card"
        @click="viewResource(resource)"
      >
        <div class="d-flex align-center pa-2">
          <!-- Resource Visual -->
          <v-avatar color="secondary-lighten-5" rounded="md" size="44" class="mr-3">
            <v-icon :icon="getCategoryIcon(resource.category)" color="secondary" size="18" />
          </v-avatar>

          <!-- Text Content -->
          <div class="flex-grow-1 min-width-0 py-1">
            <div class="d-flex align-center justify-space-between mb-0">
              <span class="text-overline text-secondary font-weight-bold line-height-1 tiny-text">
                {{ resource.category }}
              </span>
              <span class="text-caption text-medium-emphasis tiny-text">
                {{ formatDate(resource.created_at || resource.date) }}
              </span>
            </div>
            
            <h4 class="text-subtitle-2 font-weight-bold text-truncate mb-0 mt-n1">
              {{ resource.title }}
            </h4>
            <div class="d-flex align-center mt-0">
              <v-chip v-if="resource.isPublic" size="x-tiny" color="info" variant="tonal" rounded="sm" class="mr-2">Public</v-chip>
              <v-chip v-else size="x-tiny" color="warning" variant="tonal" rounded="sm" class="mr-2">{{ resource.targetGroup }}</v-chip>
            </div>
          </div>

          <BaseButton
            variant="tonal"
            color="secondary"
            size="small"
            rounded="md"
            class="ml-2"
            @click.stop="viewResource(resource)"
          >
            Access
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else>
      <BaseCard elevation="0" rounded="md" class="pa-10 text-center border-thin bg-white">
        <v-icon icon="mdi-library-shelves" size="48" color="grey-lighten-2" class="mb-3" />
        <h3 class="text-subtitle-2 font-weight-bold mb-1">No resources found</h3>
        <p class="text-caption text-medium-emphasis">Check back later for new study guides and materials.</p>
      </BaseCard>
    </template>

    <!-- Resource Viewer Modal -->
    <BaseModal
      v-model="showResourceModal"
      :title="selectedResource?.title"
      max-width="480px"
      show-divider
    >
      <div v-if="selectedResource" class="pa-1">
        <v-img
          :src="selectedResource.url || DEFAULT_CHURCH_IMAGE"
          height="180"
          cover
          rounded="md"
          class="mb-4 border-thin bg-grey-lighten-4"
        >
          <template #placeholder>
             <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="secondary" size="24" />
             </div>
          </template>
        </v-img>

        <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-2">About this resource</div>
        <p class="text-body-2 text-medium-emphasis mb-4 leading-relaxed">
          {{ selectedResource.description || 'No description available for this spiritual resource.' }}
        </p>

        <div class="d-flex gap-2 flex-wrap mb-2">
          <v-chip size="x-small" color="secondary" variant="tonal" rounded="md">
            {{ selectedResource.category }}
          </v-chip>
          <v-chip v-if="!selectedResource.isPublic" size="x-small" color="warning" variant="tonal" rounded="md">
            {{ selectedResource.targetGroup }}
          </v-chip>
        </div>
      </div>

      <template #actions>
        <BaseButton
          variant="text"
          color="medium-emphasis"
          @click="showResourceModal = false"
        >
          Close
        </BaseButton>
        <BaseButton
          variant="tonal"
          color="secondary"
          prepend-icon="mdi-open-in-new"
          @click="openResource(selectedResource)"
        >
          Open Resource
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useResourceStore } from '@/stores/resourceStore'
import { useAuthStore } from '@/stores/authStore'
import { DEFAULT_CHURCH_IMAGE, RESOURCE_CATEGORIES } from '@/constants/resourceConstants'

const resourceStore = useResourceStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref(null)
const showResourceModal = ref(false)
const selectedResource = ref(null)

const categories = RESOURCE_CATEGORIES

onMounted(async () => {
  await resourceStore.fetchResources()
})

const filteredResources = computed(() => {
  const userGroup = authStore.user?.group
  
  return resourceStore.resources.filter((resource) => {
    // 1. Enforce Visibility Rules (Senior Standard)
    const isVisible = resource.isPublic || (userGroup && resource.targetGroup === userGroup)
    if (!isVisible) return false

    // 2. Search Filter
    const matchesSearch =
      resource.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 3. Category Filter
    const matchesCategory = !selectedCategory.value || resource.category === selectedCategory.value
    
    return matchesSearch && matchesCategory
  })
})

const viewResource = (resource) => {
  selectedResource.value = resource
  showResourceModal.value = true
}

const openResource = (resource) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

const getCategoryIcon = (cat) => {
  const map = {
    'Sermon Audio': 'mdi-headphones',
    'Sermon Notes (PDF)': 'mdi-file-pdf-box',
    'Study Guide': 'mdi-book-open-page-variant',
    'Youth Media': 'mdi-play-circle-outline',
    'Event Photos': 'mdi-image-multiple-outline'
  }
  return map[cat] || 'mdi-file-document-outline'
}

const formatDate = (date) => {
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  })
}
</script>

<style scoped>
.member-resources-view {
  padding-bottom: 24px;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.mini-input :deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 0.85rem;
}

.clickable-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.clickable-card:hover {
  border-color: rgba(121, 85, 72, 0.3) !important;
}

.tiny-text {
  font-size: 0.68rem !important;
  letter-spacing: 0.02em;
}

.text-x-tiny {
  font-size: 0.55rem;
}

.line-height-1 {
  line-height: 1;
}

.leading-relaxed {
  line-height: 1.6;
}

.min-width-0 {
  min-width: 0;
}

.gap-2 { gap: 8px; }
</style>
