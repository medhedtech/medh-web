import { useState, useCallback } from 'react';
import apiClient from '../apis/apiClient';

// If you're using TypeScript, you can define types like this
// interface UseGetQueryParams<T> {
//   url: string;
//   config?: any; // e.g. AxiosRequestConfig from 'axios'
//   onSuccess?: (data: T) => void;
//   onError?: (error: unknown) => void;
// }

// interface UseGetQueryReturn<T> {
//   data: T | null;
//   error: unknown;
//   loading: boolean;
//   getQuery: (params: UseGetQueryParams<T>) => Promise<T | null>;
// }

function useGetQuery() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getQuery = useCallback(async ({
    url,
    config = {},
    onSuccess = () => {},
    onError = () => {},
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Pass config for advanced usage: headers, params, etc.
      const response = await apiClient.get(url, config);
      setData(response.data);

      // Let the consuming component handle success behavior.
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      onError(err);
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