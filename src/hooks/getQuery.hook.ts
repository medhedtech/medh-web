"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';
import { apiClient } from '../apis/apiClient';
import apiWithAuth from '../utils/apiWithAuth';
import { getAuthToken } from '../utils/auth';
// Toast manager is imported dynamically when needed
import { logger } from '../utils/logger';
import { RequestCoalescingCache } from '../utils/lruCache';

// Enhanced cache with LRU eviction and request coalescing
const responseCache = new RequestCoalescingCache({
  max: 500, // Increased capacity with intelligent eviction
  ttl: 60 * 1000, // 1 minute cache TTL by default
});
const CACHE_TTL = 60 * 1000; // 1 minute cache TTL by default

// Default retry configuration
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504], // Standard retryable status codes
};

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number | ((retryCount: number) => number);
  retryableStatusCodes?: number[];
  retryCondition?: (error: AxiosError) => boolean;
}

export interface UseGetQueryParams<T> {
  /** API endpoint url */
  url: string;
  /** Optional axios request configuration */
  config?: AxiosRequestConfig;
  /** Success callback */
  onSuccess?: (data: T) => void;
  /** Error callback */
  onFail?: (error: any) => void;
  /** Custom cache key, defaults to URL */
  cacheKey?: string;
  /** Time to live in ms, defaults to CACHE_TTL */
  cacheTTL?: number;
  /** Skip reading from cache */
  skipCache?: boolean;
  /** Pagination configuration */
  pagination?: {
    pageParam: string;
    limitParam: string;
    page: number;
    limit: number;
  };
  /** Retry configuration or boolean to enable/disable */
  retry?: RetryConfig | boolean;
  /** Whether request requires authentication */
  requireAuth?: boolean;
  /** Whether to show toast messages */
  showToast?: boolean;
  /** Custom success message for toast */
  successMessage?: string;
  /** Custom error message for toast */
  errorMessage?: string;
  /** Whether to enable debug logging */
  debug?: boolean;
}

export interface UseGetQueryState<T> {
  /** Response data */
  data: T | null;
  /** Error if request failed */
  error: Error | AxiosError | null;
  /** Whether request is in progress */
  loading: boolean;
  /** Whether there's a next page (pagination) */
  hasNextPage: boolean;
  /** Total available pages (pagination) */
  totalPages: number;
  /** Total available items (pagination) */
  totalItems: number;
}

export interface UseGetQueryReturn<T> extends UseGetQueryState<T> {
  /** Function to execute GET request */
  getQuery: (params: UseGetQueryParams<T>) => Promise<T | null>;
  /** Refetch using the last parameters */
  refetch: () => Promise<T | null>;
  /** Cancel an ongoing request */
  cancelRequest: () => void;
  /** Clear cache for specific key or all */
  clearCache: (cacheKey?: string) => void;
  /** Update data manually */
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  /** Clear error state */
  clearError: () => void;
  /** Reset all states */
  reset: () => void;
}

/**
 * Custom hook for handling GET API requests with caching, retries, and cancellation
 * @param initialUrl - Optional URL to fetch on mount
 * @param initialConfig - Optional axios config for initial fetch
 * @returns Object with query function and state
 */
