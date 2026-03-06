<template>
  <v-container class="pa-4 bg-background">

    <!-- Header -->
    <v-row class="mb-2">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold text-primary">Make a Gift</h1>
        <p class="text-caption text-grey">
          Your generosity supports our missions and community.
        </p>
      </v-col>
    </v-row>

    <!-- Giving Form -->
    <v-card elevation="2" class="rounded-xl pa-4 mb-6">
      <v-form v-model="isValid" @submit.prevent="submit">

        <div class="text-subtitle-2 font-weight-bold mb-3">
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
          >
            ${{ amt }}
          </v-chip>

          <v-chip value="custom" variant="outlined">Custom</v-chip>
        </v-chip-group>

        <v-text-field
          v-if="selectedAmount === 'custom'"
          v-model.number="customAmount"
          label="Enter Custom Amount"
          prefix="$"
          type="number"
          variant="outlined"
          class="mb-4"
          :rules="[rules.required, rules.positive]"
        />

        <v-select
          v-model="category"
          :items="CONTRIBUTION_CATEGORIES"
          label="Where should this go?"
          variant="outlined"
          class="mb-4"
          :rules="[rules.required]"
        />

        <v-select
          v-model="paymentMethod"
          :items="PAYMENT_METHODS"
          label="Payment Method"
          variant="outlined"
          prepend-inner-icon="mdi-credit-card-outline"
          class="mb-6"
        />

        <v-btn
          type="submit"
          color="success"
          block
          size="large"
          elevation="4"
          class="font-weight-bold rounded-lg"
          :loading="financeStore.loading"
        >
          Complete Giving
        </v-btn>
      </v-form>
    </v-card>

    <!-- Recent Gifts -->
    <div class="text-subtitle-1 font-weight-bold mb-3">
      Recent Gifts
    </div>

    <v-list class="bg-transparent pa-0">
      <v-list-item
        v-for="gift in recentGifts"
        :key="gift.id"
        class="bg-white rounded-xl mb-2 elevation-1"
        :title="gift.category"
        :subtitle="gift.date"
      >
        <template #prepend>
          <v-avatar color="success-lighten-5">
            <v-icon icon="mdi-heart" color="success" size="20" />
          </v-avatar>
        </template>

        <template #append>
          <span class="font-weight-bold text-success">
            ${{ gift.amount.toLocaleString() }}
          </span>
        </template>
      </v-list-item>
    </v-list>

  </v-container>
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
