"use client";

import { useState } from "react";
import { apiClient } from "../apis/apiClient";
import apiWithAuth from "../utils/apiWithAuth";
import { logger } from "../utils/logger";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast } from '@/utils/toastManager';

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
  enableToast?: boolean;
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
  loading: boolean;
  success: boolean;
}

export interface PutQueryReturn<T = any> extends PutQueryResult<T> {
  putQuery: (params: PutQueryParams<T>) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making PUT requests
 * @returns PutQueryReturn object with state and putQuery function
 */
export const usePutQuery = <T = any>(): PutQueryReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
    setSuccess(false);
  };

  const putQuery = async ({
    url,
    putData,
    onSuccess,
    onFail,
    requireAuth = true,
    config = {},
    enableToast = true,
    headers = {},
    successMessage = "Data updated successfully",
    errorMessage = "Failed to update data",
    debug = false,
  }: PutQueryParams<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Merge headers with defaults
      const mergedHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
      };

      // Choose the appropriate client based on auth requirement
      const client = requireAuth ? apiWithAuth : apiClient;

      // Make the request
      const response: AxiosResponse<T> = await client.put(url, putData, { 
        ...config,
        headers: mergedHeaders 
      });

      // Extract and set the response data
      const apiData = response.data || ({} as T);
      setData(apiData);
      setSuccess(true);

      // Show success toast if configured
      if (enableToast && successMessage) {
        showToast.success(successMessage);
      }

      // Debug logging
      if (debug) {
        logger.log(apiData, "putQuery-success");
      } else {
        logger.log("PUT request successful");
      }

      // Call success callback if provided
      if (onSuccess) {
        await onSuccess(apiData);
      }

      return apiData;

    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      setSuccess(false);

      // Show error toast if configured
      if (enableToast && errorMessage) {
        showToast.error(errorMessage);
      }

      // Debug logging
      if (debug) {
        logger.error(axiosError, "putQuery-error");
      } else {
        logger.error("PUT request failed");
      }

      // Call error callback if provided
      if (onFail) {
        await onFail(axiosError);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    success,
    putQuery,
    reset,
  };
};

export default usePutQuery; 