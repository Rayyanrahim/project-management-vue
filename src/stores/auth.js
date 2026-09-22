import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  forgotPasswordApi,
  getMeApi,
  loginApi,
  logoutApi,
  refreshSessionApi,
  registerApi,
  resetPasswordApi,
  validatePasswordResetTokenApi,
  verifyOtpApi,
} from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const sessionStatus = ref('')
  const loadingAction = ref(null)
  const passwordResetEmail = ref('')
  let initializePromise = null

  const loading = computed(() => loadingAction.value !== null)
  const isAuthenticated = computed(() => sessionStatus.value === 'authenticated')
  const isVerified = computed(() => isAuthenticated.value && Boolean(user.value?.emailVerifiedAt))

  const login = async (credentials) => {
    loadingAction.value = 'login'

    try {
      const { verification, ...userProfile } = await loginApi(credentials)
      user.value = userProfile
      sessionStatus.value = 'authenticated'
      return { user: userProfile, verification }
    } finally {
      loadingAction.value = null
    }
  }

  const register = async (payload) => {
    loadingAction.value = 'register'

    try {
      const { verification, ...userProfile } = await registerApi(payload)
      user.value = userProfile
      sessionStatus.value = 'authenticated'
      return { user: userProfile, verification }
    } finally {
      loadingAction.value = null
    }
  }

  const verifyOtp = async (payload) => {
    loadingAction.value = 'verifyOtp'

    try {
      const { verification, ...userProfile } = await verifyOtpApi(payload)
      user.value = userProfile
      sessionStatus.value = 'authenticated'
      return { user: userProfile, verification }
    } finally {
      loadingAction.value = null
    }
  }

  const forgotPassword = async (payload) => {
    loadingAction.value = 'forgotPassword'

    try {
      const result = await forgotPasswordApi(payload)
      passwordResetEmail.value = payload.email
      return result
    } finally {
      loadingAction.value = null
    }
  }

  const resetPassword = async (payload) => {
    loadingAction.value = 'resetPassword'

    try {
      return await resetPasswordApi(payload)
    } finally {
      loadingAction.value = null
    }
  }

  const validatePasswordResetToken = async (token) => {
    loadingAction.value = 'validatePasswordResetToken'

    try {
      return await validatePasswordResetTokenApi(token)
    } finally {
      loadingAction.value = null
    }
  }

  const refreshSession = async () => {
    const response = await refreshSessionApi()
    sessionStatus.value = 'authenticated'
    return response
  }

  const getMe = async () => {
    const currentUser = await getMeApi()
    user.value = currentUser
    sessionStatus.value = 'authenticated'
    return currentUser
  }

  const clearAuth = () => {
    user.value = null
    sessionStatus.value = 'guest'
  }

  const initialize = () => {
    if (!initializePromise) {
      initializePromise = (async () => {
        try {
          await getMe()
        } catch {
          clearAuth()
        }
      })()
    }

    return initializePromise
  }

  const logout = async () => {
    loadingAction.value = 'logout'

    try {
      return await logoutApi()
    } finally {
      clearAuth()
      loadingAction.value = null
    }
  }

  return {
    user,
    sessionStatus,
    loadingAction,
    passwordResetEmail,
    loading,
    isAuthenticated,
    isVerified,
    initialize,
    register,
    login,
    verifyOtp,
    forgotPassword,
    validatePasswordResetToken,
    resetPassword,
    refreshSession,
    getMe,
    logout,
    clearAuth,
  }
})
