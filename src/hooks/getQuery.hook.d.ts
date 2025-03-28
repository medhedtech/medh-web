import { AxiosRequestConfig, AxiosError } from 'axios';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number | ((retryCount: number) => number);
  retryableStatusCodes?: number[];
  retryCondition?: (error: AxiosError) => boolean;
}

export interface UseGetQueryParams<T> {
  url: string;
  config?: AxiosRequestConfig;
  onSuccess?: (data: T) => void;
  onFail?: (error: any) => void;
  cacheKey?: string;
  cacheTTL?: number;
  skipCache?: boolean;
  pagination?: {
    pageParam: string;
    limitParam: string;
    page: number;
    limit: number;
  };
  retry?: RetryConfig | boolean;
}

export interface UseGetQueryState<T> {
  data: T | null;
  error: Error | AxiosError | null;
  loading: boolean;
  hasNextPage: boolean;
  totalPages: number;
  totalItems: number;
}

export interface UseGetQueryReturn<T> extends UseGetQueryState<T> {
  getQuery: (params: UseGetQueryParams<T>) => Promise<T | null>;
  refetch: () => Promise<T | null>;
  cancelRequest: () => void;
  clearCache: (cacheKey?: string) => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

declare function useGetQuery<T = any>(
  initialUrl?: string, 
  initialConfig?: AxiosRequestConfig
): UseGetQueryReturn<T>;

export default useGetQuery; 