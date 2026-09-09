import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  const login = async (credentials) => {
    loading.value = true

    try {
      const result = await loginApi(credentials)
      user.value = result.user ?? result
      return result
    } finally {
      loading.value = false
    }
  }

  const clearAuth = () => {
    user.value = null
  }

  return { user, loading, isAuthenticated, login, clearAuth }
})
