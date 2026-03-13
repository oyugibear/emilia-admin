// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Add other API configuration constants here
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: '/users',
    UPDATE: '/users',
    DELETE: '/users',
  },
  FIELDS: {
    GET_ALL: '/fields',
    GET_BY_ID: '/fields',
    CREATE: '/fields/add',
    UPDATE: '/fields',
    DELETE: '/fields',
  },
  BOOKINGS: {
    GET_ALL: '/bookings',
    GET_BY_ID: '/bookings',
    GET_USER_BOOKINGS: '/bookings/user',
    CREATE: '/bookings/add',
    UPDATE: '/bookings/rescheduleBooking',
    COMPLETE: '/bookings/completeBooking',
    ADD_LINK: '/bookings/addlink',
  },
  SERVICES: {
    GET_ALL: '/services',
    GET_BY_ID: '/services',
    CREATE: '/services/add',
    UPDATE: '/services',
    DELETE: '/services',
  },
  PAYMENTS: {
    GET_ALL: '/payments',
    GET_BY_ID: '/payments',
    GET_USER_PAYMENTS: '/payments/user',
    CREATE: '/payments/add',
    UPDATE: '/payments/edit',
    CONFIRM_PAYSTACK: '/payments/confirm_payment/paystack',
  },
  BLOGS: {
    GET_ALL: '/blogs',
    GET_BY_ID: '/blogs',
    CREATE: '/blogs/add',
    UPDATE: '/blogs',
    DELETE: '/blogs',
  },
} as const;

export default {
  API_URL,
  API_ENDPOINTS,
};
