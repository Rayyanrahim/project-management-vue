import {
  AxiosError,
  type AxiosAdapter,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, configureHttpAuth, createHttpClient } from '@/api/http'

function makeResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse {
  return {
    config,
    status,
    data,
    statusText: String(status),
    headers: {},
  }
}

function rejectWithResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
) {
  return Promise.reject(
    new AxiosError(
      'Request failed',
      'ERR_BAD_RESPONSE',
      config,
      undefined,
      makeResponse(config, status, data),
    ),
  )
}

describe('HTTP client', () => {
  beforeEach(() => {
    configureHttpAuth({})
  })

  it('uses credentials and converts backend validation failures to ApiError', async () => {
    const adapter: AxiosAdapter = async (config) =>
      rejectWithResponse(config, 422, {
        status: 'error',
        message: 'Validation errors found',
        messageCode: 'VALIDATION_ERROR',
        errors: { email: 'Email is required' },
      })
    const client = createHttpClient({ adapter })

    const request = client.post('auth/login', {})

    await expect(request).rejects.toMatchObject<Partial<ApiError>>({
      name: 'ApiError',
      message: 'Validation errors found',
      messageCode: 'VALIDATION_ERROR',
      httpStatus: 422,
      errors: { email: 'Email is required' },
    })
    expect(client.defaults.withCredentials).toBe(true)
  })

  it('refreshes concurrent unauthorized requests once and retries each once', async () => {
    let authenticated = false
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      if (!authenticated) {
        return rejectWithResponse(config, 401, {
          status: 'error',
          message: 'Access token expired.',
          messageCode: 'ACCESS_TOKEN_EXPIRED',
        })
      }

      return makeResponse(config, 200, { status: 'success', data: config.url })
    })
    const refresh = vi.fn(async () => {
      authenticated = true
    })
    configureHttpAuth({ refresh })
    const client = createHttpClient({ adapter })

    const responses = await Promise.all([client.get('one'), client.get('two')])

    expect(refresh).toHaveBeenCalledOnce()
    expect(responses.map(({ data }) => data.data)).toEqual(['one', 'two'])
    expect(adapter).toHaveBeenCalledTimes(4)
  })

  it('does not refresh requests that opt out', async () => {
    const adapter: AxiosAdapter = async (config) =>
      rejectWithResponse(config, 401, {
        status: 'error',
        message: 'Session expired.',
        messageCode: 'SESSION_EXPIRED',
      })
    const refresh = vi.fn()
    configureHttpAuth({ refresh })
    const client = createHttpClient({ adapter })

    await expect(
      client.post('auth/refresh', undefined, {
        skipAuthRefresh: true,
      } as AxiosRequestConfig),
    ).rejects.toMatchObject({ messageCode: 'SESSION_EXPIRED' })
    expect(refresh).not.toHaveBeenCalled()
  })

  it('does not loop and reports a terminal refresh failure', async () => {
    const adapter: AxiosAdapter = async (config) =>
      rejectWithResponse(config, 401, {
        status: 'error',
        message: 'Session expired.',
        messageCode: 'SESSION_EXPIRED',
      })
    const refreshError = new ApiError('Refresh failed', { httpStatus: 401 })
    const onUnauthorized = vi.fn()
    const refresh = vi.fn().mockRejectedValue(refreshError)
    configureHttpAuth({ refresh, onUnauthorized })
    const client = createHttpClient({ adapter })

    await expect(client.get('private')).rejects.toBe(refreshError)
    expect(refresh).toHaveBeenCalledOnce()
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
