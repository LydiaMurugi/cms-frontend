import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './stores/authStore'
// Use the project's main stylesheet — `src/style.css` exists and contains base rules.
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Use plugins FIRST
app.use(pinia)      // ← Pinia must be registered before any store is used
app.use(router)
app.use(vuetify)

// NOW it's safe to use stores
const auth = useAuthStore()
auth.checkAuth()

app.mount('#app')

console.log('✅ Church Management System initialized')
console.log('📦 Pinia stores loaded')
console.log('🎨 Vuetify theme applied')
console.log('🛣️ Router configured with auth guards')