"use client";

import { useState } from "react";
import { apiClient } from "../apis/apiClient";
import apiWithAuth from "../utils/apiWithAuth";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast } from '@/utils/toastManager';

export interface DeleteQueryParams<T = any> {
  /** API endpoint url */
  url: string;
  /** Optional data to send with the DELETE request */
  deleteData?: T;
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
  /** Custom success message for toast */
  successMessage?: string;
  /** Custom error message for toast */
  errorMessage?: string;
  /** Whether to reset error state before request */
  resetErrorOnRequest?: boolean;
}

export interface UseDeleteQueryResult<T = any> {
  /** Function to execute the DELETE request */
  deleteQuery: <D = any>(params: DeleteQueryParams<D>) => Promise<T | false>;
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
 * Custom hook for handling DELETE API requests
 * @returns Object with delete query function and state
 */
export const useDeleteQuery = <T = any>(): UseDeleteQueryResult<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | AxiosError | undefined>(undefined);

  /**
   * Execute a DELETE request to the API
   */
  const deleteQuery = async <D = any>({
    url,
    deleteData,
    onSuccess = () => {},
    onFail = () => {},
    requireAuth = false,
    config = {},
    showToast: enableToast = true,
    successMessage,
    errorMessage = "Something went wrong",
    resetErrorOnRequest = true,
  }: DeleteQueryParams<D>): Promise<T | false> => {
    // Set loading and optionally reset error
    setLoading(true);
    if (resetErrorOnRequest) {
      setError(undefined);
    }

    try {
      let apiData: T;

      if (requireAuth) {
        // Use Axios-based authenticated client
        const response: AxiosResponse = await apiWithAuth.delete(url, {
          ...config,
          data: deleteData,
        });
        apiData = response.data as T;
      } else {
        // Use Fetch-based non-authenticated client
        const requestOptions: RequestInit = {
          body: deleteData ? JSON.stringify(deleteData) : undefined,
        };
        
        // Convert Axios headers to Fetch headers format
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (config.headers) {
          Object.entries(config.headers).forEach(([key, value]) => {
            if (typeof value === 'string') {
              headers[key] = value;
            }
          });
        }
        
        requestOptions.headers = headers;
        
        const response = await apiClient.delete(url, requestOptions);
        
        if (response.status === 'error') {
          throw new Error(response.error || response.message || errorMessage);
        }
        
        apiData = response.data as T;
      }

      // Set the response data
      setData(apiData);

      // Show success toast if configured
      if (enableToast && successMessage) {
        showToast.success(successMessage);
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
        (axiosError?.response?.data as any)?.message ||
        (error as any)?.message ||
        (error as any)?.data?.message ||
        (error as any)?.data?.data?.message ||
        errorMessage;

      // Show error toast if configured
      if (enableToast) {
        showToast.error(message);
      }

      // Call onFail callback
      if (onFail) {
        await onFail(error);
      }

      return false;
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
    deleteQuery,
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

export default useDeleteQuery; 