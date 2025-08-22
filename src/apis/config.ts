/**
 * API Configuration
 * 
 * This file contains environment-specific configuration for API endpoints.
 * It helps avoid circular dependencies by keeping the base URL in a separate file.
 */

// Determine the appropriate API base URL based on environment
const getApiBaseUrl = (): string => {
  // Force localhost for development (override everything)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('🔧 Development mode detected - using localhost backend');
    return 'http://localhost:8080/api/v1';
  }

  // Force use backend URL for live classes API
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: Environment-specific URLs
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co';
  } else if (process.env.NODE_ENV === 'test') {
    return process.env.NEXT_PUBLIC_API_URL_TEST || 'https://api.medh.co';
  } else {
    // Development - use local backend directly
    return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8080/api/v1';
  }
};

// Export the base URL
export const apiBaseUrl = getApiBaseUrl();

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🌐 API Base URL configured:', apiBaseUrl);
  console.log('🌍 Current hostname:', window.location.hostname);
  console.log('🔧 Environment:', process.env.NODE_ENV);
}

// Additional API configuration settings
export const apiConfig = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  defaultPageSize: 10,
  maxPageSize: 100,
  defaultCurrency: 'USD',
  enableLogging: process.env.NODE_ENV !== 'production',
};

// Export specific API feature flags
export const apiFeatures = {
  useCaching: true,
  optimisticUpdates: true,
  compressionEnabled: true,
  requestBatching: process.env.NODE_ENV === 'production',
};

// Define public endpoints that don't require authentication
export const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/change-password',
  '/auth/oauth',
  '/courses/public',
  '/courses/free',
  '/blogs/public',
  '/health',
  '/faq/public',
  '/announcements/public',
  '/announcements/recent',
  '/announcements/unread-count',
  '/enrolled/getCount',
  '/enrolled/upcoming-classes',
  '/progress/analytics',
  '/certificates/student',
  '/broucher/create',
  '/broucher/download',
  // Demo session form endpoints (public forms)
  '/forms/submit',
  '/forms/demo-sessions/available-slots',
  '/forms/demo-sessions',
  '/forms/config'
]; 