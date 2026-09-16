import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  refreshSessionApi,
  registerApi,
  resetPasswordApi,
  verifyOtpApi,
} from '@/api/auth'

const PROFILE_KEY = 'project-management.auth-profile'

const readStoredProfile = () => {
  try {
    const value = localStorage.getItem(PROFILE_KEY)
    if (!value) return null

    const profile = JSON.parse(value)
    return profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : null
  } catch {
    return null
  }
}

const writeStoredProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Storage is a display cache only; cookie authentication must keep working without it.
  }
}

const removeStoredProfile = () => {
  try {
    localStorage.removeItem(PROFILE_KEY)
  } catch {
    // Storage is optional.
  }
}

const splitAuthPayload = (payload = {}) => {
  const { verification, ...user } = payload
  return { user, verification }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const sessionStatus = ref('unknown')
  const loadingAction = ref(null)
  let initializePromise = null

  const loading = computed(() => loadingAction.value !== null)
  const isAuthenticated = computed(() => sessionStatus.value === 'authenticated')
  const isVerified = computed(
    () => isAuthenticated.value && Boolean(user.value?.emailVerifiedAt),
  )

  const applyAuthenticatedProfile = (profile) => {
    user.value = profile
    sessionStatus.value = 'authenticated'
    writeStoredProfile(profile)
  }

  const applyAuthPayload = (payload) => {
    const result = splitAuthPayload(payload)
    applyAuthenticatedProfile(result.user)
    return result
  }

  const runAction = async (name, action) => {
    loadingAction.value = name

    try {
      return await action()
    } finally {
      loadingAction.value = null
    }
  }

  const login = async (credentials) => {
    return runAction('login', async () => applyAuthPayload(await loginApi(credentials)))
  }

  const register = async (payload) => {
    return runAction('register', async () => applyAuthPayload(await registerApi(payload)))
  }

  const verifyOtp = async (payload) => {
    return runAction('verifyOtp', async () => applyAuthPayload(await verifyOtpApi(payload)))
  }

  const forgotPassword = async (payload) => {
    return runAction('forgotPassword', () => forgotPasswordApi(payload))
  }

  const resetPassword = async (payload) => {
    return runAction('resetPassword', () => resetPasswordApi(payload))
  }

  const refreshSession = async () => {
    const response = await refreshSessionApi()
    const cachedProfile = user.value ?? readStoredProfile()

    user.value = cachedProfile
    sessionStatus.value = 'authenticated'
    return response
  }

  const clearAuth = () => {
    user.value = null
    sessionStatus.value = 'guest'
    removeStoredProfile()
  }

  const initialize = () => {
    if (!initializePromise) {
      initializePromise = (async () => {
        try {
          await refreshSession()
        } catch {
          clearAuth()
        }
      })()
    }

    return initializePromise
  }

  const logout = async () => {
    return runAction('logout', async () => {
      try {
        return await logoutApi()
      } finally {
        clearAuth()
      }
    })
  }

  return {
    user,
    sessionStatus,
    loadingAction,
    loading,
    isAuthenticated,
    isVerified,
    initialize,
    register,
    login,
    verifyOtp,
    forgotPassword,
    resetPassword,
    refreshSession,
    logout,
    clearAuth,
  }
})
