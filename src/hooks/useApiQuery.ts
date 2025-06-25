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
    onError: (error) => {
      if (!options?.enabled) return; // Don't show errors for disabled queries
      handleError(error, { showToast: true });
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.error_code === 'UNAUTHORIZED' || error.error_code === 'FORBIDDEN') {
        return false;
      }
      
      // Custom retry logic
      if (typeof options?.retry === 'function') {
        return options.retry(failureCount, error);
      }
      
      return (options?.retry ?? 1) > failureCount;
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    enabled: options?.enabled ?? true,
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
    onSuccess: (data, variables) => {
      // Show success toast if enabled
      if (options?.showSuccessToast !== false) {
        const { toast } = require('../utils/toast');
        toast.success(options?.successMessage || 'Operation completed successfully');
      }
      
      // Call custom onSuccess handler
      options?.onSuccess?.(data, variables);
      
      // Invalidate related queries
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error) => {
      handleError(error, { showToast: true });
      options?.onError?.(error);
    },
    ...options,
  });
};

// Specialized hooks for common patterns
export const useApiQueryWithRefresh = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  refreshInterval?: number,
  options?: ApiQueryOptions<T>
) => {
  return useApiQuery(key, queryFn, {
    ...options,
    refetchInterval: refreshInterval || 30000, // 30 seconds default
    refetchIntervalInBackground: false,
  });
};

export const useApiInfiniteQuery = <T>(
  key: string[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<T>,
  options?: ApiQueryOptions<T>
) => {
  const { handleError } = useErrorHandler();
  const { useInfiniteQuery } = require('@tanstack/react-query');

  return useInfiniteQuery({
    queryKey: key,
    queryFn,
    getNextPageParam: (lastPage: any) => {
      // Assuming pagination response structure
      if (lastPage?.pagination?.has_next) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    onError: handleError,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    ...options,
  });
};

// Query key factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    user: () => ['auth', 'user'] as const,
    permissions: () => ['auth', 'permissions'] as const,
  },
  
  // Parent
  parent: {
    all: () => ['parent'] as const,
    dashboard: () => [...queryKeys.parent.all(), 'dashboard'] as const,
    profile: () => [...queryKeys.parent.dashboard(), 'profile'] as const,
    children: () => [...queryKeys.parent.all(), 'children'] as const,
    child: (childId: string) => [...queryKeys.parent.children(), childId] as const,
    childProgress: (childId: string) => [...queryKeys.parent.child(childId), 'progress'] as const,
    childAttendance: (childId: string) => [...queryKeys.parent.child(childId), 'attendance'] as const,
    notifications: () => [...queryKeys.parent.all(), 'notifications'] as const,
    upcomingClasses: () => [...queryKeys.parent.dashboard(), 'upcoming-classes'] as const,
    messages: () => [...queryKeys.parent.all(), 'messages'] as const,
    meetings: () => [...queryKeys.parent.all(), 'meetings'] as const,
    payments: () => [...queryKeys.parent.all(), 'payments'] as const,
  },
  
  // Instructor
  instructor: {
    all: () => ['instructor'] as const,
    courses: () => [...queryKeys.instructor.all(), 'courses'] as const,
    course: (courseId: string) => [...queryKeys.instructor.courses(), courseId] as const,
    courseStudents: (courseId: string) => [...queryKeys.instructor.course(courseId), 'students'] as const,
    courseBatches: (courseId: string) => [...queryKeys.instructor.course(courseId), 'batches'] as const,
    stats: () => [...queryKeys.instructor.all(), 'stats'] as const,
    assignments: () => [...queryKeys.instructor.all(), 'assignments'] as const,
    assignment: (assignmentId: string) => [...queryKeys.instructor.assignments(), assignmentId] as const,
    assignmentSubmissions: (assignmentId: string) => [...queryKeys.instructor.assignment(assignmentId), 'submissions'] as const,
    attendance: () => [...queryKeys.instructor.all(), 'attendance'] as const,
    batchAttendance: (batchId: string) => [...queryKeys.instructor.attendance(), 'batch', batchId] as const,
    revenue: () => [...queryKeys.instructor.all(), 'revenue'] as const,
    revenueStats: () => [...queryKeys.instructor.revenue(), 'stats'] as const,
    monthlyRevenue: () => [...queryKeys.instructor.revenue(), 'monthly'] as const,
    announcements: () => [...queryKeys.instructor.all(), 'announcements'] as const,
    sessions: () => [...queryKeys.instructor.all(), 'sessions'] as const,
    performance: () => [...queryKeys.instructor.all(), 'performance'] as const,
  },
  
  // Common
  courses: {
    all: () => ['courses'] as const,
    course: (courseId: string) => [...queryKeys.courses.all(), courseId] as const,
    search: (query: string) => [...queryKeys.courses.all(), 'search', query] as const,
  },
  
  batches: {
    all: () => ['batches'] as const,
    batch: (batchId: string) => [...queryKeys.batches.all(), batchId] as const,
  },
  
  students: {
    all: () => ['students'] as const,
    student: (studentId: string) => [...queryKeys.students.all(), studentId] as const,
  },
};

// Helper function to invalidate multiple related queries
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateParentData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parent.all() });
    },
    
    invalidateInstructorData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instructor.all() });
    },
    
    invalidateAuthData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    
    invalidateSpecific: (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
};