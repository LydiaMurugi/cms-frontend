<template>
  <div class="member-contribute-view">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary">Make a Gift</h1>
      <p class="text-caption text-grey-darken-1">
        Your generosity supports our missions and community.
      </p>
    </div>

    <!-- Success State -->
    <v-fade-transition hide-on-leave>
      <div v-if="submitted" class="text-center py-12">
        <v-avatar color="success-lighten-5" size="80" rounded="md" class="mb-4">
          <v-icon icon="mdi-heart-check" color="success" size="48" />
        </v-avatar>
        <h2 class="text-h5 font-weight-bold text-success mb-2">Thank You!</h2>
        <p class="text-body-2 text-medium-emphasis mb-8">
          Your gift of <strong>{{ formatCurrency(finalAmount) }}</strong> has been received and recorded.
        </p>
        <div class="d-flex flex-column gap-2 max-width-300 mx-auto">
          <BaseButton color="primary" rounded="md" to="/member/contribution-history">
            View History
          </BaseButton>
          <BaseButton variant="text" size="small" @click="resetForm">
            Make Another Gift
          </BaseButton>
        </div>
      </div>

      <!-- Giving Form -->
      <BaseCard v-else elevation="0" rounded="lg" class="pa-5 mb-6 border-thin bg-white">
        <v-form v-model="isValid" @submit.prevent="submit">

          <div class="text-subtitle-2 font-weight-bold mb-4">
            Select Amount
          </div>

          <v-chip-group
            v-model="selectedAmount"
            selected-class="bg-primary text-white"
            mandatory
            class="mb-6"
          >
            <v-chip
              v-for="amt in CONTRIBUTION_AMOUNTS"
              :key="amt"
              :value="amt"
              variant="outlined"
              rounded="md"
              class="px-4"
            >
              ${{ amt }}
            </v-chip>

            <v-chip value="custom" variant="outlined" rounded="md" class="px-4">Custom</v-chip>
          </v-chip-group>

          <v-expand-transition>
            <div v-if="selectedAmount === 'custom'">
              <BaseInput
                v-model.number="customAmount"
                label="Enter Custom Amount"
                prefix="$"
                type="number"
                class="mb-4"
                :rules="[rules.required, rules.positive]"
              />
            </div>
          </v-expand-transition>

          <v-select
            v-model="category"
            :items="CONTRIBUTION_CATEGORIES"
            label="Where should this go?"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="mb-4"
            :rules="[rules.required]"
            color="primary"
          />

          <v-select
            v-model="paymentMethod"
            :items="PAYMENT_METHODS"
            label="Payment Method"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-credit-card-outline"
            class="mb-6"
            color="primary"
          />

          <BaseButton
            type="submit"
            color="success"
            block
            size="large"
            class="font-weight-bold"
            rounded="lg"
            :loading="financeStore.loading"
            :disabled="!isValid"
          >
            Complete Giving
          </BaseButton>
        </v-form>
      </BaseCard>
    </v-fade-transition>

    <!-- Recent Gifts -->
    <div v-if="!submitted">
      <div class="text-subtitle-1 font-weight-bold mb-3 px-2">
        Recent Gifts
      </div>

      <v-list v-if="recentGifts.length > 0" class="bg-transparent pa-0">
        <v-list-item
          v-for="gift in recentGifts"
          :key="gift.id"
          class="bg-white rounded-lg mb-2 border-thin"
        >
          <template #prepend>
            <v-avatar color="green-lighten-5" rounded="md" size="40" class="mr-1">
              <v-icon icon="mdi-heart" color="success" size="20" />
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-subtitle-2 text-primary">
            {{ gift.category }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatDate(gift.date) }}
          </v-list-item-subtitle>

          <template #append>
            <span class="font-weight-bold text-success">
              {{ formatCurrency(gift.amount) }}
            </span>
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="pa-8 text-center bg-white rounded-lg border-thin border-dashed">
        <p class="text-caption text-grey">No recent gifts recorded.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'
import { useContributionForm } from '@/composables/useContributionForm'

const financeStore = useFinanceStore()
const authStore = useAuthStore()
const submitted = ref(false)

const {
  isValid,
  selectedAmount,
  customAmount,
  category,
  paymentMethod,
  finalAmount,
  rules,
  CONTRIBUTION_AMOUNTS,
  CONTRIBUTION_CATEGORIES,
  PAYMENT_METHODS,
} = useContributionForm()

const recentGifts = computed(() =>
  financeStore.recentMemberContributions(authStore.user?.id)
)

const submit = async () => {
  const payload = {
    memberId: authStore.user?.id,
    memberName: authStore.user?.name,
    amount: finalAmount.value,
    category: category.value,
    method: paymentMethod.value,
    date: new Date().toISOString().slice(0, 10),
    tenantId: authStore.user?.tenantId
  }

  const result = await financeStore.recordContribution(payload)
  if (result.success) {
    submitted.value = true
  }
}

const resetForm = () => {
  submitted.value = false
  // Reset form fields via the same reactive logic or refresh page
  window.location.reload() 
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-dashed {
  border-style: dashed !important;
}

.member-contribute-view {
  padding-bottom: 24px;
}

.max-width-300 {
  max-width: 300px;
}

.gap-2 { gap: 8px; }
</style>
