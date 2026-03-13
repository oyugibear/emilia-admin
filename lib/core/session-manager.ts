import { cookieManager } from './cookie-manager'

export interface SessionUser {
  _id: string
  email: string
  role: string
  first_name?: string
  second_name?: string
  [key: string]: unknown
}

const TOKEN_KEY = 'emilia_auth_token'
const USER_KEY = 'emilia_auth_user'
const SESSION_COOKIE = 'emilia_active_session'

const isBrowser = typeof window !== 'undefined'

function readStorage(key: string): string | null {
  if (!isBrowser) return null
  return sessionStorage.getItem(key) || localStorage.getItem(key)
}

function removeStorage(key: string) {
  if (!isBrowser) return
  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
}

export const sessionManager = {
  createSession(token: string, user: SessionUser, rememberMe = false) {
    if (!isBrowser) return

    const storage = rememberMe ? localStorage : sessionStorage

    removeStorage(TOKEN_KEY)
    removeStorage(USER_KEY)

    storage.setItem(TOKEN_KEY, token)
    storage.setItem(USER_KEY, JSON.stringify(user))

    cookieManager.set(SESSION_COOKIE, '1', { expiresDays: rememberMe ? 7 : 1 })
  },

  getToken(): string | null {
    return readStorage(TOKEN_KEY)
  },

  getUser(): SessionUser | null {
    const raw = readStorage(USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as SessionUser
    } catch {
      return null
    }
  },

  clearSession() {
    removeStorage(TOKEN_KEY)
    removeStorage(USER_KEY)
    cookieManager.remove(SESSION_COOKIE)
  },

  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser())
  }
}
