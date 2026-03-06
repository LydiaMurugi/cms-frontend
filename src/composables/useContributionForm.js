import { ref, computed } from 'vue'
import {
  CONTRIBUTION_AMOUNTS,
  CONTRIBUTION_CATEGORIES,
  PAYMENT_METHODS,
} from '@/constants/finance'

export function useContributionForm() {
  const isValid = ref(false)
  const selectedAmount = ref(50)
  const customAmount = ref(null)
  const category = ref('Tithe')
  const paymentMethod = ref('Select to give')

  const finalAmount = computed(() =>
    selectedAmount.value === 'custom'
      ? customAmount.value
      : selectedAmount.value    
  )

  const rules = {
    required: v => !!v || 'Required',
    positive: v => v > 0 || 'Must be positive',
  }

  return {
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
  }
}
