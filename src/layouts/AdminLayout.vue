<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      color="primary"
      elevation="4"
    >
      <v-list class="pa-4">
        <v-list-item
          prepend-icon="mdi-church"
          title="Church Manager"
          subtitle="Admin Suite"
          class="mb-4"
        />

        <v-divider class="mb-4" />

        <!-- Navigation Links -->
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          link
          rounded="lg"
          class="mb-1"
        />
      </v-list>

      <template #append>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          class="ma-2 rounded-lg text-error"
          @click="handleLogout"
        />
      </template>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar elevation="0" border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="font-weight-bold text-primary">
        Church MS
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-bell-outline" class="mr-2" />

      <v-avatar color="grey-lighten-3" size="36" class="mr-4">
        <v-icon icon="mdi-account" color="primary" />
      </v-avatar>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="bg-background">
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const drawer = ref(true)

const router = useRouter()
const auth = useAuthStore()

const navItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    path: '/admin/dashboard',
  },
   {
    title: 'Tasks',
    icon: 'mdi-view-list',
    path: '/admin/tasks',
  },

  {
    title: 'Member Directory',
    icon: 'mdi-account-group-outline',
    path: '/admin/members',
  },
  {
    title: 'Finances',
    icon: 'mdi-cash-multiple',
    path: '/admin/finances',
  },
   {
    title: 'Project Board',
    icon: 'mdi-view-column',
    path: '/admin/projects',
  },
  {
    title: 'Resources',
    icon: 'mdi-cloud-upload-outline',
    path: '/admin/resources',
  },
 {
    title: 'Analytics',
    icon: 'mdi-cog-outline',
    path: '/admin/analytics',
  },
 {
    title: 'Communication Center',
    icon: 'mdi-cog-outline',
    path: '/admin/communication',
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    path: '/admin/settings',
  },
]

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
