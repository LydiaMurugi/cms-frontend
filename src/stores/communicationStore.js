import { defineStore } from 'pinia'

export const useCommunicationStore = defineStore('communication', {
  state: () => ({
    chats: [],
    activeChat: null,
    messages: [],
    loading: false,
  }),

  getters: {
    unreadCount: (state) =>
      state.chats.reduce((sum, c) => sum + (c.unread || 0), 0),
  },

  actions: {
    loadChats() {
      // 🔁 mock for now — later Django
      this.chats = [
        {
          id: 1,
          name: 'Pastor Michael Smith',
          lastMessage: 'See you at the board meeting.',
          time: '10:45 AM',
          online: true,
          unread: 2,
        },
        {
          id: 2,
          name: 'John Doe',
          lastMessage: 'Thank you for the tithe report!',
          time: 'Yesterday',
          online: false,
        },
      ]
    },
 
    openChat(chat) {
      this.activeChat = chat
      chat.unread = 0

      // mock messages per chat
      this.messages = [
        {
          text: 'Hello Pastor, do we have the final list?',
          sender: 'me',
          time: '10:30 AM',
        },
        {
          text: 'Yes, I emailed it.',
          sender: 'them',
          time: '10:35 AM',
        },
      ]
    },

    sendMessage(text) {
      if (!text.trim()) return

      this.messages.push({
        text,
        sender: 'me',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    },
  },
})
