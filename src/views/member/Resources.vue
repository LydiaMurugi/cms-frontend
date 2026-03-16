<template>
  <div class="member-resources-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-4 px-1">
      <h1 class="text-h5 font-weight-bold text-primary mb-0">Resources</h1>
      <p class="text-caption text-grey-darken-1">Access sermons, teachings, and spiritual materials.</p>
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

    <!-- Resources List - Minimal Padding & Spread Layout -->
    <div v-if="filteredResources.length > 0" class="resources-grid">
      <BaseCard
        v-for="resource in filteredResources"
        :key="resource.id"
        elevation="0"
        rounded="md"
        class="mb-2 border-thin bg-white overflow-hidden clickable-card"
        @click="viewResource(resource.id)"
      >
        <div class="d-flex align-center pa-2">
          <!-- Resource Visual -->
          <v-avatar color="secondary-lighten-5" rounded="md" size="44" class="mr-3">
            <v-icon icon="mdi-book-open-variant" color="secondary" size="18" />
          </v-avatar>

          <!-- Text Content - Spread Out Spacing -->
          <div class="flex-grow-1 min-width-0 py-1">
            <div class="d-flex align-center justify-space-between mb-0">
              <span class="text-overline text-secondary font-weight-bold line-height-1 tiny-text">
                {{ resource.category }}
              </span>
              <span class="text-caption text-medium-emphasis tiny-text">
                {{ formatDate(resource.date) }}
              </span>
            </div>
            
            <h4 class="text-subtitle-2 font-weight-bold text-truncate mb-0 mt-n1">
              {{ resource.title }}
            </h4>
            <div class="d-flex align-center mt-0">
              <v-icon icon="mdi-account-outline" size="12" color="grey" class="mr-1" />
              <p class="text-caption text-medium-emphasis text-truncate mb-0 tiny-text">
                {{ resource.author }}
              </p>
            </div>
          </div>

          <BaseButton
            variant="tonal"
            color="secondary"
            size="small"
            rounded="md"
            class="ml-2"
            @click.stop="viewResource(resource.id)"
          >
            Access
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <template v-else-if="!loading">
      <BaseCard elevation="0" rounded="md" class="pa-5 text-center border-thin bg-white">
        <v-icon icon="mdi-library-shelves" size="32" color="grey-lighten-1" class="mb-2" />
        <h3 class="text-caption font-weight-bold mb-1">No matches found</h3>
        <p class="text-caption text-medium-emphasis">Try a different search query.</p>
      </BaseCard>
    </template>

    <!-- Resource Viewer Modal - Compact Traditional -->
    <BaseModal
      v-model="showResourceModal"
      :title="selectedResource?.title"
      max-width="420px"
      show-divider
    >
      <div v-if="selectedResource" class="pa-1">
        <v-img
          :src="selectedResource.image || DEFAULT_CHURCH_IMAGE"
          height="140"
          cover
          rounded="md"
          class="mb-3 border-thin"
        >
          <div v-if="!selectedResource.image" class="fill-height d-flex align-center justify-center">
            <div class="verse-overlay-modern pa-2 text-center w-100">
              <span class="verse-text-modern">"Faith comes by hearing"</span>
            </div>
          </div>
          <template #placeholder>
             <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                <v-progress-circular indeterminate color="secondary" size="24" />
             </div>
          </template>
        </v-img>

        <p class="text-body-2 text-medium-emphasis mb-3 line-height-1-4">
          {{ selectedResource.description }}
        </p>

        <div class="d-flex gap-2 flex-wrap mb-1">
          <v-chip size="x-small" color="secondary" variant="tonal" rounded="md">
            {{ selectedResource.category }}
          </v-chip>
          <v-chip size="x-small" variant="outlined" rounded="md">
            {{ selectedResource.author }}
          </v-chip>
        </div>
      </div>

      <template #actions>
        <BaseButton
          variant="text"
          color="medium-emphasis"
          size="small"
          rounded="md"
          @click="showResourceModal = false"
        >
          Close
        </BaseButton>
        <BaseButton
          variant="tonal"
          color="secondary"
          size="small"
          rounded="md"
          prepend-icon="mdi-download"
          @click="downloadResource(selectedResource)"
        >
          Download
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref(null)
const resources = ref([])
const showResourceModal = ref(false)
const selectedResource = ref(null)

const categories = ref(['Sermon', 'Teaching', 'Prayer', 'Devotional', 'Testimony'])

// Mock data
const mockData = [
  {
    id: 1,
    title: 'The Power of Prayer',
    description: 'A deep dive into the foundations of effective prayer and how it transforms lives.',
    category: 'Teaching',
    author: 'Pastor John',
    date: '2024-01-20',
    url: 'https://example.com/resources/prayer.pdf',
  },
  {
    id: 2,
    title: 'Sunday Service - Jan 14',
    description: 'Full sermon from our Sunday morning service about faith and perseverance.',
    category: 'Sermon',
    author: 'Pastor Maria',
    date: '2024-01-14',
    url: 'https://example.com/resources/sermon-jan14.mp4',
  },
  {
    id: 3,
    title: 'Daily Devotional',
    description: 'Reflections for the third week of January to guide your spiritual journey.',
    category: 'Devotional',
    author: 'Rev. James',
    date: '2024-01-15',
    url: 'https://example.com/resources/devotional-week3.pdf',
  },
  {
    id: 4,
    title: 'Testimony: Life Changed',
    description: 'Inspiring testimony of transformation through faith and God\'s grace.',
    category: 'Testimony',
    author: 'Sarah M.',
    date: '2024-01-18',
    url: null,
  },
  {
    id: 5,
    title: 'Prayer for Healing',
    description: 'Guided prayer session for physical and spiritual healing with scriptural foundation.',
    category: 'Prayer',
    author: 'Pastor John',
    date: '2024-01-19',
    url: 'https://example.com/resources/prayer-healing.mp3',
  },
]

onMounted(async () => {
  loading.value = true
  try {
    resources.value = mockData
  } finally {
    loading.value = false
  }
})

const filteredResources = computed(() => {
  return resources.value.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || resource.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const viewResource = (resourceId) => {
  const resource = resources.value.find((r) => r.id === resourceId)
  if (resource) {
    selectedResource.value = resource
    showResourceModal.value = true
  }
}

const downloadResource = (resource) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
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

.clickable-card:active {
  background-color: #f8fafc;
  transform: scale(0.99);
}

.tiny-text {
  font-size: 0.68rem !important;
  letter-spacing: 0.02em;
}

.line-height-1 {
  line-height: 1;
}

.verse-overlay-modern {
  background: rgba(121, 85, 72, 0.4);
  backdrop-filter: blur(1px);
}

.verse-text-modern {
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
}

.min-width-0 {
  min-width: 0;
}
</style>
