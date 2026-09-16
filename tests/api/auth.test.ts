import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from '@/api/http'
import * as authApi from '@/api/auth'

vi.mock('@/api/http', () => ({
  http: {
    post: vi.fn(),
  },
}))

describe('auth API', () => {
  beforeEach(() => {
    vi.mocked(http.post).mockReset()
  })

  it.each([
    [
      'registerApi',
      'auth/register',
      { name: 'A', email: 'a@example.com', password: 'password1' },
    ],
    ['loginApi', 'auth/login', { email: 'a@example.com', password: 'password1' }],
    ['verifyOtpApi', 'auth/verify-otp', { otp: '123456' }],
    ['forgotPasswordApi', 'auth/forgot-password', { email: 'a@example.com' }],
    [
      'resetPasswordApi',
      'auth/reset-password',
      {
        token: 'a'.repeat(64),
        password: 'password1',
        confirmPassword: 'password1',
      },
    ],
  ])('%s posts the expected payload to %s', async (exportName, path, payload) => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { status: 'success', data: { id: '1' } },
    })

    const result = await (authApi as Record<string, (value: unknown) => Promise<unknown>>)[
      exportName
    ]?.(payload)

    expect(http.post).toHaveBeenCalledWith(path, payload)
    expect(result).toEqual({ id: '1' })
  })

  it('opts the refresh request out of response-interceptor refresh', async () => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { status: 'success', message: 'Token refreshed successfully' },
    })

    const result = await authApi.refreshSessionApi()

    expect(http.post).toHaveBeenCalledWith('auth/refresh', undefined, {
      skipAuthRefresh: true,
    })
    expect(result).toEqual({
      status: 'success',
      message: 'Token refreshed successfully',
    })
  })

  it('posts logout and preserves a success envelope with no data', async () => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { status: 'success', message: 'Logged out successfully.' },
    })

    const result = await authApi.logoutApi()

    expect(http.post).toHaveBeenCalledWith('auth/logout')
    expect(result.message).toBe('Logged out successfully.')
  })
})
