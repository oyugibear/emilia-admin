import { sessionManager as authStorage } from './core/session-manager'

const APP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || ''

const withBasePath = (path: string): string => {
  if (!path.startsWith('/')) return path
  if (!APP_BASE_PATH) return path
  return `${APP_BASE_PATH}${path}`
}

export const logout = () => {
  authStorage.clearSession()
  if (typeof window !== 'undefined') {
    window.location.href = withBasePath('/auth')
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
    window.location.href = withBasePath(redirectTo)
    return false
  }
  return true
}

export const requireAdmin = (redirectTo: string = '/') => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = withBasePath('/auth')
    }
    return false
  }
  
  const user = getCurrentUser()
  if (user?.role !== 'Admin') {
    if (typeof window !== 'undefined') {
      window.location.href = withBasePath(redirectTo)
    }
    return false
  }
  
  return true
}
