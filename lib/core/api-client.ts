import { sessionManager } from './session-manager'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ApiErrorPayload {
  message: string
  statusCode: number
  data?: unknown
}

export class ApiError extends Error {
  statusCode: number
  data?: unknown

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = 'ApiError'
    this.statusCode = payload.statusCode
    this.data = payload.data
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      (typeof body === 'object' && body && ('error' in body ? String((body as any).error) : 'message' in body ? String((body as any).message) : null)) ||
      response.statusText ||
      'Request failed'

    throw new ApiError({
      message,
      statusCode: response.status,
      data: body
    })
  }

  return body as T
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionManager.getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include'
  })

  return parseResponse<T>(response)
}

export const apiClient = {
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' })
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
  },
  put<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })
  },
  patch<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined })
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  }
}
