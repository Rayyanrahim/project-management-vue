import { http } from './http'

export async function loginApi(credentials) {
  const response = await http.post('auth/login', credentials)
  return response.data.data
}