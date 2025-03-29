"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

export interface ScrollDirectionOptions {
  /**
   * Initial scroll direction
   */
  initialDirection?: ScrollDirection;
  /**
   * Threshold in pixels before direction change is detected
   */
  thresholdPixels?: number;
  /**
   * Turn off scroll detection
   */
  off?: boolean;
  /**
   * Debounce time in ms
   */
  debounceTime?: number;
  /**
   * Whether to reset the direction to 'none' when scrolling stops
   */
  resetWhenStill?: boolean;
  /**
   * Time in ms to wait before considering scrolling stopped
   */
  stillThreshold?: number;
}

/**
 * Hook that detects scroll direction with various configuration options
 * 
 * @param options - Configuration options for scroll detection
 * @returns Current scroll direction ('up', 'down', or 'none')
 * 
 * @example
 * // Basic usage
 * const scrollDirection = useScrollDirection();
 * 
 * // With advanced options
 * const scrollDirection = useScrollDirection({
 *   thresholdPixels: 20,
 *   debounceTime: 150,
 *   resetWhenStill: true
 * });
 */
function useScrollDirection(options: ScrollDirectionOptions = {}): ScrollDirection {
  const {
    initialDirection = 'none',
    thresholdPixels = 10,
    off = false,
    debounceTime = 0,
    resetWhenStill = false,
    stillThreshold = 500
  } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  
  // Use refs instead of state for values that don't need to trigger re-renders
  const ticking = useRef<boolean>(false);
  const stillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTime = useRef<number>(Date.now());
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if user has scrolled to the top
  const isAtTop = useRef<boolean>(true);

  const updateScrollDirection = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const scrollY = window.pageYOffset;
    
    // Update top status
    isAtTop.current = scrollY <= 0;
    
    // Determine direction only if we've scrolled more than the threshold
    if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
      ticking.current = false;
      return;
    }

    // Reset any still timeout
    if (stillTimeoutRef.current) {
      clearTimeout(stillTimeoutRef.current);
      stillTimeoutRef.current = null;
    }

    // Update last scroll time for still detection
    lastScrollTime.current = Date.now();

    const newDirection: ScrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    
    // Only update if the direction has changed
    if (newDirection !== scrollDirection) {
      setScrollDirection(newDirection);
    }

    // Update last scroll position, ensure it's never negative
    setLastScrollY(scrollY > 0 ? scrollY : 0);
    ticking.current = false;

    // Set up a timeout to detect when scrolling stops
    if (resetWhenStill) {
      stillTimeoutRef.current = setTimeout(() => {
        const timeElapsed = Date.now() - lastScrollTime.current;
        if (timeElapsed >= stillThreshold) {
          setScrollDirection('none');
        }
      }, stillThreshold);
    }
  }, [scrollDirection, lastScrollY, thresholdPixels, resetWhenStill, stillThreshold]);

  const handleScroll = useCallback(() => {
    if (off || ticking.current) return;
    
    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (debounceTime > 0) {
      // Use debounce if specified
      debounceTimeoutRef.current = setTimeout(() => {
        ticking.current = true;
        requestAnimationFrame(updateScrollDirection);
      }, debounceTime);
    } else {
      // Otherwise process immediately using requestAnimationFrame
      ticking.current = true;
      requestAnimationFrame(updateScrollDirection);
    }
  }, [off, updateScrollDirection, debounceTime]);

  useEffect(() => {
    if (typeof window === 'undefined' || off) return;

    // Set initial values on mount
    setLastScrollY(window.pageYOffset);
    
    // Set up scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Clean up timeouts
      if (stillTimeoutRef.current) {
        clearTimeout(stillTimeoutRef.current);
      }
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [off, handleScroll]);

  return scrollDirection;
}

export default useScrollDirection;