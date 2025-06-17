"use client";

import { useState } from "react";
import { apiClient } from "../apis/apiClient";
import apiWithAuth from "../utils/apiWithAuth";
import { logger } from "../utils/logger";
import { toast } from "react-toastify";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export interface PutQueryParams<T = any> {
  /** API endpoint url */
  url: string;
  /** Data to send with the PUT request */
  putData: T;
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
  /** Whether to enable debug logging */
  debug?: boolean;
}

export interface PutQueryResult<T = any> {
  data: T | null;
  error: Error | AxiosError | null;
}

export interface UsePutQueryResult<T = any> {
  /** Function to execute the PUT request */
  putQuery: <D = any>(params: PutQueryParams<D>) => Promise<PutQueryResult<T>>;
  /** Current loading state */
  loading: boolean;
  /** Set loading state manually */
  setLoading: (loading: boolean) => void;
  /** Last successful response data */
  data: T | null;
  /** Set data manually */
  setData: (data: T | null) => void;
  /** Last error */
  error: Error | AxiosError | null;
  /** Set error manually */
  setError: (error: Error | AxiosError | null) => void;
  /** Clear error state */
  clearError: () => void;
  /** Clear data state */
  clearData: () => void;
  /** Reset all states */
  reset: () => void;
}

/**
 * Custom hook for handling PUT API requests
 * @returns Object with put query function and state
 */
export const usePutQuery = <T = any>(): UsePutQueryResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | AxiosError | null>(null);

  /**
   * Execute a PUT request to the API
   */
  const putQuery = async <D = any>({
    url,
    putData,
    onSuccess = () => {},
    onFail = () => {},
    requireAuth = false,
    config = {},
    showToast = true,
    headers = {},
    successMessage,
    errorMessage = "Something went wrong",
    debug = false,
  }: PutQueryParams<D>): Promise<PutQueryResult<T>> => {
    // Reset states
    setLoading(true);
    setError(null);

    try {
      // Choose between authenticated and non-authenticated clients
      const client = requireAuth ? apiWithAuth : apiClient;
      
      // Merge headers
      const mergedHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
      };
      
      // Debug logging
      if (debug) {
        logger.log({ url, putData, headers: mergedHeaders }, "putQuery-request");
      }

      // Make the request
      const response: AxiosResponse = await client.put(url, putData, { 
        ...config,
        headers: mergedHeaders 
      });

      // Extract and set the response data
      const apiData = response.data as T || {};
      setData(apiData);

      // Show success toast if configured
      if (showToast && successMessage) {
        showToast.success(successMessage);
      }

      // Debug logging
      if (debug) {
        logger.log(apiData, "putQuery-success");
      } else {
        logger.log("PUT request successful");
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

      // Determine the most appropriate error message
      const axiosError = error as AxiosError;
      const message =
        axiosError?.response?.data?.message ||
        (error as any)?.message ||
        errorMessage;

      // Show error toast if configured
      if (showToast) {
        toast.error(message);
      }

      // Debug logging
      if (debug) {
        logger.log(error, "putQuery-fail");
      } else {
        logger.log("PUT request failed");
      }

      // Call onFail callback
      if (onFail) {
        await onFail(error);
      }

      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Clear data state
   */
  const clearData = (): void => {
    setData(null);
  };

  /**
   * Reset all states
   */
  const reset = (): void => {
    setLoading(false);
    setData(null);
    setError(null);
  };

  return {
    putQuery,
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

export default usePutQuery; 