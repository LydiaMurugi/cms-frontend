<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    :transition="transition"
    :class="dialogClass"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card :rounded="cardRounded" class="modal-card">
      <!-- Modal Header -->
      <v-card-item v-if="title || $slots.header" :class="{ 'pb-2': showDivider }">
        <template #title>
          <slot name="header">
            <span v-if="title" class="text-h6 font-weight-bold">
              {{ title }}
            </span>
          </slot>
        </template>

        <!-- Close Button -->
        <template #append>
          <BaseButton
            icon="mdi-close"
            size="small"
            variant="text"
            @click="$emit('update:modelValue', false)"
          />
        </template>
      </v-card-item>

      <!-- Modal Divider -->
      <v-divider v-if="showDivider && (title || $slots.header)" class="my-0" />

      <!-- Modal Content -->
      <v-card-text v-if="$slots.default" class="pa-6">
        <slot />
      </v-card-text>

      <!-- Modal Actions -->
      <template v-if="$slots.actions || showDefaultActions">
        <v-divider v-if="showDivider" class="my-0" />
        <v-card-actions class="pa-6 pt-0 gap-3 justify-end">
          <slot name="actions">
            <!-- Default Actions -->
            <BaseButton
              v-if="showDefaultActions"
              variant="outlined"
              color="medium-emphasis"
              @click="$emit('update:modelValue', false)"
            >
              {{ cancelText }}
            </BaseButton>
            <BaseButton
              v-if="showDefaultActions"
              variant="tonal"
              color="primary"
              :loading="confirmLoading"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </BaseButton>
          </slot>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  maxWidth: {
    type: String,
    default: '500px',
  },
  cardRounded: {
    type: String,
    default: 'lg',
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  transition: {
    type: String,
    default: 'dialog-transition',
  },
  dialogClass: {
    type: [String, Object, Array],
    default: '',
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
  showDefaultActions: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
}

.gap-3 {
  gap: 12px;
}

.justify-end {
  justify-content: flex-end;
}
</style>
