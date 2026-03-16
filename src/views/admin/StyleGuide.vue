<template>
  <v-container fluid class="bg-background pa-6">
    <BasePageHeader
      title="UI Style Guide"
      subtitle="Reference for all base UI components and theme variables."
    />

    <v-row>
      <!-- Colors -->
      <v-col cols="12">
        <BaseCard title="Theme Colors">
          <div class="d-flex flex-wrap gap-4">
            <div v-for="(color, name) in themeColors" :key="name" class="text-center">
              <div
                :style="{ backgroundColor: color }"
                class="rounded-lg mb-2"
                style="width: 100px; height: 100px; border: 1px solid rgba(0,0,0,0.1)"
              ></div>
              <div class="text-caption font-weight-bold">{{ name }}</div>
              <div class="text-caption text-grey">{{ color }}</div>
            </div>
          </div>
        </BaseCard>
      </v-col>

      <!-- Buttons -->
      <v-col cols="12" md="6">
        <BaseCard title="Buttons (BaseButton)">
          <div class="d-flex flex-wrap gap-4 align-center">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="ghost">Ghost/Outlined</BaseButton>
            <BaseButton variant="text">Text Only</BaseButton>
          </div>
          
          <div class="mt-6 d-flex flex-wrap gap-4 align-center">
            <BaseButton prepend-icon="mdi-plus">With Icon</BaseButton>
            <BaseButton loading>Loading State</BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
            <BaseButton hover-effect>Hover Effect</BaseButton>
          </div>
        </BaseCard>
      </v-col>

      <!-- Cards -->
      <v-col cols="12" md="6">
        <BaseCard title="Cards (BaseCard)">
          <v-row>
            <v-col cols="6">
              <BaseCard
                title="Standard Card"
                subtitle="With subtitle"
                elevation="2"
              >
                Card content goes here.
              </BaseCard>
            </v-col>
            <v-col cols="6">
              <BaseCard
                title="Hover Card"
                hover
                elevation="1"
              >
                Hover over me!
              </BaseCard>
            </v-col>
          </v-row>
        </BaseCard>
      </v-col>

      <!-- Inputs -->
      <v-col cols="12">
        <BaseCard title="Form Inputs (BaseInput)">
          <v-row>
            <v-col cols="12" md="4">
              <BaseInput
                label="Text Input"
                placeholder="Enter text..."
                hint="This is a helpful hint"
              />
            </v-col>
            <v-col cols="12" md="4">
              <BaseInput
                type="select"
                label="Select Input"
                :items="['Option 1', 'Option 2', 'Option 3']"
              />
            </v-col>
            <v-col cols="12" md="4">
              <BaseInput
                type="textarea"
                label="Textarea"
                placeholder="Type long text..."
              />
            </v-col>
          </v-row>
        </BaseCard>
      </v-col>

      <!-- Modals -->
      <v-col cols="12" md="6">
        <BaseCard title="Modals (BaseModal)">
          <BaseButton @click="showModal = true">Open Modal</BaseButton>
          
          <BaseModal
            v-model="showModal"
            title="Sample Modal"
          >
            <p>This is a standard modal component using BaseModal.</p>
            <template #actions>
              <BaseButton variant="text" @click="showModal = false">Cancel</BaseButton>
              <BaseButton @click="showModal = false">Confirm</BaseButton>
            </template>
          </BaseModal>
        </BaseCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { ChurchTheme } from '@/constants/theme'

const themeColors = ChurchTheme.colors
const showModal = ref(false)
</script>
