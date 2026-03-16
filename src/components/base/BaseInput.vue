<template>
  <v-text-field
    v-model="internalValue"
    :label="label"
    :type="type"
    :hint="hint"
    :error="error"
    :error-messages="errorMessages"
    :rules="rules"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="appendInnerIcon"
    :variant="variant"
    :density="density"
    :rounded="rounded"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :counter="counter"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :persistent-hint="persistentHint"
    :single-line="singleLine"
    v-bind="$attrs"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'text',
    validator: (v) =>
      ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time'].includes(v),
  },
  hint: {
    type: String,
    default: null,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  rules: {
    type: Array,
    default: () => [],
  },
  prependIcon: {
    type: String,
    default: null,
  },
  appendIcon: {
    type: String,
    default: null,
  },
  prependInnerIcon: {
    type: String,
    default: null,
  },
  appendInnerIcon: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: 'outlined',
    validator: (v) => ['outlined', 'filled', 'solo', 'solo-inverted', 'solo-filled', 'plain'].includes(v),
  },
  density: {
    type: String,
    default: 'comfortable',
    validator: (v) => ['compact', 'comfortable', 'default'].includes(v),
  },
  rounded: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: [String, Number],
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  singleLine: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
:deep(.v-field__input) {
  font-size: 0.95rem;
}
</style>
