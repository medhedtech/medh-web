/**
 * API Configuration
 * 
 * This file contains environment-specific configuration for API endpoints.
 * It helps avoid circular dependencies by keeping the base URL in a separate file.
 */

// Determine the appropriate API base URL based on environment
const getApiBaseUrl = (): string => {
  // First priority: Explicit API URL override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: Environment-specific URLs
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.medh.co/api/v1';
  } else if (process.env.NODE_ENV === 'test') {
    return process.env.NEXT_PUBLIC_API_URL_TEST || 'https://api.medh.co/api/v1';
  } else {
    // Development is the default
    return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8000/api/v1';
  }
};

// Export the base URL
export const apiBaseUrl = getApiBaseUrl();

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