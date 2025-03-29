import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface FetchResponse<T> extends FetchState<T> {
  refetch: () => Promise<void>;
  abort: () => void;
}

type FetchFn = typeof fetch;

export interface FetchOptions extends Omit<RequestInit, 'signal'> {
  fetchFn?: FetchFn;
  autoFetch?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  transformResponse?: <T>(data: any) => T;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Enhanced hook for making API calls with loading, error, and data state management
 * @param url The URL to fetch from (can be null or empty to skip fetching)
 * @param options Extended fetch options with additional features
 * @returns Object containing data, loading state, error state, refetch and abort functions
 */
function useFetch<T = any>(url: string | null, options: FetchOptions = {}): FetchResponse<T> {
  const {
    fetchFn = fetch,
    autoFetch = true,
    responseType = 'json',
    transformResponse,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: !!url && autoFetch,
    error: null,
    status: !!url && autoFetch ? 'loading' : 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  const executeRequest = useCallback(async (): Promise<void> => {
    if (!url) {
      setState({
        data: null,
        isLoading: false,
        error: null,
        status: 'idle',
      });
      return;
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setState(prev => ({
      ...prev,
      isLoading: true,
      status: 'loading',
    }));

    try {
      const response = await fetchFn(url, {
        ...fetchOptions,
        signal,
      });
      
      if (!isMountedRef.current) return;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Handle different response types
      let result;
      switch (responseType) {
        case 'json':
          result = await response.json();
          break;
        case 'text':
          result = await response.text();
          break;
        case 'blob':
          result = await response.blob();
          break;
        case 'arrayBuffer':
          result = await response.arrayBuffer();
          break;
        case 'formData':
          result = await response.formData();
          break;
        default:
          result = await response.json();
      }

      // Apply transformation if provided
      const transformedResult = transformResponse ? transformResponse(result) : result;
      
      // Update state with the fetched data
      setState({
        data: transformedResult as T,
        isLoading: false,
        error: null,
        status: 'success',
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(transformedResult as T);
      }

      // Reset retry counter
      retryCountRef.current = 0;
    } catch (error) {
      if (!isMountedRef.current) return;
      
      // Don't treat aborted requests as errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Update state with the error
      setState({
        data: null,
        isLoading: false,
        error: errorObj,
        status: 'error',
      });

      // Call onError callback if provided
      if (onError) {
        onError(errorObj);
      }

      // Retry the request if retries are configured and we haven't exceeded the limit
      if (retryCount > 0 && retryCountRef.current < retryCount) {
        retryCountRef.current += 1;
        setTimeout(() => {
          if (isMountedRef.current) {
            executeRequest();
          }
        }, retryDelay);
      }
    }
  }, [
    url,
    fetchFn,
    responseType,
    transformResponse,
    onSuccess,
    onError,
    retryCount,
    retryDelay,
    fetchOptions,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (autoFetch) {
      executeRequest();
    }

    return () => {
      isMountedRef.current = false;
      // Abort any in-flight requests when the component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeRequest, autoFetch]);

  // Abort the current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    ...state,
    refetch: executeRequest,
    abort,
  };
}

export default useFetch; 