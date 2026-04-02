<template>
  <div class="member-directory">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6 px-2">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Member Directory</h1>
        <p class="text-caption text-grey-darken-1">Manage and organize your congregation groups</p>
      </div>
      <BaseButton
        v-if="hasPermission('manage_members')"
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        to="/admin/register"
        rounded="md"
      >
        Add Member
      </BaseButton>
    </div>

    <!-- Search and Filter Bar - Flat -->
    <BaseCard class="mb-6 border-thin bg-white" elevation="0" rounded="md">
      <div class="pa-4">
        <v-row dense align="center">
          <v-col cols="12" md="8">
            <BaseInput
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search by name, email, or phone..."
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex gap-2">
            <v-select
              v-model="selectedGroup"
              :items="['All Groups', ...memberStore.groups]"
              placeholder="Filter by Group"
              variant="outlined"
              hide-details
              density="comfortable"
              rounded="md"
              color="primary"
            />

            <BaseButton
              icon="mdi-tune-variant"
              variant="tonal"
              color="primary"
              size="small"
              rounded="md"
              @click="showAdvancedFilters = !showAdvancedFilters"
            />
          </v-col>
        </v-row>

        <!-- Advanced Filters -->
        <v-expand-transition>
          <div v-if="showAdvancedFilters" class="mt-4 pt-4 border-t">
            <div class="text-tiny font-weight-bold mb-2 text-uppercase text-grey-darken-1">
              Quick Status Filter
            </div>

            <v-chip-group
              v-model="statusFilter"
              selected-class="bg-primary text-white"
              mandatory
            >
              <v-chip value="All" size="small" variant="outlined" filter>All Statuses</v-chip>
              <v-chip value="Active" size="small" color="success" variant="tonal" filter>Active</v-chip>
              <v-chip value="Inactive" size="small" color="error" variant="tonal" filter>Inactive</v-chip>
              <v-chip value="Pending" size="small" color="warning" variant="tonal" filter>Pending</v-chip>
            </v-chip-group>
          </div>
        </v-expand-transition>
      </div>
    </BaseCard>

    <!-- Data Table Card - Flat -->
    <BaseCard class="border-thin bg-white overflow-hidden" elevation="0" rounded="md" no-padding>
      <div v-if="selectedMembers.length > 0" class="bg-primary-lighten-5 pa-2 d-flex align-center border-b">
        <div class="text-caption font-weight-bold text-primary ml-2">
          {{ selectedMembers.length }} members selected
        </div>
        <v-spacer />
        <div class="d-flex gap-2">
          <BaseButton 
            variant="tonal" 
            size="x-small" 
            color="primary" 
            prepend-icon="mdi-account-group"
            @click="showBulkGroupModal = true"
          >
            Assign to Group
          </BaseButton>
          <BaseButton 
            variant="tonal" 
            size="x-small" 
            color="primary" 
            prepend-icon="mdi-chat"
            @click="bulkSendMessage"
          >
            Send Message
          </BaseButton>
          <BaseButton variant="tonal" size="x-small" color="error" prepend-icon="mdi-delete" @click="bulkDelete">
            Remove
          </BaseButton>
        </div>
      </div>
      <v-data-table
        v-model="selectedMembers"
        :headers="headers"
        :items="filteredMembers"
        :search="searchQuery"
        :loading="memberStore.loading"
        show-select
        hover
        class="bg-transparent custom-table"
      >
        <template #item.group="{ item }">
          <v-chip size="x-small" variant="tonal" color="secondary" rounded="md">
            {{ item.group }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="x-small"
            variant="flat"
            rounded="md"
            class="text-uppercase font-weight-bold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.joined="{ item }">
          <span class="text-caption text-grey-darken-1">
            {{ item.joined ? new Date(item.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <div v-if="hasPermission('manage_members')" class="d-flex gap-1">
            <BaseButton
              icon="mdi-pencil-outline"
              variant="text"
              color="primary"
              size="x-small"
              @click="editMember(item)"
            />
            <v-menu location="bottom end" transition="slide-y-transition">
              <template #activator="{ props }">
                <BaseButton
                  icon="mdi-dots-vertical"
                  variant="text"
                  color="grey"
                  size="x-small"
                  v-bind="props"
                />
              </template>
              <v-list density="compact" class="pa-1 rounded-md border-thin">
                <v-list-item 
                  prepend-icon="mdi-clipboard-check-outline" 
                  title="Assign Duty" 
                  @click="openQuickAssign(item)"
                  rounded="md"
                  class="text-caption font-weight-bold"
                />
                <v-list-item 
                  prepend-icon="mdi-account-details-outline" 
                  title="View Profile" 
                  @click="viewProfile(item)"
                  rounded="md"
                  class="text-caption font-weight-bold"
                />
                <v-list-item 
                  prepend-icon="mdi-chat-outline" 
                  title="Send Message" 
                  @click="messageMember(item)"
                  rounded="md"
                  class="text-caption font-weight-bold text-info"
                />
                <v-divider class="my-1 border-opacity-25" />
                <v-list-item 
                  prepend-icon="mdi-delete-outline" 
                  title="Remove" 
                  @click="confirmDelete(item)"
                  rounded="md"
                  class="text-caption font-weight-bold text-error"
                />
              </v-list>
            </v-menu>
          </div>
          <div v-else class="text-caption text-grey italic">View only</div>
        </template>

        <template #no-data>
          <div class="pa-10 text-center">
            <v-icon size="48" color="grey-lighten-2" class="mb-3">
              mdi-account-search-outline
            </v-icon>
            <div class="text-subtitle-2 text-grey mb-4">
              No members found matching your criteria
            </div>
            <BaseButton color="primary" variant="text" size="small" @click="resetFilters">
              Clear all filters
            </BaseButton>
          </div>
        </template>
      </v-data-table>
    </BaseCard>

    <!-- Quick Assign Duty Modal -->
    <BaseModal v-model="showAssignModal" title="Quick Assign Duty" max-width="500">
      <div class="pa-2">
        <div class="d-flex align-center mb-4 pa-3 bg-primary-lighten-5 rounded-md border-thin">
          <v-avatar color="primary" size="32" class="mr-3">
            <span class="text-white text-caption">{{ selectedMember?.name?.charAt(0) }}</span>
          </v-avatar>
          <div>
            <div class="text-caption font-weight-bold text-primary">{{ selectedMember?.name }}</div>
            <div class="text-tiny text-primary opacity-70">{{ selectedMember?.group }}</div>
          </div>
        </div>

        <BaseInput v-model="quickDuty.title" label="Duty Title" placeholder="e.g. Sunday Ushering" class="mb-2" />
        <BaseInput v-model="quickDuty.date" label="Due Date" type="date" class="mb-2" />
        <v-select
          v-model="quickDuty.category"
          :items="['Service', 'Maintenance', 'Outreach', 'Admin', 'Other']"
          label="Category"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          class="mb-2"
        />
        <v-textarea
          v-model="quickDuty.notes"
          label="Instructions"
          placeholder="Specific instructions for this member..."
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
          rows="3"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showAssignModal = false">Cancel</BaseButton>
        <BaseButton color="primary" :loading="assigning" @click="handleQuickAssign">Assign Duty</BaseButton>
      </template>
    </BaseModal>

    <!-- Success Snackbar -->
    <v-snackbar v-model="successMsg" color="success" timeout="3000" rounded="md" elevation="0">
      {{ snackbarText }}
    </v-snackbar>

    <!-- Bulk Assign Group Modal -->
    <BaseModal v-model="showBulkGroupModal" title="Bulk Assign Group" max-width="400">
      <div class="pa-2">
        <p class="text-caption mb-4">Update the group for <strong>{{ selectedMembers.length }}</strong> selected members.</p>
        <v-select
          v-model="newBulkGroup"
          :items="availableGroups"
          label="Select New Group"
          variant="outlined"
          density="comfortable"
          rounded="md"
          color="primary"
        />
      </div>
      <template #actions>
        <BaseButton variant="text" color="medium-emphasis" @click="showBulkGroupModal = false">Cancel</BaseButton>
        <BaseButton color="primary" :loading="bulkUpdating" @click="handleBulkGroupUpdate">Update Group</BaseButton>
      </template>
    </BaseModal>

    <!-- Member Profile Drawer -->
    <v-navigation-drawer
      v-model="showProfileDrawer"
      location="right"
      temporary
      width="400"
      class="border-s"
    >
      <div v-if="selectedMember" class="pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
          <h2 class="text-h6 font-weight-bold text-primary">Member Profile</h2>
          <BaseButton icon="mdi-close" variant="text" size="small" @click="showProfileDrawer = false" />
        </div>

        <div class="text-center mb-6">
          <v-avatar color="primary-lighten-5" size="80" rounded="md" class="mb-3 border-thin">
            <span class="text-h4 text-primary font-weight-bold">{{ selectedMember.name.charAt(0) }}</span>
          </v-avatar>
          <h3 class="text-subtitle-1 font-weight-bold">{{ selectedMember.name }}</h3>
          <p class="text-caption text-grey">{{ selectedMember.email }}</p>
          <v-chip size="x-small" color="primary" variant="tonal" class="mt-2" rounded="md">
            {{ selectedMember.group }}
          </v-chip>
        </div>

        <v-divider class="mb-6 border-opacity-25" />

        <!-- Info Grid -->
        <div class="mb-8">
          <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase mb-3">Personal Details</div>
          <v-row dense>
            <v-col cols="6">
              <div class="text-tiny text-grey">Phone</div>
              <div class="text-caption font-weight-bold">{{ selectedMember.phone || '—' }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-tiny text-grey">Joined</div>
              <div class="text-caption font-weight-bold">{{ selectedMember.joinedDate || '—' }}</div>
            </v-col>
            <v-col cols="12" class="mt-2">
              <div class="text-tiny text-grey">Address</div>
              <div class="text-caption font-weight-bold">{{ selectedMember.address || '—' }}</div>
            </v-col>
          </v-row>
        </div>

        <!-- Recent Duties -->
        <div class="mb-8">
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase">Recent Duties</div>
            <BaseButton variant="text" color="primary" size="x-small" to="/admin/tasks">View All</BaseButton>
          </div>
          <v-list density="compact" class="pa-0 bg-transparent" v-if="memberDuties.length">
            <v-list-item v-for="duty in memberDuties" :key="duty.id" class="px-0 py-1">
              <template #prepend>
                <v-icon :icon="duty.status === 'Submitted' ? 'mdi-check-circle' : 'mdi-clock-outline'" 
                        :color="duty.status === 'Submitted' ? 'success' : 'warning'" 
                        size="16" class="mr-2" />
              </template>
              <v-list-item-title class="text-caption font-weight-bold">{{ duty.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-tiny">{{ duty.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-else class="text-caption text-grey italic pa-2 bg-grey-lighten-5 rounded text-center">
            No duties assigned yet.
          </div>
        </div>

        <!-- Recent Contributions -->
        <div>
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="text-tiny font-weight-bold text-grey-darken-1 text-uppercase">Recent Giving</div>
            <BaseButton variant="text" color="primary" size="x-small" to="/admin/finances">View All</BaseButton>
          </div>
          <v-list density="compact" class="pa-0 bg-transparent" v-if="memberContributions.length">
            <v-list-item v-for="record in memberContributions" :key="record.id" class="px-0 py-1">
              <template #prepend>
                <v-icon icon="mdi-cash" color="success" size="16" class="mr-2" />
              </template>
              <v-list-item-title class="text-caption font-weight-bold">${{ record.amount }}</v-list-item-title>
              <v-list-item-subtitle class="text-tiny">{{ record.category }} • {{ record.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-else class="text-caption text-grey italic pa-2 bg-grey-lighten-5 rounded text-center">
            No contributions recorded.
          </div>
        </div>

        <div class="mt-8 d-flex gap-2">
          <BaseButton block color="primary" variant="tonal" size="small" @click="openQuickAssign(selectedMember)">
            Assign New Duty
          </BaseButton>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/memberStore'
import { useDutyStore } from '@/stores/dutyStore'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'
import { headers } from '@/constants/memberTableHeaders'
import { useMemberFilters } from '@/composables/useMemberFilters'
import { usePermissions } from '@/composables/usePermissions'

const router = useRouter()
const memberStore = useMemberStore()
const dutyStore = useDutyStore()
const financeStore = useFinanceStore()
const authStore = useAuthStore()
const { hasPermission } = usePermissions()

const showAssignModal = ref(false)
const showProfileDrawer = ref(false)
const assigning = ref(false)
const bulkUpdating = ref(false)
const showBulkGroupModal = ref(false)
const successMsg = ref(false)
const snackbarText = ref('')
const selectedMember = ref(null)
const selectedMembers = ref([])
const newBulkGroup = ref('')

const quickDuty = reactive({
  title: '',
  date: '',
  category: 'Service',
  notes: '',
})

const availableGroups = computed(() => memberStore.groups)

const {
  searchQuery,
  selectedGroup,
  statusFilter,
  showAdvancedFilters,
  filteredMembers,
  resetFilters,
  getStatusColor,
  editMember,
} = useMemberFilters(memberStore)

onMounted(() => {
  memberStore.fetchMembers()
  dutyStore.fetchDuties()
  financeStore.fetchContributions()
    console.log(memberStore.members[0])
})

const memberDuties = computed(() => {
  if (!selectedMember.value) return []
  return dutyStore.duties
    .filter(d => d.assigned_id === selectedMember.value.id)
    .slice(0, 3)
})


const memberContributions = computed(() => {
  if (!selectedMember.value) return []
  return financeStore.titheRecords
    .filter(r => r.memberId === selectedMember.value.id)
    .slice(0, 3)
})

const openQuickAssign = (member) => {
  selectedMember.value = member
  showAssignModal.value = true
}

const viewProfile = (member) => {
  selectedMember.value = member
  showProfileDrawer.value = true
}

const handleQuickAssign = async () => {
  if (!quickDuty.title || !quickDuty.date) return
  
  assigning.value = true
  try {
    const payload = {
      ...quickDuty,
      assigned_id: selectedMember.value.id,
      assigned_name: selectedMember.value.name,
      tenantId: authStore.tenantId,
      status: 'Pending'
    }
    await dutyStore.createDuty(payload)
    snackbarText.value = 'Duty assigned successfully!'
    successMsg.value = true
    showAssignModal.value = false
    // Reset form
    quickDuty.title = ''
    quickDuty.date = ''
    quickDuty.notes = ''
  } catch (err) {
    console.error(err)
  } finally {
    assigning.value = false
  }
}

const handleBulkGroupUpdate = async () => {
  if (!newBulkGroup.value || selectedMembers.value.length === 0) return
  
  bulkUpdating.value = true
  let successCount = 0
  
  try {
    for (const memberId of selectedMembers.value) {
      const res = await memberStore.updateMember(memberId, { group: newBulkGroup.value })
      if (res.success) successCount++
    }
    
    snackbarText.value = `Successfully updated group for ${successCount} members`
    successMsg.value = true
    showBulkGroupModal.value = false
    selectedMembers.value = []
    newBulkGroup.value = ''
  } catch (err) {
    console.error('Bulk update error:', err)
  } finally {
    bulkUpdating.value = false
  }
}

const bulkSendMessage = () => {
  if (selectedMembers.value.length === 0) return
  router.push({
    path: '/admin/communication',
    query: { recipients: selectedMembers.value.join(',') }
  })
}

const messageMember = (member) => {
  router.push({
    path: '/admin/communication',
    query: { recipients: member.id }
  })
}

const confirmDelete = (member) => {
  if (confirm(`Are you sure you want to remove ${member.name}?`)) {
    memberStore.deleteMember(member.id)
  }
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to remove ${selectedMembers.value.length} selected members?`)) {
    selectedMembers.value.forEach(id => {
      memberStore.deleteMember(id)
    })
    selectedMembers.value = []
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-t {
  border-top: 1px solid rgba(121, 85, 72, 0.05) !important;
}

.text-tiny {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }

:deep(.custom-table .v-data-table-header) {
  background-color: #fcfaf7;
}

:deep(.custom-table .v-data-table-header th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.7rem !important;
  color: #795548 !important;
}
</style>
