import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import axiosRetry, { isNetworkError } from 'axios-retry';
import { apiBaseUrl } from './index';
import { logger } from '../utils/logger';

// Determine environment
const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

// Precompute configuration values
const API_TIMEOUT: number = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
  10
);
const RETRY_COUNT: number = parseInt(
  process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3',
  10
);
const BASE_DELAY: number = parseInt(
  process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000',
  10
);

// Extend AxiosInstance with custom utility methods
interface CustomAxiosInstance extends AxiosInstance {
  checkEndpoint(url: string): Promise<{ exists: boolean; error: any | null }>;
  testCorsConfiguration(): Promise<{
    success: boolean;
    headers?: any;
    message: string;
    error?: string;
  }>;
}

// Cache token to avoid repeated storage reads
let cachedToken: string | null = null;
function getToken(): string | null {
  if (cachedToken) return cachedToken;
  cachedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  return cachedToken;
}
export function updateToken(newToken: string): void {
  cachedToken = newToken;
}

// Create a custom Axios instance with default settings
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: API_TIMEOUT,
}) as CustomAxiosInstance;

// Configure axios-retry with exponential backoff strategy
axiosRetry(api, {
  retries: RETRY_COUNT,
  retryDelay: (retryCount: number) => BASE_DELAY * Math.pow(2, retryCount - 1),
  retryCondition: (error: AxiosError) => {
    // Do not retry CORS (status 0) errors
    if (error.response && error.response.status === 0) {
      return false;
    }
    // Retry on network errors or 5xx responses
    return isNetworkError(error) || (error.response ? error.response.status >= 500 : false);
  },
});

// Request interceptor: add auth tokens and log requests in development
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    try {
      const token = getToken();
      if (token) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['x-access-token'] = token;
        }
        if (isDevelopment) {
          logger.log('Auth token applied');
        }
      } else if (isDevelopment) {
        logger.log('No auth token found');
      }
      if (isDevelopment) {
        logger.log('REQUEST', config);
      }
    } catch (err) {
      if (isDevelopment) {
        logger.log('Storage read error', err);
      }
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      logger.log('REQUEST_ERROR', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor: log responses and handle errors gracefully
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (isDevelopment) {
      logger.log('RESPONSE', response);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle network/CORS errors
    if (error.message && error.message.includes('Network Error')) {
      if (isDevelopment) {
        logger.log('CORS_ERROR', 'Possible CORS issue detected');
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('api:cors-error', {
            detail: {
              url: error.config?.url,
              message:
                'Request failed due to CORS policy. Please contact support if this persists.',
            },
          })
        );
      }
      return Promise.reject({
        ...error,
        isCorsError: true,
        friendlyMessage:
          'Unable to connect to the API due to cross-origin restrictions.',
      });
    }

    // Handle response errors (e.g., 401 Unauthorized)
    if (error.response) {
      const detail: string =
        (error.response.data as any)?.detail || 'Unknown Error';
      if (isDevelopment) {
        logger.log('RESPONSE_ERROR', detail);
      }
      if (error.response.status === 401) {
        if (isDevelopment) {
          logger.log('Authentication error - re-login may be required');
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('auth:error', {
              detail: { status: 401, message: 'Authentication required' },
            })
          );
        }
      }
    } else {
      if (isDevelopment) {
        logger.log('NETWORK_ERROR', error);
      }
    }
    return Promise.reject(error);
  }
);

// Utility method: check if an endpoint exists by performing a HEAD request
api.checkEndpoint = async (url: string): Promise<{
  exists: boolean;
  error: any | null;
}> => {
  try {
    await api.head(url);
    return { exists: true, error: null };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return { exists: false, error };
      }
      return { exists: true, error };
    }
    return { exists: false, error };
  }
};

// Utility method: test the CORS configuration via an OPTIONS request
api.testCorsConfiguration = async (): Promise<{
  success: boolean;
  headers?: any;
  message: string;
  error?: string;
}> => {
  try {
    const response = await api.options(`${apiBaseUrl}/cors-test`);
    return {
      success: true,
      headers: response.headers,
      message: 'CORS configuration is working correctly',
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: 'CORS configuration test failed',
    };
  }
};

export default api;