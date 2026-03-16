<template>
  <div class="member-contribute-view">
    <!-- Header -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary">Make a Gift</h1>
      <p class="text-caption text-grey-darken-1">
        Your generosity supports our missions and community.
      </p>
    </div>

    <!-- Giving Form -->
    <BaseCard elevation="0" rounded="lg" class="pa-5 mb-6 border-thin bg-white">
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

        <BaseInput
          v-if="selectedAmount === 'custom'"
          v-model.number="customAmount"
          label="Enter Custom Amount"
          prefix="$"
          type="number"
          class="mb-4"
          :rules="[rules.required, rules.positive]"
        />

        <v-select
          v-model="category"
          :items="CONTRIBUTION_CATEGORIES"
          label="Where should this go?"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-4"
          :rules="[rules.required]"
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
        />

        <BaseButton
          type="submit"
          color="success"
          block
          size="large"
          class="font-weight-bold"
          rounded="lg"
          :loading="financeStore.loading"
        >
          Complete Giving
        </BaseButton>
      </v-form>
    </BaseCard>

    <!-- Recent Gifts -->
    <div class="text-subtitle-1 font-weight-bold mb-3 px-2">
      Recent Gifts
    </div>

    <v-list class="bg-transparent pa-0">
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

        <v-list-item-title class="font-weight-bold text-subtitle-2">
          {{ gift.category }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ gift.date }}
        </v-list-item-subtitle>

        <template #append>
          <span class="font-weight-bold text-success">
            ${{ gift.amount.toLocaleString() }}
          </span>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'
import { useContributionForm } from '@/composables/useContributionForm'

const financeStore = useFinanceStore()
const authStore = useAuthStore()

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
  financeStore.recentMemberContributions(authStore.user.id)
)

const submit = async () => {
  await financeStore.recordContribution({
    memberId: authStore.user.id,
    amount: finalAmount.value,
    category: category.value,
    method: paymentMethod.value,
    date: new Date().toISOString().slice(0, 10),
  })

  alert('Thank you for your generous gift!')
}
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.member-contribute-view {
  padding-bottom: 24px;
}
</style>
