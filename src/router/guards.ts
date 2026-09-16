import type { NavigationGuard, RouteLocationNormalized } from 'vue-router'

type AuthGuardStore = {
  initialize: () => Promise<unknown>
  sessionStatus: string
  isVerified: boolean
}

export function safeRedirect(value: unknown) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return undefined
  }

  return value
}

export function createAuthGuard(authStore: AuthGuardStore): NavigationGuard {
  return async (to: RouteLocationNormalized) => {
    await authStore.initialize()

    const isAuthenticated = authStore.sessionStatus === 'authenticated'

    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        return {
          name: 'Login',
          query: { redirect: to.fullPath },
        }
      }

      if (to.name === 'VerifyEmail' && authStore.isVerified) {
        return { name: 'Dashboard' }
      }

      if (!to.meta.allowUnverified && !authStore.isVerified) {
        return { name: 'VerifyEmail' }
      }
    }

    if (to.meta.guestOnly && isAuthenticated) {
      return authStore.isVerified ? { name: 'Dashboard' } : { name: 'VerifyEmail' }
    }

    return undefined
  }
}
