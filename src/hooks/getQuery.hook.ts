import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';
import apiClient from '../apis/apiClient';

// Response cache to avoid duplicate requests
const responseCache = new Map<string, { data: any; timestamp: number }>();
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
  url: string;
  config?: AxiosRequestConfig;
  onSuccess?: (data: T) => void;
  onFail?: (error: any) => void;
  cacheKey?: string; // Optional cache key, defaults to URL
  cacheTTL?: number; // Time to live in ms, defaults to CACHE_TTL
  skipCache?: boolean; // Skip reading from cache
  pagination?: {
    pageParam: string;
    limitParam: string;
    page: number;
    limit: number;
  };
  retry?: RetryConfig | boolean; // Retry configuration or just boolean to enable/disable
}

export interface UseGetQueryState<T> {
  data: T | null;
  error: Error | AxiosError | null;
  loading: boolean;
  hasNextPage: boolean;
  totalPages: number;
  totalItems: number;
}

export interface UseGetQueryReturn<T> extends UseGetQueryState<T> {
  getQuery: (params: UseGetQueryParams<T>) => Promise<T | null>;
  refetch: () => Promise<T | null>;
  cancelRequest: () => void;
  clearCache: (cacheKey?: string) => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

function useGetQuery<T = any>(initialUrl?: string, initialConfig?: AxiosRequestConfig): UseGetQueryReturn<T> {
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
    }
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
  }: UseGetQueryParams<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // Store params for potential refetch
    lastParamsRef.current = { url, config, onSuccess, onFail, cacheKey, cacheTTL, skipCache, pagination, retry };

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
    
    // Check cache if not skipping
    if (!skipCache) {
      const cachedResponse = responseCache.get(effectiveCacheKey);
      if (cachedResponse && (Date.now() - cachedResponse.timestamp) < cacheTTL) {
        const data = cachedResponse.data;
        setState(prev => ({
          ...prev,
          data,
          loading: false,
          ...(isPaginatedResponse(data) ? extractPaginationInfo(data) : {}),
        }));
        
        onSuccess?.(data);
        return data;
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

    const executeRequest = async (): Promise<T | null> => {
      try {
        // Add cancel token to request config
        const requestConfig: AxiosRequestConfig = {
          ...config,
          cancelToken: createCancelToken(),
        };
        
        // Make the request
        const response: AxiosResponse = await apiClient.get(url, requestConfig);
        
        // Process the response
        const responseData = response.data;
        const extractedData = extractData(responseData) as T;
        
        // Cache the result
        responseCache.set(effectiveCacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });
        
        // Update state with response data and pagination info
        setState(prev => ({
          ...prev,
          data: extractedData,
          loading: false,
          ...extractPaginationInfo(responseData),
        }));
        
        // Call onSuccess callback if provided
        onSuccess?.(extractedData);
        
        return extractedData;
      } catch (error) {
        // Don't update state if request was canceled
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
          return null;
        }
        
        const axiosError = error as AxiosError;
        
        // Check if we should retry
        if (shouldRetry(axiosError, retryCount)) {
          retryCount++;
          const delay = getRetryDelay(retryCount);
          
          console.log(`Retrying request (${retryCount}/${retryConfig?.maxRetries}) after ${delay}ms: ${url}`);
          
          // Wait for the retry delay
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Try again
          return executeRequest();
        }
        
        // Format error with more details
        let formattedError: Error | AxiosError;
        
        if (axios.isAxiosError(error)) {
          // For axios errors, preserve the original error but add useful information
          const axiosError = error as AxiosError;
          
          // Add URL to error message for better debugging
          if (axiosError.response) {
            // Handle specific HTTP status codes
            if (axiosError.response.status === 404) {
              console.warn(`Resource not found: ${url}`);
              // You could add custom handling for 404 errors here
            } else if (axiosError.response.status === 401 || axiosError.response.status === 403) {
              console.warn(`Authentication/Authorization error: ${axiosError.response.status}`);
              // You could trigger auth flow here
            }
          } else if (axiosError.request) {
            // Request was made but no response received
            console.warn('No response received from server');
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
        
        // Call onFail callback if provided
        onFail?.(formattedError);
        
        // Log error for debugging
        console.error('API request failed:', {
          url,
          error: formattedError,
          params: config.params,
          retries: retryCount > 0 ? `${retryCount}/${retryConfig?.maxRetries}` : 'none',
        });
        
        return null;
      }
    };

    return executeRequest();
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