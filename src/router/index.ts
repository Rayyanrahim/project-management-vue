import { createRouter, createWebHistory } from 'vue-router'
import { appRoutes } from './app'
import { authRoutes } from './auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...appRoutes, ...authRoutes],
})

export default router
