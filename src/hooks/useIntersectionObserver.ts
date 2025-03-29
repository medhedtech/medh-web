import { useState, useEffect, RefObject, useCallback } from 'react';

export interface IntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Whether to disconnect the observer after first intersection
   */
  triggerOnce?: boolean;
  /**
   * Whether to initially check if the element is already visible
   */
  initialCheck?: boolean;
  /**
   * Delay in ms before starting to observe
   */
  delay?: number;
  /**
   * Whether the hook should start observing right away
   */
  enabled?: boolean;
}

export interface IntersectionResult {
  /**
   * Whether the element is currently intersecting the viewport
   */
  isIntersecting: boolean;
  /**
   * The intersection ratio between the element and its root
   */
  intersectionRatio: number;
  /**
   * The full IntersectionObserverEntry object
   */
  entry: IntersectionObserverEntry | null;
  /**
   * Function to manually refresh the observer (re-observe the element)
   */
  refresh: () => void;
}

/**
 * Determine if an element is currently visible in the viewport
 */
function isElementVisible(element: HTMLElement, root: Element | null): boolean {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  // If we have a root, use its bounds, otherwise use the viewport
  const rootRect = root ? root.getBoundingClientRect() : {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Check if the element is in the viewport or specified root
  return (
    rect.top < rootRect.bottom &&
    rect.bottom > rootRect.top &&
    rect.left < rootRect.right &&
    rect.right > rootRect.left
  );
}

/**
 * Hook that observes when an element enters or leaves the viewport
 * @param elementRef React ref object pointing to the element to observe
 * @param options Intersection observer options with additional hook options
 * @returns Object containing intersection information and utilities
 */
function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>,
  options: IntersectionObserverOptions = {}
): IntersectionResult {
  const { 
    root = null, 
    rootMargin = '0px', 
    threshold = 0,
    triggerOnce = false,
    initialCheck = true,
    delay = 0,
    enabled = true,
    ...observerOptions
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [observerInstance, setObserverInstance] = useState<IntersectionObserver | null>(null);
  
  // Update entry with latest intersection data
  const handleEntryUpdate = useCallback((entries: IntersectionObserverEntry[]): void => {
    const [entry] = entries;
    setEntry(entry);
  }, []);

  // Create and setup observer
  useEffect(() => {
    if (!enabled) return;

    let timeout: ReturnType<typeof setTimeout>;
    
    // Handle delay if specified
    if (delay > 0) {
      timeout = setTimeout(setupObserver, delay);
    } else {
      setupObserver();
    }
    
    function setupObserver() {
      // Clear any existing observer
      if (observerInstance) {
        observerInstance.disconnect();
      }
      
      // Create a new observer with current options
      const newObserver = new IntersectionObserver(handleEntryUpdate, {
        root,
        rootMargin,
        threshold,
        ...observerOptions
      });
      
      setObserverInstance(newObserver);
      
      // Start observing the element if it exists
      const currentElement = elementRef.current;
      if (currentElement) {
        newObserver.observe(currentElement);
        
        // Optionally run initial check for elements already in viewport
        if (initialCheck) {
          const initialEntries = [{
            boundingClientRect: currentElement.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: currentElement.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target: currentElement,
            time: Date.now()
          }];
          
          if (isElementVisible(currentElement, root as Element | null)) {
            handleEntryUpdate(initialEntries as IntersectionObserverEntry[]);
          }
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (timeout) clearTimeout(timeout);
      if (observerInstance) observerInstance.disconnect();
    };
  }, [
    enabled,
    elementRef,
    root,
    rootMargin,
    threshold,
    delay,
    initialCheck,
    handleEntryUpdate,
    observerInstance,
    observerOptions
  ]);
  
  // Disconnect observer if triggerOnce is true and element is intersecting
  useEffect(() => {
    if (triggerOnce && entry?.isIntersecting && observerInstance) {
      observerInstance.disconnect();
    }
  }, [triggerOnce, entry?.isIntersecting, observerInstance]);
  
  // Function to manually refresh the observer
  const refresh = useCallback(() => {
    if (!observerInstance || !elementRef.current) return;
    
    observerInstance.unobserve(elementRef.current);
    observerInstance.observe(elementRef.current);
  }, [observerInstance, elementRef]);

  return {
    isIntersecting: entry?.isIntersecting || false,
    intersectionRatio: entry?.intersectionRatio || 0,
    entry,
    refresh
  };
}

export default useIntersectionObserver; 