import { apiBaseUrl } from '@/apis/config';

const env = process.env.NODE_ENV || 'development';

interface ApiEnvironmentConfig {
  apiUrl: string;
  timeout: number;
  withCredentials: boolean;
}

interface ApiConfigType {
  development: ApiEnvironmentConfig;
  production: ApiEnvironmentConfig;
  test: ApiEnvironmentConfig;
  [key: string]: ApiEnvironmentConfig;
}

// Get API URL from the centralized config
const getApiUrl = (): string => {
  // First priority: Explicit API URL override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: Environment-specific URLs
  if (env === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co/api/v1';
  } else if (env === 'test') {
    return process.env.NEXT_PUBLIC_API_URL_TEST || 'http://localhost:8080/api/v1';
  } else {
    // Development is the default
    return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8080/api/v1';
  }
};

const config: ApiConfigType = {
  development: {
    apiUrl: getApiUrl(),
    timeout: 10000,
    withCredentials: true
  },
  production: {
    apiUrl: getApiUrl(),
    timeout: 15000,
    withCredentials: true
  },
  test: {
    apiUrl: getApiUrl(),
    timeout: 5000,
    withCredentials: true
  }
};

export const apiConfig = config[env];

// Type definitions for endpoint parameters
type IdParam = string | number;

interface AuthEndpoints {
  login: string;
  register: string;
  logout: string;
  refreshToken: string;
  forgotPassword: string;
  resetPassword: string;
  verifyEmail: string;
}

interface CourseEndpoints {
  list: string;
  detail: (id: IdParam) => string;
  create: string;
  update: (id: IdParam) => string;
  delete: (id: IdParam) => string;
  enroll: (id: IdParam) => string;
  progress: (id: IdParam) => string;
  reviews: (id: IdParam) => string;
}

interface UserEndpoints {
  profile: string;
  updateProfile: string;
  courses: string;
  wishlist: string;
  notifications: string;
}

interface BlogEndpoints {
  list: string;
  detail: (id: IdParam) => string;
  create: string;
  update: (id: IdParam) => string;
  delete: (id: IdParam) => string;
  categories: string;
  tags: string;
}

interface InstructorEndpoints {
  list: string;
  detail: (id: IdParam) => string;
  courses: (id: IdParam) => string;
  reviews: (id: IdParam) => string;
}

interface CategoryEndpoints {
  list: string;
  detail: (id: IdParam) => string;
  courses: (id: IdParam) => string;
}

interface SearchEndpoints {
  courses: string;
  blogs: string;
  instructors: string;
}

interface Endpoints {
  auth: AuthEndpoints;
  courses: CourseEndpoints;
  users: UserEndpoints;
  blogs: BlogEndpoints;
  instructors: InstructorEndpoints;
  categories: CategoryEndpoints;
  search: SearchEndpoints;
}

// API Endpoints
export const endpoints: Endpoints = {
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