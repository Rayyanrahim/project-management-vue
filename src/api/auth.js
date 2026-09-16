import { http } from './http'

const unwrapResponse = (response) =>
  Object.prototype.hasOwnProperty.call(response.data, 'data') ? response.data.data : response.data

export async function registerApi(payload) {
  const response = await http.post('auth/register', payload)
  return unwrapResponse(response)
}

export async function loginApi(credentials) {
  const response = await http.post('auth/login', credentials)
  console.log('loginApi response:', response)
  return unwrapResponse(response)
}

export async function verifyOtpApi(payload) {
  const response = await http.post('auth/verify-otp', payload)
  return unwrapResponse(response)
}

export async function refreshSessionApi() {
  const response = await http.post('auth/refresh', undefined, {
    skipAuthRefresh: true,
  })
  return unwrapResponse(response)
}

export async function getMeApi() {
  const response = await http.get('auth/me')
  return unwrapResponse(response)
}

export async function logoutApi() {
  const response = await http.post('auth/logout')
  return unwrapResponse(response)
}

export async function forgotPasswordApi(payload) {
  const response = await http.post('auth/forgot-password', payload)
  return unwrapResponse(response)
}

export async function resetPasswordApi(payload) {
  const response = await http.post('auth/reset-password', payload)
  return unwrapResponse(response)
}
