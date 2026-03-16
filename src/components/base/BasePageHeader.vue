<template>
  <div class="page-header mb-6">
    <!-- Title Section -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-subtitle-2 text-medium-emphasis">
          {{ subtitle }}
        </p>
      </div>

      <!-- Actions Slot -->
      <div v-if="$slots.actions" class="d-flex gap-3 align-center">
        <slot name="actions" />
      </div>
    </div>

    <!-- Breadcrumbs -->
    <v-breadcrumbs
      v-if="breadcrumbs && breadcrumbs.length > 0"
      :items="breadcrumbs"
      rounded="lg"
      class="pa-0 mb-0"
    />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
    validator: (v) => {
      return v.every((item) => item.title && (item.href || item.disabled))
    },
  },
})
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 24px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-space-between {
  justify-content: space-between;
}

.gap-3 {
  gap: 12px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.pa-0 {
  padding: 0;
}
</style>
