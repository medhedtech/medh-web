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

export interface PatchQueryParams<T = any> {
  /** API endpoint url */
  url: string;
  /** Data to send with the PATCH request */
  patchData: T;
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

export interface UsePatchQueryResult<T = any> {
  /** Function to execute the PATCH request */
  patchQuery: <D = any>(params: PatchQueryParams<D>) => Promise<T | null>;
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
 * Custom hook for handling PATCH API requests
 * @returns Object with patch query function and state
 */
export const usePatchQuery = <T = any>(): UsePatchQueryResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | AxiosError | undefined>(undefined);

  /**
   * Execute a PATCH request to the API
   */
  const patchQuery = async <D = any>({
    url,
    patchData,
    onSuccess = () => {},
    onFail = () => {},
    requireAuth = false,
    config = {},
    showToast = false,
    headers = {},
    successMessage = "Data updated successfully",
    errorMessage = "Update failed",
    resetErrorOnRequest = true,
    debug = false,
  }: PatchQueryParams<D>): Promise<T | null> => {
    // Set loading and optionally reset error
    setLoading(true);
    if (resetErrorOnRequest) {
      setError(undefined);
    }

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
        logger.log({ url, patchData, headers: mergedHeaders }, "patchQuery-request");
      }

      // Make the request
      const response: AxiosResponse = await client.patch(url, patchData, {
        ...config,
        headers: mergedHeaders,
      });

      // Extract and set the response data
      const apiData = response.data as T;
      setData(apiData);

      // Show success toast if configured
      if (showToast) {
        showToast.success(successMessage);
      }

      // Debug logging
      if (debug) {
        logger.log(apiData, "patchQuery-success");
      } else {
        logger.log("PATCH request successful");
      }

      // Call onSuccess callback
      if (onSuccess) {
        await onSuccess(apiData);
      }

      return apiData;
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
        showToast.error(message);
      }

      // Debug logging
      if (debug) {
        logger.log(error, "patchQuery-fail");
      } else {
        logger.log("PATCH request failed");
      }

      // Call onFail callback
      if (onFail) {
        await onFail(error);
      }

      return null;
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
    patchQuery,
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

export default usePatchQuery; 