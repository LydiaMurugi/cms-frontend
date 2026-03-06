<template>
  <v-container fluid class="bg-background pa-0 fill-height align-start">
    <v-row no-gutters class="fill-height">

      <!-- Left Sidebar: Chat List -->
      <v-col cols="12" md="4" lg="3" class="border-e fill-height bg-white">
        <v-toolbar color="white" flat border="b">
          <v-toolbar-title class="font-weight-bold text-primary">
            Messages
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon="mdi-plus-circle-outline"
            color="primary"
          />
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search conversations..."
            variant="solo-filled"
            flat
            density="compact"
            hide-details
            rounded="lg"
          />
        </v-card-text>

        <v-divider />

        <v-list
          lines="two"
          class="pa-0 chat-list overflow-y-auto"
          style="height: calc(100vh - 180px)"
        >
          <v-list-item
            v-for="chat in filteredChats"
            :key="chat.id"
            :active="store.activeChat?.id === chat.id"
            @click="store.openChat(chat)"
            class="px-4 py-3 border-b"
            color="primary"
          >
            <template #prepend>
              <v-badge
                :color="chat.online ? 'success' : 'grey'"
                dot
                location="bottom end"
                offset-x="3"
                offset-y="3"
              >
                <v-avatar color="primary-lighten-4">
                  <span class="text-primary font-weight-bold">
                    {{ chat.name.charAt(0) }}
                  </span>
                </v-avatar>
              </v-badge>
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ chat.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-truncate">
              {{ chat.lastMessage }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end">
                <span class="text-caption text-grey mb-1">
                  {{ chat.time }}
                </span>
                <v-badge
                  v-if="chat.unread"
                  :content="chat.unread"
                  color="error"
                  inline
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Right Side: Chat Window -->
      <v-col cols="12" md="8" lg="9" class="d-flex flex-column fill-height">

        <!-- Active Chat -->
        <template v-if="store.activeChat">

          <!-- Chat Header -->
          <v-toolbar color="white" flat border="b">
            <v-list-item class="pa-0">
              <template #prepend>
                <v-avatar color="primary-lighten-4" size="40" class="mx-3">
                  <span class="text-primary font-weight-bold">
                    {{ store.activeChat.name.charAt(0) }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ store.activeChat.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ store.activeChat.online ? 'Online' : 'Away' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-spacer />
            <v-btn icon="mdi-phone-outline" variant="text"></v-btn>
            <v-btn icon="mdi-information-outline" variant="text"></v-btn>
          </v-toolbar>

          <!-- Message Area -->
          <v-sheet
            ref="chatBox"
            class="flex-grow-1 bg-grey-lighten-4 pa-6 overflow-y-auto"
          >
            <div
              v-for="(msg, i) in store.messages"
              :key="i"
              :class="[
                'd-flex mb-4',
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'pa-3 rounded-lg max-width-70 elevation-1',
                  msg.sender === 'me'
                    ? 'bg-primary text-white rounded-be-0'
                    : 'bg-white text-black rounded-bs-0'
                ]"
              >
                <div class="text-body-2">{{ msg.text }}</div>
                <div
                  class="text-caption mt-1"
                  :class="msg.sender === 'me' ? 'text-blue-lighten-4' : 'text-grey'"
                >
                  {{ msg.time }}
                </div>
              </div>
            </div>
          </v-sheet>

          <!-- Input Area -->
          <v-sheet class="pa-4 border-t bg-white">
            <v-row dense align="center">
              <v-col>
                <v-text-field
                  v-model="newMessage"
                  placeholder="Type a message..."
                  variant="solo-filled"
                  flat
                  hide-details
                  density="comfortable"
                  rounded="pill"
                  @keyup.enter="sendMessage"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon="mdi-send"
                  color="primary"
                  :disabled="!newMessage.trim()"
                  @click="sendMessage"
                />
              </v-col>
            </v-row>
          </v-sheet>

        </template>

        <!-- Empty State -->
        <v-sheet
          v-else
          class="fill-height d-flex flex-column align-center justify-center bg-grey-lighten-5"
        >
          <v-icon icon="mdi-forum-outline" size="100" color="grey-lighten-2" />
          <div class="text-h6 text-grey mt-4">
            Select a conversation to start chatting
          </div>
          <v-btn color="primary" variant="tonal" class="mt-4">
            Start a new conversation
          </v-btn>
        </v-sheet>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCommunicationStore } from '@/stores/communicationStore'
import { useChatScroll } from '@/composables/useChatScroll'

const store = useCommunicationStore()

const searchQuery = ref('')
const newMessage = ref('')
const chatBox = ref(null)

onMounted(() => {
  store.loadChats()
})

useChatScroll(store.messages, chatBox)

const filteredChats = computed(() =>
  store.chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  store.sendMessage(newMessage.value)
  newMessage.value = ''
}
</script>

<style scoped>
.chat-list {
  scrollbar-width: thin;
}
.max-width-70 {
  max-width: 70%;
}
.rounded-be-0 {
  border-bottom-right-radius: 0 !important;
}
.rounded-bs-0 {
  border-bottom-left-radius: 0 !important;
}
</style>
