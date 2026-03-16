<template>
  <v-card
    :elevation="elevation"
    :rounded="rounded"
    :class="cardClass"
    v-bind="$attrs"
  >
    <!-- Card Header Section -->
    <v-card-item v-if="title || subtitle || $slots.title || $slots.subtitle">
      <template #title>
        <slot name="title">
          <span class="text-h6 text-weight-bold">{{ title }}</span>
        </slot>
      </template>
      <template #subtitle>
        <slot name="subtitle">
          <span class="text-subtitle-2">{{ subtitle }}</span>
        </slot>
      </template>
      <template #append v-if="$slots.append">
        <slot name="append" />
      </template>
    </v-card-item>

    <v-divider v-if="headerDivider && (title || subtitle || $slots.title || $slots.subtitle)" />

    <!-- Main Card Text/Content -->
    <v-card-text v-if="$slots.default" class="pa-6">
      <slot />
    </v-card-text>

    <!-- Card Actions Section -->
    <template v-if="$slots.actions">
      <v-divider v-if="actionsDivider" />
      <v-card-actions class="pa-6 pt-0 gap-3">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  elevation: {
    type: [Number, String],
    default: 0
  },
  rounded: {
    type: String,
    default: 'sm'
  },
  border: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  headerDivider: {
    type: Boolean,
    default: false
  },
  actionsDivider: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: ''
  }
})

const cardClass = computed(() => {
  return {
    'card-hover': props.hover,
    'border-thin': props.elevation === 0
  }
})
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.section-label {
  padding: 18px 24px 6px;
  font-size: 0.7rem !important;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  text-transform: uppercase;
}
</style>
