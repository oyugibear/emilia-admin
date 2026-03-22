import { sessionManager as authStorage } from './core/session-manager'

export const logout = () => {
  authStorage.clearSession()
  if (typeof window !== 'undefined') {
    window.location.href = '/auth'
  }
}

export const isAuthenticated = (): boolean => {
  const token = authStorage.getToken()
  const user = authStorage.getUser()
  return !!(token && user)
}

export const getCurrentUser = () => {
  return authStorage.getUser()
}

export const getAuthToken = () => {
  return authStorage.getToken()
}

export const requireAuth = (redirectTo: string = '/auth') => {
  if (!isAuthenticated() && typeof window !== 'undefined') {
    window.location.href = redirectTo
    return false
  }
  return true
}

export const requireAdmin = (redirectTo: string = '/') => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
    return false
  }
  
  const user = getCurrentUser()
  if (user?.role !== 'Admin') {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    return false
  }
  
  return true
}
