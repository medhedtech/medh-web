import { useState, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollOptions {
  /**
   * Whether the infinite scroll should be disabled
   */
  disabled?: boolean;
  /**
   * Root margin for the IntersectionObserver
   */
  rootMargin?: string;
  /**
   * Threshold for the IntersectionObserver
   */
  threshold?: number | number[];
}

/**
 * Custom hook for implementing infinite scroll functionality
 * 
 * @param fetchFunction - Function to call when more items need to be loaded
 * @param options - Configuration options for the infinite scroll
 * @returns Object containing isFetching state, setIsFetching function, and observerTarget ref
 */
const useInfiniteScroll = (
  fetchFunction: () => Promise<any>,
  options: InfiniteScrollOptions = {}
) => {
  const { disabled = false, rootMargin = '0px 0px 200px 0px', threshold = 0.1 } = options;
  
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Handle intersection with the target element
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      // If the target is intersecting and we're not already fetching and not disabled
      if (entry.isIntersecting && !isFetching && !disabled) {
        setIsFetching(true);
        
        // Call the fetch function and reset isFetching when done
        fetchFunction()
          .then(() => {
            // Small delay to prevent multiple fetches
            setTimeout(() => {
              setIsFetching(false);
            }, 200);
          })
          .catch((error) => {
            console.error('Error in infinite scroll fetch:', error);
            setIsFetching(false);
          });
      }
    },
    [fetchFunction, isFetching, disabled]
  );
  
  // Set up the intersection observer
  useEffect(() => {
    // Don't set up the observer if disabled
    if (disabled) {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
      return;
    }
    
    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });
    
    // Observe the target element if it exists
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.current.observe(currentTarget);
    }
    
    // Clean up on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, disabled, rootMargin, threshold]);
  
  return { isFetching, setIsFetching, observerTarget };
};

export default useInfiniteScroll; 