export function useGetQuery<T = any>(
  initialUrl?: string, 
  initialConfig?: AxiosRequestConfig
): UseGetQueryReturn<T> {
  // State for the query
  const [state, setState] = useState<UseGetQueryState<T>>({
    data: null,
    error: null,
    loading: false,
    hasNextPage: false,
    totalPages: 0,
    totalItems: 0,
  });

  // Track the last used parameters for refetching
  const lastParamsRef = useRef<UseGetQueryParams<T> | null>(null);
  
  // Reference to cancel token source
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  // Track if we already retried current request with auth
  const attemptedAuthRef = useRef<boolean>(false);

  // Create a new cancel token
  const createCancelToken = useCallback(() => {
    // Cancel any existing requests
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }
    
    // Create a new cancel token
    cancelTokenRef.current = axios.CancelToken.source();
    return cancelTokenRef.current.token;
  }, []);

  // Cancel the current request
  const cancelRequest = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request canceled by user');
      cancelTokenRef.current = null;
    }
  }, []);

  // Clear cache for specific key or all
  const clearCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      responseCache.delete(cacheKey);
    } else {
      responseCache.clear();
      responseCache.clearPendingRequests(); // Clear any pending requests too
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Reset all states
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      hasNextPage: false,
      totalPages: 0,
      totalItems: 0,
    });
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  // Check if response is paginated
  const isPaginatedResponse = (response: any): boolean => {
    return (
      response &&
      typeof response === 'object' &&
      response.data !== undefined &&
      (response.pagination !== undefined ||
        (response.meta !== undefined &&
          (response.meta.totalPages !== undefined || response.meta.total !== undefined)))
    );
  };

  // Extract pagination info from response
  const extractPaginationInfo = (response: any) => {
    if (!isPaginatedResponse(response)) return {};

    const pagination = response.pagination || response.meta;
    const totalItems = pagination.total || pagination.totalItems || 0;
    const totalPages = pagination.totalPages || Math.ceil(totalItems / (pagination.limit || 10));
    const currentPage = pagination.page || pagination.currentPage || 1;
    const hasNextPage = currentPage < totalPages;

    return { hasNextPage, totalPages, totalItems };
  };

  // Extract data from response
  const extractData = (response: any): T => {
    if (isPaginatedResponse(response)) {
      return response.data;
    }
    return response;
  };

  // Main query function
  const getQuery = useCallback(async ({
    url,
    config = {},
    onSuccess,
    onFail,
    cacheKey,
    cacheTTL = CACHE_TTL,
    skipCache = false,
    pagination,
    retry,
    requireAuth = true, // Default to requiring auth for all API calls
    showToast = false,
    successMessage,
    errorMessage = "Failed to fetch data",
    debug = false,
  }: UseGetQueryParams<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // Store params for potential refetch
    lastParamsRef.current = { url, config, onSuccess, onFail, cacheKey, cacheTTL, skipCache, pagination, retry, requireAuth, showToast, successMessage, errorMessage, debug };

    // Add pagination params if provided
    if (pagination) {
      const { pageParam = 'page', limitParam = 'limit', page, limit } = pagination;
      config.params = {
        ...config.params,
        [pageParam]: page,
        [limitParam]: limit,
      };
    }

    // Create the cache key - either provided or based on URL and params
    const effectiveCacheKey = cacheKey || `${url}${config.params ? JSON.stringify(config.params) : ''}`;
    
    // Debug logging
    if (debug) {
      logger.log({ 
        url, 
        params: config.params,
        requireAuth,
        useCache: !skipCache,
        hasCachedData: responseCache.has(effectiveCacheKey),
        pendingRequests: responseCache.pendingCount
      }, 'getQuery-request');
    }
    
    // Check cache if not skipping - now with automatic request coalescing
    if (!skipCache) {
      const cachedData = responseCache.get(effectiveCacheKey);
      if (cachedData !== undefined) {
        setState(prev => ({
          ...prev,
          data: extractData(cachedData) as T,
          loading: false,
          ...(isPaginatedResponse(cachedData) ? extractPaginationInfo(cachedData) : {}),
        }));
        
        if (debug) {
          logger.log({ fromCache: true, cacheKey: effectiveCacheKey }, 'getQuery-cache-hit');
        }
        
        if (onSuccess) {
          onSuccess(extractData(cachedData) as T);
        }
        
        return extractData(cachedData) as T;
      }
      
      if (debug && responseCache.has(effectiveCacheKey)) {
        logger.log({ fromCache: false, reason: 'Cache expired' }, 'getQuery-cache-miss');
      }
    }

    // Initialize retry counter and configuration
    let retryCount = 0;
    let retryConfig: RetryConfig | null = null;
    
    if (retry) {
      retryConfig = retry === true ? DEFAULT_RETRY_CONFIG : { ...DEFAULT_RETRY_CONFIG, ...retry };
    }

    const shouldRetry = (error: AxiosError, count: number): boolean => {
      if (!retryConfig || count >= (retryConfig.maxRetries || 0)) return false;
      
      // Check if custom retry condition function exists
      if (retryConfig.retryCondition) {
        return retryConfig.retryCondition(error);
      }
      
      // Default retry condition based on status codes
      return !!error.response && 
        (retryConfig.retryableStatusCodes || []).includes(error.response.status);
    };

    const getRetryDelay = (count: number): number => {
      if (!retryConfig) return 0;
      
      if (typeof retryConfig.retryDelay === 'function') {
        return retryConfig.retryDelay(count);
      }
      
      // Exponential backoff by default
      return (retryConfig.retryDelay || 1000) * Math.pow(2, count);
    };

    // Use request coalescing to avoid duplicate requests
    try {
      const result = await responseCache.executeRequest(
        effectiveCacheKey,
        async () => {
          // Get auth token if required
          let authToken: string | null = null;
          if (requireAuth) {
            try {
              authToken = getAuthToken();
              
              // Add auth headers if not already set
              if (authToken && (!config.headers || !config.headers['Authorization'])) {
                config.headers = {
                  ...config.headers,
                  'Authorization': `Bearer ${authToken}`,
                  'x-access-token': authToken
                };
              }
            } catch (err) {
              if (debug) {
                logger.log('Failed to get auth token', 'getQuery-auth-failed');
              }
            }
          }
          
          // Add cancel token to request config
          const requestConfig: AxiosRequestConfig = {
            ...config,
            cancelToken: createCancelToken(),
          };
          
          // Retry logic wrapper
          const executeWithRetry = async (): Promise<any> => {
            let currentRetryCount = 0;
            
            while (true) {
              try {
                // Make the request
                let response: any;
                if (requireAuth && authToken) {
                  response = await apiWithAuth.get<T>(url, requestConfig);
                } else {
                  response = await apiClient.get<T>(url, requestConfig);
                }
                
                return response.data || response;
              } catch (error) {
                // Don't retry if request was canceled
                if (axios.isCancel(error)) {
                  throw error;
                }
                
                const axiosError = error as AxiosError;
                
                // Check if we should retry
                if (shouldRetry(axiosError, currentRetryCount)) {
                  currentRetryCount++;
                  const delay = getRetryDelay(currentRetryCount);
                  
                  if (debug) {
                    logger.log(`Retrying request (${currentRetryCount}/${retryConfig?.maxRetries}) after ${delay}ms: ${url}`, 'getQuery-retry');
                  }
                  
                  // Wait for the retry delay
                  await new Promise(resolve => setTimeout(resolve, delay));
                  continue;
                } else {
                  throw error;
                }
              }
            }
          };
          
          return await executeWithRetry();
        },
        { ttl: cacheTTL }
      );
      
      // Process the response
      const extractedData = extractData(result) as T;
      
      // Update state with response data and pagination info
      setState(prev => ({
        ...prev,
        data: extractedData,
        loading: false,
        ...extractPaginationInfo(result),
      }));
      
      // Show success toast if configured
      if (showToast && successMessage) {
        import('@/utils/toastManager').then(({ showToast: toast }) => {
          toast.success(successMessage);
        });
      }
      
      // Debug logging
      if (debug) {
        logger.log({ 
          success: true, 
          url, 
          coalescedRequest: true
        }, 'getQuery-success');
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(extractedData);
      }
      
      return extractedData;
    } catch (error) {
      // Don't update state if request was canceled
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return null;
      }
      
      // Format error with more details
      let formattedError: Error | AxiosError;
      let errorMsg = errorMessage;
      
      if (axios.isAxiosError(error)) {
        // For axios errors, preserve the original error but add useful information
        const axiosError = error as AxiosError;
        
        // Extract error message from response if available
        const responseData = axiosError.response?.data as Record<string, any> | undefined;
        if (responseData?.message) {
          errorMsg = responseData.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        // Add URL to error message for better debugging
        if (axiosError.response) {
          // Handle specific HTTP status codes
          if (axiosError.response.status === 404) {
            errorMsg = "Resource not found";
          } else if (axiosError.response.status === 401 || axiosError.response.status === 403) {
            errorMsg = axiosError.response.status === 401 ? "Authentication required" : "Access denied";

            // 🔒 If this was an authenticated call that failed, attempt ONE graceful fallback:
            // 1. Clear the stored token (it may be expired).
            // 2. Retry the request without auth headers so public endpoints still work.
            if (requireAuth && !attemptedAuthRef.current) {
              attemptedAuthRef.current = true;
              // Remove token
              localStorage.removeItem('token');
              localStorage.removeItem('accessToken');
              if (config.headers) {
                delete config.headers["Authorization"];
                delete config.headers["x-access-token"];
              }
              try {
                const retryResp = await apiClient.get<T>(url, {
                  ...config,
                  cancelToken: createCancelToken(),
                });
                const retryData = retryResp.data || retryResp;
                const extractedRetryData = extractData(retryData) as T;
                setState(prev => ({
                  ...prev,
                  data: extractedRetryData,
                  loading: false,
                  ...extractPaginationInfo(retryData),
                }));
                if (onSuccess) onSuccess(extractedRetryData);
                return extractedRetryData;
              } catch (unauthErr) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('Retry without auth also failed', unauthErr);
                }
              }
            }
          }
        } else if (axiosError.request) {
          // Request was made but no response received
          errorMsg = "No response received from server";
        }
        
        formattedError = axiosError;
      } else if (error instanceof Error) {
        formattedError = error;
      } else {
        formattedError = new Error('Unknown error occurred');
      }
      
      // Update state with error
      setState(prev => ({
        ...prev,
        error: formattedError,
        loading: false,
      }));
      
      // Show error toast if configured
      if (showToast) {
        import('@/utils/toastManager').then(({ showToast: toast }) => {
          toast.error(errorMsg);
        });
      }
      
      // Call onFail callback if provided
      if (onFail) {
        onFail(formattedError);
      }
      
      // Log error for debugging
      if (debug) {
        logger.log({
          url,
          error: formattedError.message,
          params: config.params,
          coalescedRequest: true,
          status: (error as AxiosError).response?.status
        }, 'getQuery-error');
      }
      
      return null;
    }
  }, [createCancelToken]);

  // Refetch using the last parameters
  const refetch = useCallback(async (): Promise<T | null> => {
    if (!lastParamsRef.current) {
      console.warn('Cannot refetch: No previous query parameters available');
      return null;
    }
    
    // Force skip cache when refetching
    const refetchParams = {
      ...lastParamsRef.current,
      skipCache: true,
    };
    
    return getQuery(refetchParams);
  }, [getQuery]);

  // If initialUrl is provided, execute the query on mount
  useEffect(() => {
    if (initialUrl) {
      getQuery({ url: initialUrl, config: initialConfig || {} });
    }
  }, [initialUrl, initialConfig, getQuery]);

  return {
    ...state,
    getQuery,
    refetch,
    cancelRequest,
    clearCache,
    clearError,
    reset,
    setData: (newData: React.SetStateAction<T | null>) => 
      setState(prev => ({ 
        ...prev, 
        data: typeof newData === 'function' 
          ? (newData as (prevData: T | null) => T | null)(prev.data) 
          : newData 
      })),
  };
}

export default useGetQuery;