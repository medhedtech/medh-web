// api-utils.ts - Shared API utilities to prevent circular dependencies

import { apiBaseUrl } from './config';

/**
 * Shared utility functions for API URL construction.
 */
export const apiUtils = {
  /**
   * Safely encodes a value for use in a URL.
   * @param value - The value to encode.
   * @returns The encoded value or an empty string if null/undefined.
   */
  safeEncode: (value: any): string => {
    if (value === null || value === undefined) return '';
    // Prevent double encoding by first decoding if already encoded
    const decodedValue = decodeURIComponent(String(value).trim());
    return encodeURIComponent(decodedValue);
  },

  /**
   * Safely converts a value to a number, with fallback
   * @param value - The value to convert
   * @param fallback - Fallback value if conversion fails
   * @returns The number or fallback value
   */
  safeNumber: (value: any, fallback: number): number => {
    if (value === null || value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  },

  /**
   * Creates a URLSearchParams object and adds array parameters.
   * @param name - The parameter name.
   * @param value - The parameter value (array or comma-separated string).
   * @param params - The URLSearchParams object to append to.
   * @param separator - The separator to use for joined values (default: comma).
   */
  addArrayParam: (
    name: string,
    value: string | string[] | undefined,
    params: URLSearchParams,
    separator: string = ','
  ): void => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    if (Array.isArray(value)) {
      params.set(name, value.join(separator));
    } else if (typeof value === 'string' && value.includes(separator)) {
      // String already contains separators, pass as is.
      params.set(name, value);
    } else if (value) {
      // Single value.
      params.set(name, String(value));
    }
  },

  /**
   * Creates a query string with proper error handling.
   * @param paramsObj - Object of parameter key-value pairs.
   * @returns The encoded query string.
   */
  buildQueryString: (paramsObj: { [key: string]: any }): string => {
    try {
      const urlParams = new URLSearchParams();
      for (const [key, value] of Object.entries(paramsObj)) {
        if (value === null || value === undefined) continue;
        if (Array.isArray(value)) {
          apiUtils.addArrayParam(key, value, urlParams);
        } else {
          urlParams.set(key, apiUtils.safeEncode(value));
        }
      }
      const queryString = urlParams.toString();
      return queryString ? `?${queryString}` : '';
    } catch (error) {
      console.error('Error building query string:', error);
      return '';
    }
  },

  /**
   * Adds a simple parameter to the URLSearchParams if the value exists.
   * @param name - The parameter name.
   * @param value - The parameter value.
   * @param params - The URLSearchParams object to append to.
   */
  appendParam: (name: string, value: any, params: URLSearchParams): void => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(name, apiUtils.safeEncode(value));
    }
  },
  
  /**
   * Creates a URLSearchParams object and adds array parameters by appending.
   * @param name - The parameter name.
   * @param value - The parameter value (array or comma-separated string).
   * @param params - The URLSearchParams object to append to.
   * @param separator - The separator to use for joined values (default: comma).
   */
  appendArrayParam: (
    name: string,
    value: string | string[] | undefined,
    params: URLSearchParams,
    separator: string = ','
  ): void => {
    if (!value) return;

    if (Array.isArray(value)) {
      const encodedValues = value
        .filter((item) => item)
        .map((item) => apiUtils.safeEncode(item))
        .filter((item) => item.length > 0);
      if (encodedValues.length > 0) {
        params.append(name, encodedValues.join(separator));
      }
    } else if (typeof value === 'string') {
      const items = value
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item)
        .map((item) => apiUtils.safeEncode(item));
      if (items.length > 0) {
        params.append(name, items.join(separator));
      }
    }
  }
};

// Common API response interface
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
  status?: string;
  statusCode?: number;
  timestamp?: string;
}

// Export the base URL for convenience
export { apiBaseUrl }; 