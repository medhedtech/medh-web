import { useState, useCallback } from 'react';
import apiClient from '../apis/apiClient';

interface UseGetQueryParams<T> {
  url: string;
  config?: any; // e.g. AxiosRequestConfig from 'axios'
  onSuccess?: (data: T) => void;
  onFail?: (error: unknown) => void;
}

interface UseGetQueryReturn<T> {
  data: T | null;
  error: unknown;
  loading: boolean;
  getQuery: (params: UseGetQueryParams<T>) => Promise<T | null>;
}

function useGetQuery<T = any>(): UseGetQueryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const getQuery = useCallback(async ({
    url,
    config = {},
    onSuccess = () => {},
    onFail = () => {},
  }: UseGetQueryParams<T>) => {
    setLoading(true);
    setError(null);

    try {
      // Pass config for advanced usage: headers, params, etc.
      const response = await apiClient.get(url, config);
      const responseData = response.data as T;
      setData(responseData);

      // Let the consuming component handle success behavior.
      onSuccess(responseData);
      return responseData;
    } catch (err) {
      setError(err);
      onFail(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    getQuery,
  };
}

export default useGetQuery;