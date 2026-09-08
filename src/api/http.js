import axios from 'axios'

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'ApiError'
    this.cause = options.cause
    this.status = options.status ?? 'error'
    this.httpStatus = options.httpStatus
    this.messageCode = options.messageCode
    this.code = options.code
    this.errors = options.errors
    this.data = options.data
  }
}

let authHandlers = {}

export const configureHttpAuth = (handlers) => {
  authHandlers = handlers
}

const isValidationErrors = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  return Object.values(value).every(
    (messages) =>
      typeof messages === 'string' ||
      (Array.isArray(messages) && messages.every((message) => typeof message === 'string')),
  )
}

const isResponseBody = (value) =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

const createApiError = (body, httpStatus, fallbackMessage, options = {}) =>
  new ApiError(
    typeof body.message === 'string' && body.message.trim()
      ? body.message
      : fallbackMessage,
    {
      status: typeof body.status === 'string' ? body.status : 'error',
      httpStatus,
      messageCode: typeof body.messageCode === 'string' ? body.messageCode : undefined,
      code: options.code,
      errors: isValidationErrors(body.errors) ? body.errors : undefined,
      data: body.data,
      cause: options.cause,
    },
  )

const toApiError = (error) => {
  if (error instanceof ApiError) return error

  if (!axios.isAxiosError(error)) {
    return new ApiError(error instanceof Error ? error.message : 'Unexpected error', {
      cause: error,
    })
  }

  const body = isResponseBody(error.response?.data) ? error.response.data : {}

  return createApiError(body, error.response?.status, error.message || 'Request failed', {
    code: error.code,
    cause: error,
  })
}

export const createHttpClient = (config = {}) => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...config,
  })

  client.interceptors.request.use(async (request) => {
    const hasAuthorizationHeader = Boolean(request.headers.get('Authorization'))

    if (!hasAuthorizationHeader) {
      const accessToken = await authHandlers.getAccessToken?.()

      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`)
      }
    }

    return request
  })

  client.interceptors.response.use(
    (response) => {
      if (isResponseBody(response.data) && response.data.status === 'error') {
        return Promise.reject(createApiError(response.data, response.status, 'Request failed'))
      }

      return response
    },
    async (error) => {
      const apiError = toApiError(error)

      if (apiError.httpStatus === 401) {
        await authHandlers.onUnauthorized?.(apiError)
      }

      return Promise.reject(apiError)
    },
  )

  return client
}

export const http = createHttpClient()
