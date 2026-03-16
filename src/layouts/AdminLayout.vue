<template>
  <div class="admin-layout">
    <!-- Sidebar Navigation - Ancient Scroll Style -->
    <v-navigation-drawer
      v-model="drawer"
      color="primary"
      elevation="0"
      class="border-r"
    >
      <div class="pa-6 text-center">
        <v-avatar color="primary-lighten-1" size="64" rounded="md" class="mb-3 border-thin">
          <v-icon icon="mdi-church" color="white" size="32" />
        </v-avatar>
        <h2 class="text-subtitle-1 font-weight-bold text-white uppercase-none">Church Manager</h2>
        <p class="text-caption text-primary-lighten-4 uppercase-none opacity-70">Admin Suite</p>
      </div>

      <v-divider class="border-opacity-25 mx-4" />

      <v-list class="pa-4" density="compact">
        <!-- Navigation Links -->
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          link
          rounded="md"
          class="mb-1 nav-item-custom"
          active-class="bg-primary-darken-1"
        />
      </v-list>

      <template #append>
        <div class="pa-4">
          <BaseButton
            variant="tonal"
            color="white"
            block
            size="small"
            rounded="md"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Sign Out
          </BaseButton>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top Bar - Floating Modern Style -->
    <v-app-bar 
      elevation="0" 
      class="border-b" 
      color="rgba(250, 246, 240, 0.8)"
      density="comfortable"
      flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" color="primary" />

      <v-toolbar-title class="font-weight-bold text-primary text-subtitle-1">
        {{ currentRouteTitle }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon variant="text" color="primary" @click="router.push('/admin/notifications')">
        <v-badge
          v-if="notificationStore.unreadCount"
          color="error"
          dot
          offset-x="2"
          offset-y="2"
        >
          <v-icon icon="mdi-bell-outline" size="22" />
        </v-badge>
        <v-icon v-else icon="mdi-bell-outline" size="22" />
      </v-btn>

      <v-btn icon variant="text" class="mr-2" @click="router.push('/admin/profile')">
        <v-avatar size="32" color="primary-lighten-4">
          <v-icon icon="mdi-account-circle" color="primary" size="24" />
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="bg-background">
      <v-container fluid class="pa-6">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

const drawer = ref(true)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const notificationStore = useNotificationStore()

const currentRouteTitle = computed(() => route.meta.title || 'Admin')

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/admin/dashboard' },
  { title: 'Tasks', icon: 'mdi-clipboard-check', path: '/admin/tasks' },
  { title: 'Member Directory', icon: 'mdi-account-group', path: '/admin/members' },
  { title: 'Finances', icon: 'mdi-cash-register', path: '/admin/finances' },
  { title: 'Project Board', icon: 'mdi-view-column', path: '/admin/projects' },
  { title: 'Resources', icon: 'mdi-cloud-upload', path: '/admin/resources' },
  { title: 'Reports', icon: 'mdi-chart-areaspline', path: '/admin/reports' },
  { title: 'Communication', icon: 'mdi-chat-processing', path: '/admin/communication' },
  { title: 'Settings', icon: 'mdi-cog', path: '/admin/settings' },
]

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: var(--color-background);
}

.border-r {
  border-right: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-b {
  border-bottom: 1px solid rgba(121, 85, 72, 0.1) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-item-custom {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.2s ease;
}

.nav-item-custom:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.uppercase-none {
  text-transform: none !important;
}

.opacity-70 {
  opacity: 0.7;
}

.border-thin {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}
</style>
