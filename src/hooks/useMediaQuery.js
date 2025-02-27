"use client";
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * Uses window.matchMedia API with a fallback for older browsers
 * 
 * @param {string} query - CSS media query string (e.g. '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 * 
 * @example
 * // Check if screen is mobile sized
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Check if device is in dark mode
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query) {
  // Default to false on server-side
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Check if window.matchMedia is available
    if (!window.matchMedia) {
      console.warn('window.matchMedia is not available in this browser');
      return;
    }
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create handler function
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Older browsers support (e.g. Safari < 14)
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Older browsers support
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);
  
  return matches;
} 