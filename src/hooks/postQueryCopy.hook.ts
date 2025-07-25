"use client";

import { useState } from "react";
import { apiClient } from "../apis/apiClient";
import apiWithAuth from "../utils/apiWithAuth";
import { getAuthToken } from "../utils/auth";
import { showToast } from '@/utils/toastManager';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { logger } from "../utils/logger";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export interface PostQueryCopyParams<T = any> {
  /** API endpoint url */
  url: string;
  /** Data to send with the POST request */
  postData: T;
  /** Success callback */
  onSuccess?: (data: any) => void | Promise<void>;
  /** Error callback */
  onFail?: (error: any) => void | Promise<void>;
  /** Whether request requires authentication */
  requireAuth?: boolean;
  /** Optional request configuration */
  config?: AxiosRequestConfig;
  /** Whether to show toast messages */
  enableToast?: boolean;
  /** Whether to disable toast messages for this specific request */
  disableToast?: boolean;
  /** Custom headers (merged with defaults) */
  headers?: Record<string, string>;
  /** Custom success message for toast */
  successMessage?: string;
  /** Custom error message for toast */
  errorMessage?: string;
  /** Whether to reset error state before request */
  resetErrorOnRequest?: boolean;
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Whether this is a login request (uses extended timeout) */
  isLoginRequest?: boolean;
}

export interface PostQueryCopyResult<T> {
  data: T | null;
  error: Error | AxiosError | null;
}

export interface UsePostQueryCopyResult<T> {
  postQuery: <D = any>(params: PostQueryCopyParams<D>) => Promise<PostQueryCopyResult<T>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  data: T | undefined;
  setData: (data: T | undefined) => void;
  error: Error | AxiosError | undefined;
  setError: (error: Error | AxiosError | undefined) => void;
  clearError: () => void;
  clearData: () => void;
  reset: () => void;
}

/**
 * Custom hook for handling POST API requests (Copy Version)
 * @returns Object with post query function and state
 */
export const usePostQueryCopy = <T = any>(): UsePostQueryCopyResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | AxiosError | undefined>(undefined);

  /**
   * Execute a POST request to the API (Copy Version)
   */
  const postQuery = async <D = any>({
    url,
    postData,
    onSuccess = () => {},
    onFail = () => {},
    requireAuth = true,
    config = {},
    enableToast = false,
    disableToast = false,
    headers = {},
    successMessage,
    errorMessage = "Operation failed",
    resetErrorOnRequest = true,
    debug = false,
    isLoginRequest = false,
  }: PostQueryCopyParams<D>): Promise<PostQueryCopyResult<T>> => {
    // Set loading and optionally reset error
    setLoading(true);
    if (resetErrorOnRequest) {
      setError(undefined);
    }

    // Debug auth token if in debug mode
    if (debug) {
      const token = getAuthToken();
      logger.log({
        authToken: token ? `Present (length: ${token.length})` : "Missing",
        authRequirement: requireAuth ? "Required" : "Not required",
        url,
        data: postData,
      }, "postQueryCopy-debug");
    }

    try {
      // Merge headers with copy indicator
      const mergedHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
        'X-Form-Copy': 'true', // Indicate this is from the copy form
      };

      if (debug) {
        logger.log({ headers: mergedHeaders }, "postQueryCopy-headers");
      }

      // Choose between authenticated and non-authenticated clients and make the request
      let response: AxiosResponse;
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: mergedHeaders,
      };
      
      if (requireAuth) {
        if (isLoginRequest) {
          // Use extended timeout for login operations
          const loginConfig = {
            ...requestConfig,
            timeout: 60000 // 60 seconds for login requests
          };
          response = await apiWithAuth.post<T>(url, postData, loginConfig);
        } else {
          response = await apiWithAuth.post<T>(url, postData, requestConfig);
        }
      } else {
        if (isLoginRequest) {
          // Use extended timeout for login operations with non-auth client
          const loginConfig = {
            ...requestConfig,
            timeout: 60000 // 60 seconds for login requests
          };
          response = await apiClient.post<T>(url, postData, loginConfig);
        } else {
          response = await apiClient.post<T>(url, postData, requestConfig);
        }
      }

      // Extract and set the response data
      const apiData = response.data as T;
      setData(apiData);

      // Show success toast if configured and not disabled
      if (enableToast && successMessage && !disableToast) {
        showToast.success(successMessage + " (Copy Form)");
      }

      // Debug logging
      if (debug) {
        logger.log(apiData, "postQueryCopy-success");
      } else {
        logger.log("POST request successful (Copy)");
      }

      // Call onSuccess callback
      if (onSuccess) {
        await onSuccess(apiData);
      }

      return { data: apiData, error: null };
    } catch (err: unknown) {
      // Format error for consistent handling
      const error = err as Error | AxiosError;
      setError(error);

      if (debug) {
        const axiosError = error as AxiosError;
        logger.log({
          error: error.message,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
        }, "postQueryCopy-error-debug");
      }

      // Determine the most appropriate error message
      const axiosError = error as AxiosError;
      const responseData = axiosError?.response?.data as Record<string, any> | undefined;
      
      // Handle timeout errors specifically
      let message = errorMessage;
      if (axiosError?.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        message = "⏱️ Request timed out (Copy Form). The server is taking longer than expected to respond. Please check your connection and try again.";
      } else if (axiosError?.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        message = "🌐 Network error (Copy Form). Please check your internet connection and try again.";
      } else if (axiosError?.response?.status === 503) {
        message = "🔧 Service temporarily unavailable (Copy Form). The server is currently under maintenance. Please try again in a few minutes.";
      } else if (axiosError?.response?.status === 500) {
        message = "⚠️ Internal server error (Copy Form). Something went wrong on our end. Please try again later.";
      } else {
        message = responseData?.message || error.message || errorMessage + " (Copy Form)";
      }

      // Show error toast if configured and not disabled
      if (enableToast && !disableToast) {
        showToast.error(message, { duration: 5000 });
      }

      // Call onFail callback
      if (onFail) {
        await onFail(error);
      }

      // Clear data on error
      setData(undefined);

      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(undefined);
  };

  /**
   * Clear data state
   */
  const clearData = (): void => {
    setData(undefined);
  };

  /**
   * Reset all states
   */
  const reset = (): void => {
    setLoading(false);
    setData(undefined);
    setError(undefined);
  };

  return {
    postQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
    clearError,
    clearData,
    reset,
  };
};

// Export default for compatibility
export default usePostQueryCopy; 