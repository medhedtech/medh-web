"use client";
import { useState, useEffect, useCallback } from 'react';

export interface MediaQueryOptions {
  /**
   * Default value to use during server-side rendering
   */
  defaultValue?: boolean;
  /**
   * Whether to watch for changes (set to false to optimize for unchanging queries)
   */
  watchChanges?: boolean;
  /**
   * Debounce time in ms for media query change events
   */
  debounceTime?: number;
}

/**
 * Custom hook for responsive media queries
 * Uses window.matchMedia API with a fallback for older browsers
 * 
 * @param query CSS media query string (e.g. '(max-width: 768px)')
 * @param options Configuration options
 * @returns Whether the media query matches
 * 
 * @example
 * // Check if screen is mobile sized
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Check if device is in dark mode
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(
  query: string, 
  options: MediaQueryOptions = {}
): boolean {
  const { 
    defaultValue = false,
    watchChanges = true,
    debounceTime = 0 
  } = options;
  
  const [matches, setMatches] = useState<boolean>(defaultValue);
  const [mediaQueryList, setMediaQueryList] = useState<MediaQueryList | null>(null);

  // Handler for media query changes with debounce
  const handleChange = useCallback((e: MediaQueryListEvent) => {
    if (debounceTime > 0) {
      const timerId = setTimeout(() => {
        setMatches(e.matches);
      }, debounceTime);
      return () => clearTimeout(timerId);
    } else {
      setMatches(e.matches);
      return undefined;
    }
  }, [debounceTime]);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    try {
      // Create the media query list
      const mql = window.matchMedia(query);
      setMediaQueryList(mql);
      
      // Set initial value
      setMatches(mql.matches);
      
      // Add event listener if we're watching for changes
      if (watchChanges) {
        // Use modern API if available, fallback for older browsers
        if (mql.addEventListener) {
          mql.addEventListener('change', handleChange);
        } else {
          // @ts-ignore - For older browsers
          mql.addListener(handleChange);
        }
      }
      
      // Clean up function
      return () => {
        if (watchChanges) {
          if (mql.removeEventListener) {
            mql.removeEventListener('change', handleChange);
          } else {
            // @ts-ignore - For older browsers
            mql.removeListener(handleChange);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up media query:', error);
      return undefined;
    }
  }, [query, watchChanges, handleChange]);

  // Extra utility to force refresh the query result
  const refresh = useCallback((): boolean => {
    if (mediaQueryList) {
      setMatches(mediaQueryList.matches);
      return mediaQueryList.matches;
    }
    return matches;
  }, [mediaQueryList, matches]);

  // Return the matches value and the refresh function
  return matches;
}

// For backwards compatibility
export default useMediaQuery;