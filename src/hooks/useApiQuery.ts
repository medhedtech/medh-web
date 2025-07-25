// React Query hooks for MEDH API integration
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
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
const baseKeys = ['api'] as const;
const coursesBase = [...baseKeys, 'courses'] as const;
const usersBase = [...baseKeys, 'users'] as const;
const instructorBase = [...baseKeys, 'instructor'] as const;
const parentBase = [...baseKeys, 'parent'] as const;

export const queryKeys = {
  all: baseKeys,
  lists: () => [...baseKeys, 'list'] as const,
  list: (filters: string) => [...baseKeys, 'list', { filters }] as const,
  details: () => [...baseKeys, 'detail'] as const,
  detail: (id: string | number) => [...baseKeys, 'detail', id] as const,
  
  // Specific domain keys
  courses: {
    all: coursesBase,
    lists: () => [...coursesBase, 'list'] as const,
    list: (filters: string) => [...coursesBase, 'list', { filters }] as const,
    details: () => [...coursesBase, 'detail'] as const,
    detail: (id: string | number) => [...coursesBase, 'detail', id] as const,
  },
  
  users: {
    all: usersBase,
    lists: () => [...usersBase, 'list'] as const,
    list: (filters: string) => [...usersBase, 'list', { filters }] as const,
    details: () => [...usersBase, 'detail'] as const,
    detail: (id: string | number) => [...usersBase, 'detail', id] as const,
    profile: () => [...usersBase, 'profile'] as const,
  },
  
  instructor: {
    all: instructorBase,
    dashboard: () => [...instructorBase, 'dashboard'] as const,
    courses: () => [...instructorBase, 'courses'] as const,
    students: () => [...instructorBase, 'students'] as const,
    assignments: () => [...instructorBase, 'assignments'] as const,
  },
  
  parent: {
    all: parentBase,
    dashboard: () => [...parentBase, 'dashboard'] as const,
    children: () => [...parentBase, 'children'] as const,
    progress: (childId: string) => [...parentBase, 'children', childId, 'progress'] as const,
  },
} as const;

// Infinite query hook
export const useInfiniteApiQuery = <T>(
  key: string[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{ data: T[]; nextPage?: number }>,
  options?: any
) => {
  const { handleError } = useErrorHandler();

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 1 }: { pageParam: number }) => queryFn({ pageParam }),
    getNextPageParam: (lastPage: { data: T[]; nextPage?: number }) => lastPage?.nextPage ?? undefined,
    initialPageParam: 1,
    ...options,
  });
};