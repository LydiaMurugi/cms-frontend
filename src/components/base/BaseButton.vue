<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :rounded="rounded"
    :class="[
      { 'text-none': !uppercase },
      'font-weight-medium',
    ]"
    v-bind="$attrs"
  >
    <slot />
    
    <!-- Slots for prepend/append if needed -->
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </v-btn>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'elevated',
    validator: (v) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(v)
  },
  size: {
    type: String,
    default: 'default'
  },
  block: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  prependIcon: {
    type: String,
    default: null
  },
  appendIcon: {
    type: String,
    default: null
  },
  uppercase: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'md'
  }
})
</script>

<style scoped>
/* Add any custom button styling here */
.v-btn {
  letter-spacing: 0.02em;
}
</style>
