'use client';

import { useState, useTransition, useCallback, useOptimistic } from 'react';
import {
  fetchCoursesAction,
  fetchCourseDetailsAction,
  fetchBlogsAction,
  fetchBlogDetailsAction,
  fetchUserDashboardAction,
  globalSearchAction,
  revalidateContentAction
} from '@/lib/server-actions';

// ===== TYPES =====

interface IUseServerDataOptions {
  enableOptimistic?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: any) => void;
}

interface IServerDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isPending: boolean;
}

// ===== MAIN HOOK =====

/**
 * Enhanced hook for server-side data fetching with optimistic updates
 * Replaces client-side useEffect patterns with server actions
 */
export const useServerData = <T = any>(options: IUseServerDataOptions = {}) => {
  const {
    enableOptimistic = false,
    retryAttempts = 2,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<IServerDataState<T>>({
    data: null,
    loading: false,
    error: null,
    isPending: false
  });

  // Optimistic updates for better UX
  const [optimisticData, addOptimistic] = useOptimistic(
    state.data,
    (currentData: T | null, optimisticValue: T) => optimisticValue
  );

  /**
   * Generic server action executor with retry logic
   */
  const executeServerAction = useCallback(async <TResult>(
    action: () => Promise<{ success: boolean; data?: TResult; error?: string }>,
    optimisticUpdate?: TResult
  ): Promise<TResult | null> => {
    let attempts = 0;

    const execute = async (): Promise<TResult | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null, isPending: true }));

        // Apply optimistic update if provided
        if (enableOptimistic && optimisticUpdate) {
          addOptimistic(optimisticUpdate as T);
        }

        const result = await action();

        if (result.success && result.data) {
          setState(prev => ({
            ...prev,
            data: result.data as T,
            loading: false,
            error: null,
            isPending: false
          }));
          
          onSuccess?.(result.data);
          return result.data;
        } else {
          throw new Error(result.error || 'Server action failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Retry logic
        if (attempts < retryAttempts) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
          return execute();
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          isPending: false
        }));
        
        onError?.(errorMessage);
        return null;
      }
    };

    return new Promise((resolve) => {
      startTransition(async () => {
        const result = await execute();
        resolve(result);
      });
    });
  }, [enableOptimistic, retryAttempts, retryDelay, onError, onSuccess, addOptimistic]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isPending: false
    });
  }, []);

  return {
    data: enableOptimistic ? optimisticData : state.data,
    loading: state.loading,
    error: state.error,
    isPending: isPending || state.isPending,
    executeServerAction,
    clearError,
    reset
  };
};

// ===== SPECIALIZED HOOKS =====

/**
 * Hook for server-side course data fetching
 */
export const useServerCourses = (options: IUseServerDataOptions = {}) => {
  const serverData = useServerData(options);

  const fetchCourses = useCallback(async (filters = {}) => {
    return serverData.executeServerAction(() => fetchCoursesAction(filters));
  }, [serverData]);

  const fetchCourseDetails = useCallback(async (courseId: string) => {
    return serverData.executeServerAction(() => fetchCourseDetailsAction(courseId));
  }, [serverData]);

  return {
    ...serverData,
    fetchCourses,
    fetchCourseDetails
  };
};

/**
 * Hook for server-side blog data fetching
 */
export const useServerBlogs = (options: IUseServerDataOptions = {}) => {
  const serverData = useServerData(options);

  const fetchBlogs = useCallback(async (filters = {}) => {
    return serverData.executeServerAction(() => fetchBlogsAction(filters));
  }, [serverData]);

  const fetchBlogDetails = useCallback(async (blogId: string) => {
    return serverData.executeServerAction(() => fetchBlogDetailsAction(blogId));
  }, [serverData]);

  return {
    ...serverData,
    fetchBlogs,
    fetchBlogDetails
  };
};

/**
 * Hook for server-side dashboard data fetching
 */
export const useServerDashboard = (options: IUseServerDataOptions = {}) => {
  const serverData = useServerData(options);

  const fetchDashboardData = useCallback(async (userId: string, userRole: string) => {
    return serverData.executeServerAction(() => fetchUserDashboardAction(userId, userRole));
  }, [serverData]);

  return {
    ...serverData,
    fetchDashboardData
  };
};

/**
 * Hook for server-side search functionality
 */
export const useServerSearch = (options: IUseServerDataOptions = {}) => {
  const serverData = useServerData(options);

  const performSearch = useCallback(async (query: string, filters = {}) => {
    return serverData.executeServerAction(() => globalSearchAction(query, filters));
  }, [serverData]);

  return {
    ...serverData,
    performSearch
  };
};

/**
 * Hook for content revalidation
 */
export const useServerRevalidation = () => {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const revalidateContent = useCallback(async (paths: string[]) => {
    setIsRevalidating(true);
    
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const result = await revalidateContentAction(paths);
          setIsRevalidating(false);
          resolve(result.success);
        } catch (error) {
          console.error('Revalidation failed:', error);
          setIsRevalidating(false);
          resolve(false);
        }
      });
    });
  }, []);

  return {
    revalidateContent,
    isRevalidating: isRevalidating || isPending
  };
};

// ===== UTILITY HOOKS =====

/**
 * Hook for prefetching data on hover/focus for better UX
 */
export const useServerPrefetch = () => {
  const prefetchCache = new Map<string, any>();

  const prefetchCourse = useCallback(async (courseId: string) => {
    const cacheKey = `course-${courseId}`;
    if (prefetchCache.has(cacheKey)) return;

    try {
      const result = await fetchCourseDetailsAction(courseId);
      if (result.success) {
        prefetchCache.set(cacheKey, result.data);
      }
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }, []);

  const prefetchBlog = useCallback(async (blogId: string) => {
    const cacheKey = `blog-${blogId}`;
    if (prefetchCache.has(cacheKey)) return;

    try {
      const result = await fetchBlogDetailsAction(blogId);
      if (result.success) {
        prefetchCache.set(cacheKey, result.data);
      }
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }, []);

  const getCachedData = useCallback((key: string) => {
    return prefetchCache.get(key);
  }, []);

  return {
    prefetchCourse,
    prefetchBlog,
    getCachedData
  };
};

/**
 * Hook for batch loading operations
 */
export const useServerBatch = () => {
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<any[]>([]);

  const executeBatch = useCallback(async (actions: Array<() => Promise<any>>) => {
    setBatchLoading(true);
    setBatchResults([]);

    try {
      const results = await Promise.allSettled(actions.map(action => action()));
      const processedResults = results.map((result, index) => ({
        index,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));

      setBatchResults(processedResults);
      return processedResults;
    } catch (error) {
      console.error('Batch execution failed:', error);
      return [];
    } finally {
      setBatchLoading(false);
    }
  }, []);

  return {
    executeBatch,
    batchLoading,
    batchResults
  };
}; 