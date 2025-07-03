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
    
    // Calculate header offset (if you have a fixed header)
    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 10);
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
  }, []);
}

/**
 * Hook to dynamically adjust content min-height based on footer height
 * This ensures the footer always appears at the bottom, even on short pages,
 * without creating unnecessary scrollbars
 * 
 * @param contentRef - Reference to the main content container
 */
export function useDynamicFooterHeight(contentRef: RefObject<HTMLElement | HTMLDivElement | null>) {
  useEffect(() => {
    // Function to update the CSS variable with the footer height
    const updateFooterMargin = () => {
      const footer = document.querySelector('footer');
      if (!footer || !contentRef.current) return;
      
      // Get footer height
      const footerHeight = footer.offsetHeight;
      
      // Update CSS variable
      document.documentElement.style.setProperty('--footer-margin', `${footerHeight}px`);
      
      // Ensure content has enough minimum height
      const windowHeight = window.innerHeight;
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 
        10
      );
      
      // Set min-height to viewport height minus header and footer
      const minHeight = windowHeight - headerHeight - footerHeight;
      contentRef.current.style.minHeight = `${Math.max(minHeight, 200)}px`;
    };
    
    // Update on resize and initial load
    updateFooterMargin();
    window.addEventListener('resize', updateFooterMargin);
    
    // Fallback for dynamic content changes
    const resizeObserver = new ResizeObserver(updateFooterMargin);
    
    // Observe the footer for size changes
    const footer = document.querySelector('footer');
    if (footer) {
      resizeObserver.observe(footer);
    }
    
    return () => {
      window.removeEventListener('resize', updateFooterMargin);
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
 * Custom hook for scroll handling
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
  
  useEffect(() => {
    const element = targetRef?.current;
    if (!element) return;
    
    const handleScroll = () => {
      if (!element) return;
      
      // Get current scroll position
      const currentScrollPosition = window.scrollY;
      setScrollPosition(currentScrollPosition);
      
      // Check if element is already fixed or sticky
      const computedStyle = window.getComputedStyle(element);
      const isAlreadyFixed = computedStyle.position === 'fixed' || 
                             computedStyle.position === 'sticky';
      
      // Calculate if element should be sticky based on threshold
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const shouldBeSticky = currentScrollPosition > (elementTop - threshold);
      
      // Update sticky state if needed
      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
        
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
        
        // Call onScroll callback if provided
        if (onScroll) {
          onScroll(shouldBeSticky, currentScrollPosition);
        }
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetRef, threshold, enableSticky, isSticky, onScroll]);
  
  return {
    isSticky,
    scrollPosition,
    setSticky: setIsSticky
  };
}

/**
 * ScrollProgress hook for tracking scroll progress percentage
 * @returns Current scroll progress percentage (0-100)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    let rafId: number;
    
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
