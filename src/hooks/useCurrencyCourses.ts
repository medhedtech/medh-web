"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCoursesWithFields } from '@/apis/course/course';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { showToast } from '@/utils/toastManager';
import axios from 'axios';

// Types
export interface CurrencyLocation {
  countryCode: string;
  countryName: string;
  currency: string;
}

export interface CurrencyCoursesOptions {
  fields?: string[];
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface UseCurrencyCoursesReturn {
  courses: any[] | null;
  coursesLoading: boolean;
  coursesError: Error | null;
  fetchCourses: (options?: CurrencyCoursesOptions) => Promise<any[] | null>;
}

/**
 * Hook for fetching courses
 */
export const useCurrencyCourses = (initialOptions?: CurrencyCoursesOptions): UseCurrencyCoursesReturn => {
  const [courses, setCourses] = useState<any[] | null>(null);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<Error | null>(null);

  const { getQuery } = useGetQuery();

  // Fetch courses with the provided options
  const fetchCourses = useCallback(async (options?: CurrencyCoursesOptions): Promise<any[] | null> => {
    try {
      // Only set loading if we don't already have data
      if (!courses || courses.length === 0) {
        setCoursesLoading(true);
      }
      setCoursesError(null);
      
      const mergedOptions = { ...initialOptions, ...options };
      
      // Construct the API URL with the fields, filters, etc.
      const url = getCoursesWithFields({
        fields: mergedOptions.fields,
        filters: {}, // No currency filter applied
        page: mergedOptions.page,
        limit: mergedOptions.limit,
        status: mergedOptions.status,
        search: mergedOptions.search
      });
      
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await getQuery({ 
        url,
        config: { signal: controller.signal }
      });
      
      clearTimeout(timeoutId);
      
      if (response?.success && Array.isArray(response.data)) {
        setCourses(response.data);
        return response.data;
      } else if (response?.success && response.data) {
        // Handle case where response is not an array but contains data
        const courseData = Array.isArray(response.data.courses) ? response.data.courses : [response.data];
        setCourses(courseData);
        return courseData;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch courses';
      console.error('Error fetching courses:', error);
      setCoursesError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setCoursesLoading(false);
    }
  }, [getQuery, initialOptions, courses]);

  // Initial fetch on mount
  useEffect(() => {
    if (initialOptions) {
      fetchCourses(initialOptions);
    }
  }, [initialOptions, fetchCourses]);

  return {
    courses,
    coursesLoading,
    coursesError,
    fetchCourses,
  };
};

export default useCurrencyCourses; 