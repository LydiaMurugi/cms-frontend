<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Notifications</v-card-title>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>

      <v-list v-if="notifications.length" :loading="loading">
        <v-list-item
          v-for="n in notifications"
          :key="n.id"
        >
          <v-list-item-title :class="{ 'text--secondary': n.read }">
            {{ n.title }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ n.message }}</v-list-item-subtitle>
          <v-list-item-action v-if="!n.read">
            <v-btn icon @click="markAsRead(n.id)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-alert v-else-if="!loading" type="info">No notifications.</v-alert>
      <v-card-actions>
        <v-btn
          @click="markAllAsRead"
          color="primary"
          :disabled="unreadCount === 0"
        >
          Mark All as Read
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const loading = computed(() => notificationStore.loading)
const error = computed(() => notificationStore.error)
const unreadCount = computed(() => notificationStore.unreadCount)

onMounted(() => {
  notificationStore.fetchNotifications()
})

const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}
</script>