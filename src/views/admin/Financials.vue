<template>
  <v-container fluid class="bg-background pa-6">

    <!-- ================= Header & Actions ================= -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary">
          Financial Management
        </h1>
        <p class="text-subtitle-1 text-grey">
          Track tithes, offerings, and generate member reports
        </p>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="text-md-right d-flex justify-md-end ga-3"
      >
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          size="large"
          @click="showAddDialog = true"
        >
          Record Tithe
        </v-btn>

        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-email-seal-outline"
          size="large"
          @click="handleAnnualReport"
        >
          Send Annual Reports
        </v-btn>
      </v-col>
    </v-row>

    <!-- ================= Ledger Table ================= -->
    <v-card elevation="0" class="rounded-md border-thin">
      <v-data-table
        :headers="headers"
        :items="financeStore.titheRecords"
        :loading="financeStore.loading"
        hover
      >
        <!-- Member Column -->
        <template #item.memberId="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              color="primary-lighten-4"
              size="32"
              class="mr-3"
            >
              <span class="text-caption text-primary font-weight-bold">
                {{ getMemberName(item.memberId).charAt(0) }}
              </span>
            </v-avatar>
            <span class="font-weight-medium">
              {{ getMemberName(item.memberId) }}
            </span>
          </div>
        </template>

        <!-- Amount Column -->
        <template #item.amount="{ item }">
          <span class="text-success font-weight-bold">
            ${{ item.amount.toLocaleString() }}
          </span>
        </template>

        <!-- Category Column -->
        <template #item.category="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="getCategoryColor(item.category)"
          >
            {{ item.category }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- ================= Add Contribution Dialog ================= -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card class="rounded-xl pa-4">

        <v-card-title class="text-h5 font-weight-bold">
          Record Contribution
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="isFormValid">

            <v-autocomplete
              v-model="newRecord.memberId"
              :items="memberStore.members"
              item-title="name"
              item-value="id"
              label="Select Member"
              variant="outlined"
              prepend-inner-icon="mdi-account-search"
              :rules="[rules.required]"
            />

            <v-text-field
              v-model.number="newRecord.amount"
              label="Amount"
              prefix="$"
              type="number"
              variant="outlined"
              prepend-inner-icon="mdi-cash"
              :rules="[rules.required, rules.positive]"
            />

            <v-select
              v-model="newRecord.category"
              :items="[
                'Tithe',
                'Building Fund',
                'Offering',
                'Missions'
              ]"
              label="Category"
              variant="outlined"
              :rules="[rules.required]"
            />

            <v-text-field
              v-model="newRecord.date"
              label="Date"
              type="date"
              variant="outlined"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showAddDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            width="120"
            :disabled="!isFormValid"
            @click="saveContribution"
          >
            Save
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
/* ================= Imports ================= */
import { ref, reactive, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useMemberStore } from '@/stores/memberStore'
import { CATEGORY_COLORS } from '@/constants/finance'

/* ================= Stores ================= */
const financeStore = useFinanceStore()
const memberStore = useMemberStore()

/* ================= State ================= */
const showAddDialog = ref(false)
const isFormValid = ref(false)

const newRecord = reactive({
  memberId: null,
  amount: null,
  category: 'Tithe',
  date: new Date().toISOString().substr(0, 10),
})

/* ================= Load Data ================= */
onMounted(async () => {
  if (!financeStore.titheRecords.length) {
    await financeStore.fetchContributions()
  }

  if (!memberStore.members.length) {
    await memberStore.fetchMembers()
  }
})

/* ================= Table Config ================= */
const headers = [
  { title: 'Member', key: 'memberId', align: 'start' },
  { title: 'Amount', key: 'amount', align: 'end', sortable: true },
  { title: 'Category', key: 'category', align: 'center' },
  { title: 'Date', key: 'date', align: 'end', sortable: true },
]

/* ================= Validation Rules ================= */
const rules = {
  required: v => !!v || 'Required',
  positive: v => v > 0 || 'Must be greater than 0',
}

/* ================= Helpers ================= */
const getMemberName = (id) => {
  const member = memberStore.members.find(m => m.id === id)
  return member ? member.name : 'Unknown Member'
}

const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || 'grey'

/* ================= Actions ================= */
const saveContribution = async () => {
  const result = await financeStore.recordContribution({
    ...newRecord,
  })

  if (result.success) {
    showAddDialog.value = false
    newRecord.memberId = null
    newRecord.amount = null
  }
}

const handleAnnualReport = async () => {
  const confirmed = confirm(
    'This will send total contribution summaries to all members. Continue?'
  )

  if (confirmed) {
    const result = await financeStore.triggerYearEndMessages()
    alert(result.message)
  }
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}
</style>
