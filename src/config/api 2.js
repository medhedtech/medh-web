const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
    withCredentials: true
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 15000,
    withCredentials: true
  },
  test: {
    apiUrl: 'http://localhost:8080/api/v1',
    timeout: 5000,
    withCredentials: true
  }
};

export const apiConfig = config[env];

// API Endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },
  courses: {
    list: '/courses',
    detail: (id) => `/courses/${id}`,
    create: '/courses',
    update: (id) => `/courses/${id}`,
    delete: (id) => `/courses/${id}`,
    enroll: (id) => `/courses/${id}/enroll`,
    progress: (id) => `/courses/${id}/progress`,
    reviews: (id) => `/courses/${id}/reviews`
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    courses: '/users/courses',
    wishlist: '/users/wishlist',
    notifications: '/users/notifications'
  },
  blogs: {
    list: '/blogs',
    detail: (id) => `/blogs/${id}`,
    create: '/blogs',
    update: (id) => `/blogs/${id}`,
    delete: (id) => `/blogs/${id}`,
    categories: '/blogs/categories',
    tags: '/blogs/tags'
  },
  instructors: {
    list: '/instructors',
    detail: (id) => `/instructors/${id}`,
    courses: (id) => `/instructors/${id}/courses`,
    reviews: (id) => `/instructors/${id}/reviews`
  },
  categories: {
    list: '/categories',
    detail: (id) => `/categories/${id}`,
    courses: (id) => `/categories/${id}/courses`
  },
  search: {
    courses: '/search/courses',
    blogs: '/search/blogs',
    instructors: '/search/instructors'
  }
};

// API Response Codes
export const responseCodes = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// API Error Messages
export const errorMessages = {
  DEFAULT: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.'
}; 