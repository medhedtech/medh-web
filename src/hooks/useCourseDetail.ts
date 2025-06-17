"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCoursesWithFields } from '@/apis/course/course';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { showToast } from '@/utils/toastManager';
import axios from 'axios';

// Types
export interface CourseLocation {
  countryCode: string;
  countryName: string;
  currency: string;
}

export interface CourseDetailOptions {
  fields?: string[];
  filters?: Record<string, any>;
  sort?: { field: string; order: 'asc' | 'desc' };
  page?: number;
  limit?: number;
  useLocationFilter?: boolean;
}

export interface UseCourseDetailReturn {
  courses: any[] | null;
  coursesLoading: boolean;
  coursesError: Error | null;
  location: CourseLocation | null;
  locationLoading: boolean;
  fetchCourses: (options?: CourseDetailOptions) => Promise<any[] | null>;
  refetchWithLocation: () => Promise<any[] | null>;
}

/**
 * Enhanced hook for fetching course information based on user's location
 * and propagating this data across various sections of the website.
 */
export const useCourseDetail = (initialOptions?: CourseDetailOptions): UseCourseDetailReturn => {
  const [courses, setCourses] = useState<any[] | null>(null);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<Error | null>(null);
  const [location, setLocation] = useState<CourseLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const { getQuery } = useGetQuery();

  // Detect user's location from IP address
  const detectUserLocation = useCallback(async (): Promise<CourseLocation | null> => {
    try {
      setLocationLoading(true);
      
      // Try to get from localStorage first to avoid repeated API calls
      const cachedLocation = localStorage.getItem('userLocation');
      if (cachedLocation) {
        const parsedLocation = JSON.parse(cachedLocation);
        // Only use cache if it's less than 24 hours old
        const cacheTime = localStorage.getItem('userLocationTimestamp');
        if (cacheTime && (Date.now() - parseInt(cacheTime, 10)) < 86400000) {
          setLocation(parsedLocation);
          return parsedLocation;
        }
      }
      
      // Fetch location from IP geolocation API
      const ipResponse = await axios.get('https://ipapi.co/json/');
      
      if (ipResponse.data && ipResponse.data.country_code) {
        // Verify if country code exists in our system
        const verifyResponse = await getQuery({
          url: apiUrls.currencies.getAllCurrencyCountryCodes,
          config: { params: { code: ipResponse.data.country_code } }
        });
        
        if (verifyResponse?.exists) {
          const locationData: CourseLocation = {
            countryCode: ipResponse.data.country_code,
            countryName: ipResponse.data.country_name,
            currency: verifyResponse.currency || ipResponse.data.currency
          };
          
          // Cache the result
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          localStorage.setItem('userLocationTimestamp', Date.now().toString());
          
          setLocation(locationData);
          return locationData;
        }
      }
      
      // Fallback to default (e.g., US)
      const defaultLocation: CourseLocation = {
        countryCode: 'US',
        countryName: 'United States',
        currency: 'USD'
      };
      
      setLocation(defaultLocation);
      return defaultLocation;
    } catch (error) {
      console.error('Error detecting user location:', error);
      
      // Fallback to default location on error
      const defaultLocation: CourseLocation = {
        countryCode: 'US',
        countryName: 'United States',
        currency: 'USD'
      };
      
      setLocation(defaultLocation);
      return defaultLocation;
    } finally {
      setLocationLoading(false);
    }
  }, [getQuery]);

  // Fetch courses with the provided options
  const fetchCourses = useCallback(async (options?: CourseDetailOptions): Promise<any[] | null> => {
    try {
      // Only set loading if we don't already have data
      if (!courses || courses.length === 0) {
        setCoursesLoading(true);
      }
      setCoursesError(null);
      
      const mergedOptions = { ...initialOptions, ...options };
      let userLocation = location;
      
      // Get location if needed and not already available
      if (mergedOptions.useLocationFilter && !userLocation) {
        userLocation = await detectUserLocation();
      }
      
      // Add location filter if requested
      const filters: Record<string, any> = {};
      if (mergedOptions.useLocationFilter && userLocation) {
        filters.currency = userLocation.currency;
      }
      
      // Construct the API URL with the fields, filters, etc.
      const url = getCoursesWithFields({
        fields: mergedOptions.fields,
        filters,
        page: mergedOptions.page,
        limit: mergedOptions.limit
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
  }, [getQuery, initialOptions, location, detectUserLocation, courses]);

  // Helper function to refetch courses using current location
  const refetchWithLocation = useCallback(async (): Promise<any[] | null> => {
    await detectUserLocation();
    return fetchCourses({ ...initialOptions, useLocationFilter: true });
  }, [detectUserLocation, fetchCourses, initialOptions]);

  // Initial fetch on mount
  useEffect(() => {
    if (initialOptions) {
      if (initialOptions.useLocationFilter) {
        detectUserLocation().then(() => {
          fetchCourses(initialOptions);
        });
      } else {
        fetchCourses(initialOptions);
      }
    }
  }, [initialOptions, detectUserLocation, fetchCourses]);

  return {
    courses,
    coursesLoading,
    coursesError,
    location,
    locationLoading,
    fetchCourses,
    refetchWithLocation
  };
};

export default useCourseDetail; 