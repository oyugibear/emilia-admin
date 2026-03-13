import { apiClient } from './api-client'
import { API_ENDPOINTS } from './api-endpoints'
import { sessionManager, type SessionUser } from './session-manager'

export interface LoginApiResponse {
  status: boolean
  message: string
  user: SessionUser
  token: string
}

export interface RegisterPayload {
  first_name: string
  second_name: string
  email: string
  phone_number: string
  date_of_birth: string
  password: string
  role?: string
}

export const authApi = {
  async login(email: string, password: string, rememberMe = false) {
    console.log('Attempting login with email:', email) // Debug log
    const response = await apiClient.post<LoginApiResponse>(API_ENDPOINTS.auth.login, {
      email,
      password
    })

    if (!response?.token || !response?.user) {
      throw new Error('Invalid login response from server')
    }

    sessionManager.createSession(response.token, response.user, rememberMe)
    return response
  },

  async register(payload: RegisterPayload) {
    return apiClient.post(API_ENDPOINTS.auth.register, payload)
  },

  async forgotPassword(email: string) {
    return apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email })
  },

  async resetPassword(email: string, confirmationCode: string, newPassword: string) {
    return apiClient.post(API_ENDPOINTS.auth.resetPassword, {
      email,
      confirmationCode,
      newPassword
    })
  },

  logout() {
    sessionManager.clearSession()
  }
}
