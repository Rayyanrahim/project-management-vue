import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { configureHttpAuth } from '@/api/http'
import router from './router'
import { createAuthGuard } from '@/router/guards'
import { useAuthStore } from '@/stores/auth'
import '@/css/main.css'

const app = createApp(App)
const pinia = createPinia()
const authStore = useAuthStore(pinia)

configureHttpAuth({
  refresh: () => authStore.refreshSession(),
  onUnauthorized: () => authStore.clearAuth(),
})

router.beforeEach(createAuthGuard(authStore))

app.use(pinia)
app.use(router)

app.mount('#app')
