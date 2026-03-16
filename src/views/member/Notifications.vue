<template>
  <div class="notifications-view">
    <!-- Page Header - Flat and Centered -->
    <div class="mb-6 px-2">
      <h1 class="text-h5 font-weight-bold text-primary mb-1">Notifications</h1>
      <p class="text-caption text-grey-darken-1">Stay updated on important church announcements.</p>
    </div>

    <!-- Error Alert -->
    <v-alert v-if="error" type="error" variant="tonal" density="compact" rounded="md" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4 rounded-pill" height="2" />

    <!-- Notifications List -->
    <template v-if="notifications.length > 0">
      <div class="notifications-list">
        <BaseCard
          v-for="notification in notifications"
          :key="notification.id"
          elevation="0"
          rounded="md"
          class="mb-2 border-thin"
          :class="notification.read ? 'bg-white' : 'bg-parchment-light'"
          no-padding
        >
          <v-list-item class="py-3 px-4">
            <template #prepend>
              <v-avatar
                :color="notification.read ? 'grey-lighten-4' : 'primary-lighten-5'"
                size="36"
                rounded="md"
                class="mr-3"
              >
                <v-icon
                  :icon="notification.read ? 'mdi-bell-outline' : 'mdi-bell-ring-outline'"
                  :color="notification.read ? 'grey' : 'primary'"
                  size="18"
                />
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-subtitle-2"
              :class="{ 'font-weight-bold text-primary': !notification.read }"
            >
              {{ notification.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption mt-1">
              {{ notification.message }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end">
                <span class="text-tiny text-medium-emphasis mb-1">
                  {{ formatDate(notification.created_at) }}
                </span>

                <BaseButton
                  v-if="!notification.read"
                  variant="text"
                  color="primary"
                  size="x-small"
                  rounded="md"
                  @click="markAsRead(notification.id)"
                >
                  Mark read
                </BaseButton>
              </div>
            </template>
          </v-list-item>
        </BaseCard>
      </div>

      <!-- Mark All as Read -->
      <div class="d-flex justify-center mt-6">
        <BaseButton
          @click="markAllAsRead"
          color="primary"
          variant="tonal"
          size="small"
          rounded="md"
          :disabled="unreadCount === 0"
        >
          Mark All as Read
        </BaseButton>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="!loading">
      <BaseCard elevation="0" rounded="md" class="pa-10 text-center border-thin bg-white">
        <v-icon icon="mdi-bell-off-outline" size="48" color="grey-lighten-2" class="mb-3" />
        <h3 class="text-subtitle-1 font-weight-bold mb-1">No Notifications</h3>
        <p class="text-caption text-medium-emphasis">
          You're all caught up! Check back later for updates.
        </p>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

const loading = ref(false)
const error = ref(null)
const notifications = ref([])

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await notificationStore.fetchNotifications()
    notifications.value = notificationStore.notifications
  } catch (err) {
    error.value = 'Failed to load notifications'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const markAsRead = async (notificationId) => {
  try {
    await notificationStore.markAsRead(notificationId)
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  } catch (err) {
    error.value = 'Failed to mark notification as read'
    console.error(err)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
    notifications.value = notifications.value.map((n) => ({
      ...n,
      read: true,
    }))
  } catch (err) {
    error.value = 'Failed to mark all as read'
    console.error(err)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.notifications-view {
  max-width: 600px;
  margin: 0 auto;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.bg-parchment-light {
  background-color: #fdfaf7 !important;
}

.text-tiny {
  font-size: 0.65rem;
}
</style>
