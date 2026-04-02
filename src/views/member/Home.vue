<template>
  <div class="member-home-view">
    <!-- Header Section - Personalized with Church Identity -->
    <div class="mb-6 px-2 d-flex justify-space-between align-center">
      <div>
        <h2 class="text-h5 font-weight-bold text-primary">
          Hello, {{ store.userName }}!
        </h2>
        <p class="text-caption text-grey-darken-1">
          Welcome back to <span class="font-weight-bold text-primary">{{ authStore.user?.tenantName || 'your church' }}</span>
        </p>
      </div>
      <v-avatar size="44" color="primary-lighten-5" class="border-thin">
        <v-img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
        <span v-else class="text-caption text-primary font-weight-bold">{{ store.userName.charAt(0) }}</span>
      </v-avatar>
    </div>

    <!-- Quick Stats Row -->
    <v-row dense class="mb-6">
      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-4 border-thin bg-white h-100">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-hand-heart" color="success" size="16" class="mr-2" />
            <span class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase">Giving ({{ currentYear }})</span>
          </div>
          <div class="text-h6 font-weight-bold text-success">{{ formatCurrency(memberAnnualTotal) }}</div>
        </BaseCard>
      </v-col>
      <v-col cols="6">
        <BaseCard elevation="0" rounded="md" class="pa-4 border-thin bg-white h-100">
          <div class="d-flex align-center mb-1">
            <v-icon icon="mdi-clipboard-list" color="warning" size="16" class="mr-2" />
            <span class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase">Pending Tasks</span>
          </div>
          <div class="text-h6 font-weight-bold text-warning">{{ store.myDuties.length }}</div>
        </BaseCard>
      </v-col>
    </v-row>

    <!-- Upcoming Service -->
    <BaseCard
      v-if="store.upcomingService"
      elevation="0"
      rounded="md"
      color="primary"
      class="mb-8 modern-service-card"
    >
      <div class="d-flex align-center justify-space-between pa-6">
        <div class="flex-grow-1 pr-4">
          <h3 class="text-h6 font-weight-bold text-white mb-1">
            {{ store.upcomingService.title }}
          </h3>
          <p class="text-caption text-white-70 mb-4">
            Join us live at {{ store.upcomingService.time }}
          </p>
          <BaseButton
            color="white"
            variant="flat"
            size="small"
            class="text-primary font-weight-bold px-4"
            rounded="md"
            @click="store.goToLivestream"
          >
            Join Livestream
          </BaseButton>
        </div>
        <v-icon
          icon="mdi-video-outline"
          size="56"
          color="white"
          class="opacity-40"
        />
      </div>
    </BaseCard>

    <!-- My Assignments Section -->
    <div v-if="store.myDuties.length > 0" class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <h3 class="text-subtitle-1 font-weight-bold text-primary">Assignments for You</h3>
        <BaseButton variant="text" size="small" color="primary" to="/member/tasks">View All</BaseButton>
      </div>
      
      <v-slide-group show-arrows class="mx-n2">
        <v-slide-group-item v-for="duty in store.myDuties" :key="duty.id">
          <BaseCard
            width="280"
            elevation="0"
            rounded="md"
            class="ma-2 border-thin bg-white hover-shadow transition-all"
            no-padding
          >
            <div class="pa-4">
              <div class="d-flex justify-space-between align-start mb-2">
                <v-chip size="x-tiny" :color="getStatusColor(duty.status)" variant="flat" rounded="sm" class="text-uppercase font-weight-bold px-2">
                  {{ duty.status }}
                </v-chip>
                <v-icon icon="mdi-calendar-clock" size="16" color="grey-lighten-1" />
              </div>
              
              <h4 class="text-subtitle-2 font-weight-bold text-primary line-clamp-1 mb-1">{{ duty.title }}</h4>
              <p class="text-tiny text-medium-emphasis mb-4">Due: {{ formatDate(duty.date) }}</p>
              
              <BaseButton 
                block 
                size="x-small" 
                variant="tonal" 
                color="primary"
                @click="openDutyReport(duty)"
              >
                Submit Report
              </BaseButton>
            </div>
          </BaseCard>
        </v-slide-group-item>
      </v-slide-group>
    </div>

    <!-- Latest Resources Section -->
    <div class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <h3 class="text-subtitle-1 font-weight-bold text-primary">Resources for You</h3>
        <BaseButton variant="text" size="small" color="primary" to="/member/resources">See All</BaseButton>
      </div>

      <div v-if="resourceStore.loading" class="text-center py-4">
        <v-progress-circular indeterminate size="24" color="primary" />
      </div>
      
      <v-slide-group v-else-if="latestResources.length > 0" show-arrows class="mx-n2">
        <v-slide-group-item v-for="resource in latestResources" :key="resource.id">
          <BaseCard
            width="180"
            elevation="0"
            rounded="md"
            class="ma-2 border-thin bg-white overflow-hidden clickable-card"
            @click="router.push('/member/resources')"
          >
            <v-img :src="resource.url || DEFAULT_CHURCH_IMAGE" height="100" cover class="bg-grey-lighten-4">
              <div v-if="!resource.url" class="fill-height d-flex align-center justify-center bg-primary-lighten-5">
                <v-icon :icon="getCategoryIcon(resource.category)" color="primary" size="32" class="opacity-30" />
              </div>
            </v-img>
            <div class="pa-3">
              <p class="text-x-tiny text-secondary font-weight-bold text-uppercase mb-1">{{ resource.category }}</p>
              <p class="text-caption font-weight-bold text-truncate mb-0">
                {{ resource.title }}
              </p>
            </div>
          </BaseCard>
        </v-slide-group-item>
      </v-slide-group>
      
      <div v-else class="mx-2 pa-8 text-center bg-white rounded-md border-thin border-dashed">
        <p class="text-caption text-grey">No new resources for your group.</p>
      </div>
    </div>

    <!-- Upcoming Events Section -->
    <div class="mb-4 px-2">
      <h3 class="text-subtitle-1 font-weight-bold text-primary">Upcoming Programs</h3>
    </div>

    <div class="programs-list">
      <BaseCard
        v-for="program in programStore.upcomingPrograms.slice(0, 3)"
        :key="program.id"
        elevation="0"
        rounded="md"
        class="mb-4 border-thin bg-white overflow-hidden clickable-card"
        @click="store.viewProgram(program.id)"
      >
        <div class="d-flex align-center">
          <v-img :src="getProgramImage(program)" width="100" height="100" cover>
            <div v-if="!program.image" class="fill-height d-flex align-end justify-center">
              <div class="verse-overlay-modern pa-1 text-center w-100">
                <span class="verse-text-modern">"The Lord is my shepherd"</span>
              </div>
            </div>
          </v-img>
          <div class="pa-4 flex-grow-1 min-width-0">
            <p class="text-overline text-secondary font-weight-bold mb-0 line-height-1">
              {{ program.category }}
            </p>
            <h4 class="text-subtitle-1 font-weight-bold text-truncate mb-1">
              {{ program.title }}
            </h4>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-calendar-blank" size="14" class="mr-1" />
              {{ program.date }}
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Duty Report Modal -->
    <BaseModal v-model="showReportModal" title="Submit Duty Report" max-width="500">
      <div class="pa-2">
        <div class="mb-4">
          <div class="text-caption font-weight-bold text-primary mb-1">Assignment</div>
          <div class="text-body-2 font-weight-bold">{{ selectedDuty?.title }}</div>
        </div>
        <v-textarea
          v-model="reportNotes"
          label="What happened?"
          placeholder="Summarize the outcome or any feedback..."
          rows="4"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          autofocus
        />
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showReportModal = false">Cancel</BaseButton>
        <BaseButton 
          color="success" 
          :loading="dutyStore.loading"
          @click="handleSubmitReport"
        >
          Submit & Finish
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Success Feedback -->
    <v-snackbar v-model="snackbar" color="success" timeout="3000" rounded="md" elevation="0">
      Report submitted successfully!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberDashboardStore } from '@/stores/memberDashboardStore'
