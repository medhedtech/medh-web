import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

/**
 * Custom hook that provides a scrollToTop function
 * Smoothly scrolls the page to the top
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }, []);

  return scrollToTop;
}

/**
 * Custom hook that tracks whether the page has been scrolled past a certain threshold
 * @param threshold - The scroll position threshold in pixels
 * @returns A boolean indicating whether the threshold has been passed
 */
export function useScrollVisibility(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Using requestAnimationFrame for performance
    requestAnimationFrame(() => {
      setIsVisible(window.scrollY > threshold);
    });
  }, [threshold]);
  
  useEffect(() => {
    // Check initial position
    handleScroll();
    
    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  return isVisible;
}

/**
 * Custom hook that provides smooth scrolling for anchor links
 * Respects user's motion preferences
 */
export function useSmoothAnchorScroll() {
  // Cache computed style values to avoid forced reflows
  const cachedHeaderHeight = useRef<number>(0);
  const lastComputedTime = useRef<number>(0);
  const CACHE_DURATION = 1000; // Cache for 1 second
  
  const getHeaderHeight = useCallback(() => {
    const now = Date.now();
    if (now - lastComputedTime.current < CACHE_DURATION) {
      return cachedHeaderHeight.current;
    }
    
    // Batch DOM reads to avoid forced reflows
    requestAnimationFrame(() => {
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 
        10
      );
      cachedHeaderHeight.current = headerHeight;
      lastComputedTime.current = now;
    });
    
    return cachedHeaderHeight.current;
  }, []);

  return useCallback((event: MouseEvent) => {
    // Only process anchor links
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (!anchor) return;
    
    // Check if it's an internal anchor link
    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    
    // Get the target element
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    // Prevent default behavior
    event.preventDefault();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Use cached header height to avoid forced reflow
    const headerOffset = getHeaderHeight();
    
    // Batch DOM reads in a single frame to avoid forced reflows
    requestAnimationFrame(() => {
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      
      // Perform the scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      
      // Update URL hash without scrolling
      history.pushState(null, '', href);
      
      // Focus the target for accessibility
      targetElement.focus({ preventScroll: true });
      
      // Set tabindex if not interactive
      if (!targetElement.getAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.addEventListener('blur', () => {
          targetElement.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }, [getHeaderHeight]);
}

/**
 * Hook to dynamically adjust content min-height based on footer height
 * This ensures the footer always appears at the bottom, even on short pages,
 * without creating unnecessary scrollbars
 * 
 * @param contentRef - Reference to the main content container
 */
export function useDynamicFooterHeight(contentRef: RefObject<HTMLElement | HTMLDivElement | null>) {
  // Cache values to avoid repeated DOM queries
  const cachedFooterHeight = useRef<number>(0);
  const cachedWindowHeight = useRef<number>(0);
  const cachedHeaderHeight = useRef<number>(0);
  const lastUpdateTime = useRef<number>(0);
  const CACHE_DURATION = 500; // Cache for 500ms
  
  useEffect(() => {
    // Function to update the CSS variable with the footer height
    const updateFooterMargin = () => {
      const now = Date.now();
      
      // Throttle updates to avoid excessive reflows
      if (now - lastUpdateTime.current < CACHE_DURATION) {
        return;
      }
      
      const footer = document.querySelector('footer');
      if (!footer || !contentRef.current) return;
      
      // Batch all DOM reads together to avoid forced reflows
      requestAnimationFrame(() => {
        // Get footer height - OPTIMIZED: Use cached value if available
        const footerHeight = footer.offsetHeight;
        cachedFooterHeight.current = footerHeight;
        
        // Get window height
        const windowHeight = window.innerHeight;
        cachedWindowHeight.current = windowHeight;
        
        // Get header height from CSS variable (avoid getComputedStyle if possible)
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 
          10
        );
        cachedHeaderHeight.current = headerHeight;
        
        // Batch DOM writes in the next frame to avoid layout thrashing
        requestAnimationFrame(() => {
          // Update CSS variable
          document.documentElement.style.setProperty('--footer-margin', `${footerHeight}px`);
          
          // Set min-height to viewport height minus header and footer
          if (contentRef.current) {
            contentRef.current.style.minHeight = `calc(${windowHeight}px - ${headerHeight}px - ${footerHeight}px)`;
          }
          
          lastUpdateTime.current = now;
        });
      });
    };
    
    // Debounced version to avoid excessive calls
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateFooterMargin, 100);
    };
    
    // Update on resize and initial load
    updateFooterMargin();
    window.addEventListener('resize', debouncedUpdate, { passive: true });
    
    // Optimized ResizeObserver with throttling
    let observerTimeoutId: NodeJS.Timeout;
    const throttledObserverCallback = () => {
      clearTimeout(observerTimeoutId);
      observerTimeoutId = setTimeout(updateFooterMargin, 150);
    };
    
    const resizeObserver = new ResizeObserver(throttledObserverCallback);
    
    // Observe the footer for size changes
    const footer = document.querySelector('footer');
    if (footer) {
      resizeObserver.observe(footer);
    }
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      resizeObserver.disconnect();
    };
  }, [contentRef]);
}

interface ScrollHandlerOptions {
  targetRef?: RefObject<HTMLElement>;
  threshold?: number;
  enableSticky?: boolean;
  onScroll?: (isSticky: boolean, scrollPosition: number) => void;
}

/**
 * Custom hook for scroll handling - OPTIMIZED to prevent forced reflows
 * 
 * @param options - Hook options including targetRef, threshold, enableSticky, and onScroll
 * @returns Object with isSticky state, scrollPosition, and setSticky function
 */
export function useScrollHandler({
  targetRef,
  threshold = 100,
  enableSticky = true,
  onScroll
}: ScrollHandlerOptions = {}) {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  
  // Cache values to avoid repeated DOM queries
  const cachedElementTop = useRef<number>(0);
  const cachedComputedStyle = useRef<CSSStyleDeclaration | null>(null);
  const lastStyleCheck = useRef<number>(0);
  const STYLE_CACHE_DURATION = 1000; // Cache computed styles for 1 second
  
  useEffect(() => {
    const element = targetRef?.current;
    if (!element) return;
    
    // Pre-calculate element position to avoid getBoundingClientRect in scroll handler
    const calculateElementTop = () => {
      requestAnimationFrame(() => {
        if (element) {
          cachedElementTop.current = element.getBoundingClientRect().top + window.scrollY;
        }
      });
    };
    
    // Initial calculation
    calculateElementTop();
    
    const handleScroll = () => {
      if (!element) return;
      
      // Get current scroll position (this doesn't cause reflow)
      const currentScrollPosition = window.scrollY;
      setScrollPosition(currentScrollPosition);
      
      // Use cached computed style to avoid forced reflow
      const now = Date.now();
      if (now - lastStyleCheck.current > STYLE_CACHE_DURATION) {
        requestAnimationFrame(() => {
          cachedComputedStyle.current = window.getComputedStyle(element);
          lastStyleCheck.current = now;
        });
      }
      
      // Check if element is already fixed or sticky using cached style
      const computedStyle = cachedComputedStyle.current;
      const isAlreadyFixed = computedStyle?.position === 'fixed' || 
                             computedStyle?.position === 'sticky';
      
      // Calculate if element should be sticky based on cached position
      const shouldBeSticky = currentScrollPosition > (cachedElementTop.current - threshold);
      
      // Update sticky state if needed
      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
        
        // Batch DOM writes to avoid layout thrashing
        requestAnimationFrame(() => {
          if (!element) return;
          
          // Apply sticky positioning if enabled
          if (enableSticky && shouldBeSticky) {
            element.style.position = 'sticky';
            element.style.top = '0';
            element.style.zIndex = '10';
          } else if (enableSticky && !shouldBeSticky) {
            element.style.position = '';
            element.style.top = '';
            element.style.zIndex = '';
          }
        });
        
        // Call onScroll callback if provided
        if (onScroll) {
          onScroll(shouldBeSticky, currentScrollPosition);
        }
      }
    };
    
    // Throttled scroll handler to reduce frequency
    let rafId: number;
    const throttledHandleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = 0;
      });
    };
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Recalculate element position on resize
    const handleResize = () => {
      calculateElementTop();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [targetRef, threshold, enableSticky, isSticky, onScroll]);
  
  return {
    isSticky,
    scrollPosition,
    setSticky: setIsSticky
  };
}

