export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  users: {
    all: '/users',
    byId: (id: string) => `/users/${id}`
  },
  rooms: {
    all: '/rooms',
    add: '/rooms/add',
    byId: (id: string) => `/rooms/${id}`
  },
  bookings: {
    all: '/bookings',
    add: '/bookings/add',
    byId: (id: string) => `/bookings/${id}`
  },
  maintenance: {
    all: '/maintenance',
    add: '/maintenance/add',
    byId: (id: string) => `/maintenance/${id}`
  },
  inventory: {
    all: '/inventory',
    add: '/inventory/add',
    byId: (id: string) => `/inventory/${id}`
  },
  housekeeping: {
    all: '/housekeeping',
    add: '/housekeeping/add',
    byId: (id: string) => `/housekeeping/${id}`
  },
  guests: {
    all: '/guests',
    add: '/guests/add',
    byId: (id: string) => `/guests/${id}`
  },
  staff: {
    all: '/staff',
    add: '/staff/add',
    byId: (id: string) => `/staff/${id}`
  }
} as const
