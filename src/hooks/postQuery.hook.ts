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

export interface PostQueryParams<T = any> {
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
  showToast?: boolean;
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
}

export interface PostQueryResult<T = any> {
  data: T | null;
  error: Error | AxiosError | null;
}

export interface UsePostQueryResult<T = any> {
  /** Function to execute the POST request */
  postQuery: <D = any>(params: PostQueryParams<D>) => Promise<PostQueryResult<T>>;
  /** Current loading state */
  loading: boolean;
  /** Set loading state manually */
  setLoading: (loading: boolean) => void;
  /** Last successful response data */
  data: T | undefined;
  /** Set data manually */
  setData: (data: T | undefined) => void;
  /** Last error */
  error: Error | AxiosError | undefined;
  /** Set error manually */
  setError: (error: Error | AxiosError | undefined) => void;
  /** Clear error state */
  clearError: () => void;
  /** Clear data state */
  clearData: () => void;
  /** Reset all states */
  reset: () => void;
}

/**
 * Custom hook for handling POST API requests
 * @returns Object with post query function and state
 */
export const usePostQuery = <T = any>(): UsePostQueryResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | AxiosError | undefined>(undefined);

  /**
   * Execute a POST request to the API
   */
  const postQuery = async <D = any>({
    url,
    postData,
    onSuccess = () => {},
    onFail = () => {},
    requireAuth = true,
    config = {},
    showToast = false,
    headers = {},
    successMessage,
    errorMessage = "Operation failed",
    resetErrorOnRequest = true,
    debug = false,
  }: PostQueryParams<D>): Promise<PostQueryResult<T>> => {
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
      }, "postQuery-debug");
    }

    try {
      // Merge headers
      const mergedHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
      };

      if (debug) {
        logger.log({ headers: mergedHeaders }, "postQuery-headers");
      }

      // Choose between authenticated and non-authenticated clients and make the request
      let response: AxiosResponse;
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: mergedHeaders,
      };
      
      if (requireAuth) {
        response = await apiWithAuth.post<T>(url, postData, requestConfig);
      } else {
        response = await apiClient.post<T>(url, postData, requestConfig);
      }

      // Extract and set the response data
      const apiData = response.data as T;
      setData(apiData);

      // Show success toast if configured
      if (showToast && successMessage) {
        showshowToast.success(successMessage, { groupKey: params.groupKey || 'api' });
      }

      // Debug logging
      if (debug) {
        logger.log(apiData, "postQuery-success");
      } else {
        logger.log("POST request successful");
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
        }, "postQuery-error-debug");
      }

      // Determine the most appropriate error message
      const axiosError = error as AxiosError;
      const responseData = axiosError?.response?.data as Record<string, any> | undefined;
      const message =
        responseData?.message ||
        error.message ||
        errorMessage;

      // Show error toast if configured
      if (showToast) {
        showshowToast.error(message, { groupKey: params.groupKey || 'api' });
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

export default usePostQuery;
