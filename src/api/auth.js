import { http } from './http'

const unwrapResponse = (response) =>
  Object.prototype.hasOwnProperty.call(response.data, 'data') ? response.data.data : response.data

export const registerApi = async (payload) => {
  const response = await http.post('auth/register', payload)
  return unwrapResponse(response)
}

export const loginApi = async (credentials) => {
  const response = await http.post('auth/login', credentials)
  console.log('loginApi response:', response)
  return unwrapResponse(response)
}

export const verifyOtpApi = async (payload) => {
  const response = await http.post('auth/verify-otp', payload)
  return unwrapResponse(response)
}

export const refreshSessionApi = async () => {
  const response = await http.post('auth/refresh', undefined, {
    skipAuthRefresh: true,
  })
  return unwrapResponse(response)
}

export const getMeApi = async () => {
  const response = await http.get('auth/me')
  return unwrapResponse(response)
}

export const logoutApi = async () => {
  const response = await http.post('auth/logout')
  return unwrapResponse(response)
}

export const forgotPasswordApi = async (payload) => {
  const response = await http.post('auth/forgot-password', payload)
  return unwrapResponse(response)
}

export const validatePasswordResetTokenApi = async (token) => {
  const response = await http.get(`auth/reset-password/${encodeURIComponent(token)}`)
  return unwrapResponse(response)
}

export const resetPasswordApi = async (payload) => {
  const response = await http.post('auth/reset-password', payload)
  return unwrapResponse(response)
}