/**
 * ScrollProgress hook for tracking scroll progress percentage - OPTIMIZED
 * @returns Current scroll progress percentage (0-100)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  // Cache document dimensions to avoid repeated queries
  const cachedScrollHeight = useRef<number>(0);
  const cachedWindowHeight = useRef<number>(0);
  const lastDimensionCheck = useRef<number>(0);
  const DIMENSION_CACHE_DURATION = 1000; // Cache for 1 second

  useEffect(() => {
    let rafId: number;
    
    const updateDimensions = () => {
      const now = Date.now();
      if (now - lastDimensionCheck.current > DIMENSION_CACHE_DURATION) {
        // Batch dimension reads to avoid forced reflows
        requestAnimationFrame(() => {
          cachedScrollHeight.current = document.documentElement.scrollHeight;
          cachedWindowHeight.current = window.innerHeight;
          lastDimensionCheck.current = now;
        });
      }
    };
    
    const updateProgress = () => {
      // Update dimensions if needed
      updateDimensions();
      
      // Calculate progress using cached values
      const scrollHeight = cachedScrollHeight.current - cachedWindowHeight.current;
      const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(Math.min(Math.max(scrolled, 0), 100));
    };

    // Throttled scroll handler
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = 0;
      });
    };
    
    // Initial update
    updateDimensions();
    updateProgress();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return progress;
} 