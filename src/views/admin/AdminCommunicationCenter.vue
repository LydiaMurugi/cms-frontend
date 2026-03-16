<template>
  <div class="communication-center-view">
    <v-row no-gutters class="fill-height border-thin rounded-md overflow-hidden bg-white">

      <!-- Left Sidebar: Chat List -->
      <v-col cols="12" md="4" lg="3" class="border-e fill-height bg-white">
        <v-toolbar color="white" flat border="b" density="comfortable">
          <v-toolbar-title class="font-weight-bold text-primary text-subtitle-1">
            Messages
          </v-toolbar-title>
          <v-spacer />
          <BaseButton
            icon="mdi-plus-circle-outline"
            variant="text"
            color="primary"
            size="small"
          />
        </v-toolbar>

        <div class="pa-3">
          <BaseInput
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search..."
            hide-details
          />
        </div>

        <v-divider class="border-opacity-25" />

        <v-list
          lines="two"
          class="pa-0 chat-list overflow-y-auto bg-transparent"
          style="height: calc(100vh - 240px)"
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
                <v-avatar color="primary-lighten-5" size="40" rounded="md" class="border-thin">
                  <span class="text-primary font-weight-bold text-caption">
                    {{ chat.name.charAt(0) }}
                  </span>
                </v-avatar>
              </v-badge>
            </template>

            <v-list-item-title class="text-subtitle-2 font-weight-bold">
              {{ chat.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption text-truncate">
              {{ chat.lastMessage }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end">
                <span class="text-tiny text-medium-emphasis mb-1">
                  {{ chat.time }}
                </span>
                <v-badge
                  v-if="chat.unread"
                  :content="chat.unread"
                  color="primary"
                  inline
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Right Side: Chat Window -->
      <v-col cols="12" md="8" lg="9" class="d-flex flex-column fill-height bg-grey-lighten-5">

        <!-- Active Chat -->
        <template v-if="store.activeChat">

          <!-- Chat Header -->
          <v-toolbar color="white" flat border="b" density="comfortable">
            <v-list-item class="pa-0">
              <template #prepend>
                <v-avatar color="primary-lighten-5" size="36" rounded="md" class="mx-3 border-thin">
                  <span class="text-primary font-weight-bold text-caption">
                    {{ store.activeChat.name.charAt(0) }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-2 font-weight-bold">
                {{ store.activeChat.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-tiny">
                {{ store.activeChat.online ? 'Online' : 'Away' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-spacer />
            <BaseButton icon="mdi-phone-outline" variant="text" size="small" />
            <BaseButton icon="mdi-information-outline" variant="text" size="small" />
          </v-toolbar>

          <!-- Message Area -->
          <v-sheet
            ref="chatBox"
            class="flex-grow-1 bg-parchment-light pa-6 overflow-y-auto"
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
                  'pa-3 rounded-md max-width-70 border-thin',
                  msg.sender === 'me'
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                ]"
              >
                <div class="text-body-2">{{ msg.text }}</div>
                <div
                  class="text-tiny mt-1"
                  :class="msg.sender === 'me' ? 'text-primary-lighten-4' : 'text-medium-emphasis'"
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
                  variant="outlined"
                  hide-details
                  density="comfortable"
                  rounded="md"
                  color="primary"
                  @keyup.enter="sendMessage"
                />
              </v-col>
              <v-col cols="auto">
                <BaseButton
                  icon="mdi-send"
                  color="primary"
                  rounded="md"
                  :disabled="!newMessage.trim()"
                  @click="sendMessage"
                />
              </v-col>
            </v-row>
          </v-sheet>

        </template>

        <!-- Empty State -->
        <div
          v-else
          class="fill-height d-flex flex-column align-center justify-center"
        >
          <v-icon icon="mdi-forum-outline" size="80" color="grey-lighten-2" class="mb-4" />
          <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">
            Select a conversation to start chatting
          </div>
          <BaseButton color="primary" variant="tonal" size="small" class="mt-4" rounded="md">
            Start a new conversation
          </BaseButton>
        </div>

      </v-col>
    </v-row>
  </div>
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
.communication-center-view {
  height: calc(100vh - 120px);
}

.chat-list {
  scrollbar-width: thin;
}

.max-width-70 {
  max-width: 70%;
}

.border-thin {
  border: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-e {
  border-right: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.border-b {
  border-bottom: 1px solid rgba(121, 85, 72, 0.05) !important;
}

.border-t {
  border-top: 1px solid rgba(121, 85, 72, 0.1) !important;
}

.bg-parchment-light {
  background-color: #fcfaf7 !important;
}

.text-tiny {
  font-size: 0.65rem;
}
</style>
