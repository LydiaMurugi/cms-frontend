<template>
  <v-app>

    <!-- Top App Bar -->
    <v-app-bar elevation="0" border="b" color="white">
      <template #prepend>
        <v-avatar color="primary" size="32" class="ml-2">
          <v-icon icon="mdi-church" color="white" size="18" />
        </v-avatar>
      </template>

      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-primary">
        Our Church
      </v-toolbar-title>

      <v-spacer />

      <!-- Notifications -->
      <v-btn icon @click="store.goToNotifications">
        <v-badge
          v-if="store.unreadNotifications"
          color="error"
          dot
          offset-x="2"
          offset-y="2"
        >
          <v-icon icon="mdi-bell-outline" />
        </v-badge>
        <v-icon v-else icon="mdi-bell-outline" />
      </v-btn>

      <!-- Profile Menu -->
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-avatar
            v-bind="props"
            size="32"
            color="grey-lighten-3"
            class="mr-4"
          >
            <v-icon icon="mdi-account" color="primary" size="20" />
          </v-avatar>
        </template>

        <v-list density="compact">
          <v-list-item @click="store.goToProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item @click="store.logoutMember">
            <v-list-item-title class="text-error">
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- ✅ FIX: v-app-bar closed properly -->

    <!-- Main Content -->
    <v-main class="bg-background mb-16">
      <v-container fluid class="pa-0">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="store.activeTab"
      grow
      color="primary"
      elevation="4"
      border="t"
    >
      <v-btn
        v-for="item in store.navItems"
        :key="item.value"
        :value="item.value"
        :to="item.path"
        @click="store.setActiveTab(item.value)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>


<script setup>
import { useMemberUiStore } from '@/stores/memberUiStore'

const store = useMemberUiStore()
</script>

<style scoped>
.v-main {
  padding-bottom: 64px !important;
}

.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.2s ease;
}
</style>
