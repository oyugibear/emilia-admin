export interface CookieOptions {
  expiresDays?: number
  path?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

const isBrowser = typeof window !== 'undefined'

export const cookieManager = {
  set(name: string, value: string, options: CookieOptions = {}) {
    if (!isBrowser) return

    const {
      expiresDays = 1,
      path = '/',
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax'
    } = options

    const expires = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toUTCString()
    const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}${secure ? '; Secure' : ''}`

    document.cookie = cookie
  },

  get(name: string): string | null {
    if (!isBrowser) return null

    const key = `${encodeURIComponent(name)}=`
    const parts = document.cookie.split('; ')

    for (const part of parts) {
      if (part.startsWith(key)) {
        return decodeURIComponent(part.slice(key.length))
      }
    }

    return null
  },

  remove(name: string, path = '/') {
    if (!isBrowser) return
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
  },

  clearByPrefix(prefix: string) {
    if (!isBrowser) return

    const all = document.cookie ? document.cookie.split('; ') : []
    all.forEach((cookie) => {
      const [rawName] = cookie.split('=')
      const name = decodeURIComponent(rawName)
      if (name.startsWith(prefix)) this.remove(name)
    })
  }
}
