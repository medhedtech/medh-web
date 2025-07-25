// React Query hooks for MEDH API integration
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';
import { ApiError } from '../types/common';

export interface ApiQueryOptions<T> extends Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
  staleTime?: number;
  retry?: number | ((failureCount: number, error: ApiError) => boolean);
}

export interface ApiMutationOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  invalidateQueries?: string[][];
  showSuccessToast?: boolean;
  successMessage?: string;
}

export const useApiQuery = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: ApiQueryOptions<T>
) => {
  const { handleError } = useErrorHandler();

  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn,
    onError: (error: ApiError) => {
      if (!options?.enabled) return; // Don't show errors for disabled queries
      handleError(error, { showToast: true });
    },
    retry: (failureCount: number, error: ApiError) => {
      // Don't retry on authentication errors
      if (error.error_code === 'UNAUTHORIZED' || error.error_code === 'FORBIDDEN') {
        return false;
      }
      
      // Custom retry logic
      if (typeof options?.retry === 'function') {
        return options.retry(failureCount, error);
      }
      
      return typeof options?.retry === 'number' ? failureCount < options.retry : failureCount < 3;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    ...options,
  });
};

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (data: TData, variables: TVariables) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Show success toast if configured
      if (options?.showSuccessToast && options?.successMessage) {
        // Dynamic import to avoid circular dependencies
        import('@/utils/toastManager').then(({ showToast }) => {
          showToast.success(options.successMessage!);
        });
      }
      
      // Call custom success handler
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error: ApiError) => {
      handleError(error, { showToast: true });
    },
    ...options,
  });
};

// Query key factory for consistent key management
export const queryKeys = {
  all: ['api'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...queryKeys.details(), id] as const,
  
  // Specific domain keys
  courses: {
    all: [...queryKeys.all, 'courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.courses.lists(), { filters }] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.courses.details(), id] as const,
  },
  
  users: {
    all: [...queryKeys.all, 'users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
  
  instructor: {
    all: [...queryKeys.all, 'instructor'] as const,
    dashboard: () => [...queryKeys.instructor.all, 'dashboard'] as const,
    courses: () => [...queryKeys.instructor.all, 'courses'] as const,
    students: () => [...queryKeys.instructor.all, 'students'] as const,
    assignments: () => [...queryKeys.instructor.all, 'assignments'] as const,
  },
  
  parent: {
    all: [...queryKeys.all, 'parent'] as const,
    dashboard: () => [...queryKeys.parent.all, 'dashboard'] as const,
    children: () => [...queryKeys.parent.all, 'children'] as const,
    progress: (childId: string) => [...queryKeys.parent.children(), childId, 'progress'] as const,
  },
} as const;

// Infinite query hook
export const useInfiniteApiQuery = <T>(
  key: string[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{ data: T[]; nextPage?: number }>,
  options?: Omit<UseQueryOptions<{ data: T[]; nextPage?: number }, ApiError>, 'queryKey' | 'queryFn'>
) => {
  const { handleError } = useErrorHandler();
  const { useInfiniteQuery } = require('@tanstack/react-query');

  return useInfiniteQuery({
    queryKey: key,
    queryFn,
    getNextPageParam: (lastPage: { data: T[]; nextPage?: number }) => lastPage.nextPage,
    onError: (error: ApiError) => {
      handleError(error, { showToast: true });
    },
    ...options,
  });
};