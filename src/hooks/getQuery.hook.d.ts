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

declare function useGetQuery<T = any>(): UseGetQueryReturn<T>;

export default useGetQuery; 