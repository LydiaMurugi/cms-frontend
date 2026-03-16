<template>
  <div class="member-layout-wrapper">
    <!-- Top Header - Ancient Scroll Style -->
    <v-app-bar 
      elevation="0" 
      class="border-b floating-nav" 
      color="rgba(244, 236, 225, 0.8)"
      density="comfortable"
      flat
    >
      <template #prepend>
        <v-avatar color="primary" size="36" class="ml-3 rounded-md">
          <v-icon icon="mdi-church" color="white" size="20" />
        </v-avatar>
      </template>

      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-primary">
        Church MS
      </v-toolbar-title>

      <v-spacer />

      <!-- Notifications -->
      <v-btn icon variant="text" @click="store.goToNotifications">
        <v-badge
          v-if="store.unreadNotifications"
          color="error"
          dot
          offset-x="2"
          offset-y="2"
        >
          <v-icon icon="mdi-bell-outline" size="22" color="primary" />
        </v-badge>
        <v-icon v-else icon="mdi-bell-outline" size="22" color="primary" />
      </v-btn>

      <v-btn icon variant="text" class="mr-2" @click="store.goToProfile">
        <v-avatar size="32" color="primary-lighten-4">
          <v-icon icon="mdi-account-circle" color="primary" size="24" />
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <!-- Content Area - Centered Spread -->
    <v-main class="bg-scroll-parchment">
      <v-container fluid class="pa-4 main-content-container">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Bottom Navigation - Floating Spread -->
    <div class="bottom-nav-container">
      <v-bottom-navigation
        v-model="store.activeTab"
        grow
        color="primary"
        elevation="0"
        class="floating-bottom-nav"
        height="64"
      >
        <v-btn
          v-for="item in store.navItems"
          :key="item.value"
          :value="item.value"
          :to="item.path"
          @click="store.setActiveTab(item.value)"
          class="nav-btn"
        >
          <v-icon size="24" class="mb-1">{{ item.icon }}</v-icon>
          <span class="text-caption font-weight-bold uppercase-none">{{ item.title }}</span>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </div>
</template>

<script setup>
import { useMemberUiStore } from '@/stores/memberUiStore'

const store = useMemberUiStore()
</script>

<style scoped>
.member-layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F4ECE1;
}

.bg-scroll-parchment {
  background-color: #F4ECE1;
}

.floating-nav {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(121, 85, 72, 0.1) !important;
}

/* Main content area */
.v-main {
  min-height: 100vh;
  padding-bottom: 80px !important; 
}

.main-content-container {
  max-width: 600px; 
  margin: 0 auto;
}

/* Bottom Navigation Styling - Centered and Floating */
.bottom-nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 20px 20px 20px;
  pointer-events: none;
}

.floating-bottom-nav {
  position: relative !important;
  pointer-events: auto;
  border-radius: 12px !important;
  border: 1px solid rgba(121, 85, 72, 0.15) !important;
  background-color: rgba(250, 246, 240, 0.95) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  max-width: 500px; /* More compact for better spread feel */
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(62, 39, 35, 0.1) !important;
}

.nav-btn {
  height: 100% !important;
  min-width: 60px !important;
  padding: 0 4px !important;
}

.uppercase-none {
  text-transform: none !important;
  letter-spacing: 0.01em;
}

:deep(.v-btn__overlay) {
  display: none;
}

.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.2s ease;
}
</style>
