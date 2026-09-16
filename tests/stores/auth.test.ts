import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  refreshSessionApi,
  registerApi,
  resetPasswordApi,
  verifyOtpApi,
} from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/api/auth', () => ({
  forgotPasswordApi: vi.fn(),
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  refreshSessionApi: vi.fn(),
  registerApi: vi.fn(),
  resetPasswordApi: vi.fn(),
  verifyOtpApi: vi.fn(),
}))

const PROFILE_KEY = 'project-management.auth-profile'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('stores a login user without persisting verification transport data', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      id: '7',
      email: 'person@example.com',
      emailVerifiedAt: null,
      verification: { id: '10', status: 'PENDING' },
      workspaceMemberships: [],
    })
    const store = useAuthStore()

    const result = await store.login({
      email: 'person@example.com',
      password: 'password1',
    })

    expect(store.sessionStatus).toBe('authenticated')
    expect(store.user).not.toHaveProperty('verification')
    expect(store.isAuthenticated).toBe(true)
    expect(store.isVerified).toBe(false)
    expect(result.verification).toEqual({ id: '10', status: 'PENDING' })
    expect(localStorage.getItem(PROFILE_KEY)).not.toContain('verification')
  })

  it('registers and verifies a user through the same normalized session boundary', async () => {
    vi.mocked(registerApi).mockResolvedValueOnce({
      id: '7',
      email: 'person@example.com',
      emailVerifiedAt: null,
      verification: { status: 'PENDING' },
    })
    vi.mocked(verifyOtpApi).mockResolvedValueOnce({
      id: '7',
      email: 'person@example.com',
      emailVerifiedAt: '2026-09-16T12:00:00.000Z',
      verification: { status: 'VERIFIED' },
    })
    const store = useAuthStore()

    await store.register({ name: 'Person', email: 'person@example.com', password: 'password1' })
    expect(store.isVerified).toBe(false)

    const result = await store.verifyOtp({ otp: '123456' })
    expect(verifyOtpApi).toHaveBeenCalledWith({ otp: '123456' })
    expect(store.isVerified).toBe(true)
    expect(result.verification.status).toBe('VERIFIED')
  })

  it('deduplicates initialization and validates cached display data with refresh', async () => {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        id: '7',
        email: 'person@example.com',
        emailVerifiedAt: '2026-09-16T12:00:00.000Z',
      }),
    )
    vi.mocked(refreshSessionApi).mockResolvedValue({
      status: 'success',
      message: 'Token refreshed successfully',
    })
    const store = useAuthStore()

    await Promise.all([store.initialize(), store.initialize()])

    expect(refreshSessionApi).toHaveBeenCalledOnce()
    expect(store.sessionStatus).toBe('authenticated')
    expect(store.user?.email).toBe('person@example.com')
  })

  it('becomes a guest and removes stale display data when initialization fails', async () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ id: '7' }))
    vi.mocked(refreshSessionApi).mockRejectedValueOnce(new Error('expired'))
    const store = useAuthStore()

    await store.initialize()

    expect(store.sessionStatus).toBe('guest')
    expect(store.user).toBeNull()
    expect(localStorage.getItem(PROFILE_KEY)).toBeNull()
  })

  it('delegates password flows without changing the current session', async () => {
    vi.mocked(forgotPasswordApi).mockResolvedValueOnce({
      status: 'success',
      message: 'Email sent',
    })
    vi.mocked(resetPasswordApi).mockResolvedValueOnce({
      status: 'success',
      message: 'Password reset successfully.',
    })
    const store = useAuthStore()

    await expect(store.forgotPassword({ email: 'person@example.com' })).resolves.toMatchObject({
      message: 'Email sent',
    })
    await expect(
      store.resetPassword({
        token: 'a'.repeat(64),
        password: 'password1',
        confirmPassword: 'password1',
      }),
    ).resolves.toMatchObject({ message: 'Password reset successfully.' })
    expect(store.sessionStatus).toBe('unknown')
  })

  it('always clears local auth when remote logout fails', async () => {
    vi.mocked(loginApi).mockResolvedValueOnce({
      id: '7',
      email: 'person@example.com',
      emailVerifiedAt: '2026-09-16T12:00:00.000Z',
    })
    vi.mocked(logoutApi).mockRejectedValueOnce(new Error('offline'))
    const store = useAuthStore()
    await store.login({ email: 'person@example.com', password: 'password1' })

    await expect(store.logout()).rejects.toThrow('offline')

    expect(store.sessionStatus).toBe('guest')
    expect(store.user).toBeNull()
    expect(localStorage.getItem(PROFILE_KEY)).toBeNull()
  })

  it('cleans up loading state when an action rejects', async () => {
    vi.mocked(loginApi).mockRejectedValueOnce(new Error('offline'))
    const store = useAuthStore()
    const request = store.login({ email: 'person@example.com', password: 'password1' })

    expect(store.loading).toBe(true)
    expect(store.loadingAction).toBe('login')
    await expect(request).rejects.toThrow('offline')
    expect(store.loading).toBe(false)
    expect(store.loadingAction).toBeNull()
  })
})