import { useProgramStore } from '@/stores/programStore'
import { useDutyStore } from '@/stores/dutyStore'
import { useFinanceStore } from '@/stores/financeStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useAuthStore } from '@/stores/authStore'
import { DEFAULT_CHURCH_IMAGE } from '@/constants/resourceConstants'

const store = useMemberDashboardStore()
const programStore = useProgramStore()
const dutyStore = useDutyStore()
const financeStore = useFinanceStore()
const resourceStore = useResourceStore()
const authStore = useAuthStore()
const router = useRouter()

const showReportModal = ref(false)
const selectedDuty = ref(null)
const reportNotes = ref('')
const snackbar = ref(false)
const currentYear = new Date().getFullYear()

// Logic: Latest Resources filtered by Group (Senior Pattern)
const latestResources = computed(() => {
  const userGroup = authStore.user?.group
  return resourceStore.resources
    .filter(r => r.isPublic || (userGroup && r.targetGroup === userGroup))
    .slice(0, 6)
})

const memberAnnualTotal = computed(() => {
  return financeStore.memberAnnualTotal(authStore.user?.id)
})

const getProgramImage = (item) => {
  return item.image || DEFAULT_CHURCH_IMAGE
}

const getStatusColor = (status) => {
  const map = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Blocked': 'error',
    'Submitted': 'success'
  }
  return map[status] || 'grey'
}

const getCategoryIcon = (cat) => {
  const map = {
    'Sermon Audio': 'mdi-headphones',
    'Sermon Notes (PDF)': 'mdi-file-pdf-box',
    'Study Guide': 'mdi-book-open-page-variant',
    'Youth Media': 'mdi-play-circle-outline'
  }
  return map[cat] || 'mdi-file-document-outline'
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0)
}

const openDutyReport = (duty) => {
  selectedDuty.value = duty
  reportNotes.value = ''
  showReportModal.value = true
}

const handleSubmitReport = async () => {
  if (!reportNotes.value.trim()) return
  const result = await dutyStore.submitReport(selectedDuty.value.id, reportNotes.value)
  if (result.success) {
    showReportModal.value = false
    snackbar.value = true
    await store.fetchDashboard()
  }
}

onMounted(async () => {
  // Concurrent data fetching for fast load
  await Promise.all([
    store.fetchDashboard(),
    programStore.fetchPrograms(),
    financeStore.fetchContributions(),
    resourceStore.fetchResources()
  ])
})
</script>

<style scoped>
.member-home-view {
  padding-bottom: 24px;
}

.modern-service-card {
  background: linear-gradient(135deg, #5D4037 0%, #795548 100%);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.clickable-card {
  transition: transform 0.1s ease, background-color 0.2s ease;
  cursor: pointer;
}

.clickable-card:active {
  transform: scale(0.98);
  background-color: #f8fafc;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.line-height-1 {
  line-height: 1;
}

.text-tiny {
  font-size: 0.65rem;
}

.text-x-tiny {
  font-size: 0.55rem;
}

.min-width-0 {
  min-width: 0;
}

.opacity-40 {
  opacity: 0.4;
}

.verse-overlay-modern {
  background: linear-gradient(to top, rgba(121, 85, 72, 0.8), transparent);
  padding-bottom: 8px !important;
}

.verse-text-modern {
  font-size: 0.65rem;
  font-style: italic;
  font-weight: 700;
  color: #FAF6F0;
  letter-spacing: 0.02em;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
