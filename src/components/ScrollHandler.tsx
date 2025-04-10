import { useEffect, useRef, useState } from 'react';

/**
 * ScrollHandler component for managing scroll behavior
 * 
 * @param {Object} props - Component props
 * @param {React.RefObject<HTMLElement>} props.targetRef - Reference to the element to track
 * @param {number} props.threshold - Scroll threshold in pixels (default: 100)
 * @param {boolean} props.enableSticky - Whether to enable sticky positioning (default: true)
 * @param {Function} props.onScroll - Callback function when scroll position changes
 * @param {React.ReactNode} props.children - Child elements
 */
interface ScrollHandlerProps {
  targetRef?: React.RefObject<HTMLElement>;
  threshold?: number;
  enableSticky?: boolean;
  onScroll?: (isSticky: boolean, scrollPosition: number) => void;
  children?: React.ReactNode;
}

/**
 * ScrollHandler component that manages scroll behavior for elements
 * 
 * @example
 * ```tsx
 * <ScrollHandler threshold={150} onScroll={(isSticky) => console.log(isSticky)}>
 *   <div>Content that will be tracked</div>
 * </ScrollHandler>
 * ```
 */
export const ScrollHandler: React.FC<ScrollHandlerProps> = ({
  targetRef,
  threshold = 100,
  enableSticky = true,
  onScroll,
  children
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  
  // Use provided ref or internal ref
  const elementRef = targetRef || internalRef;
  
  useEffect(() => {
    const element = elementRef.current;
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
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef, threshold, enableSticky, isSticky, onScroll]);
  
  // If using internal ref, wrap children in a div
  if (targetRef) {
    return <>{children}</>;
  }
  
  return (
    <div ref={internalRef}>
      {children}
    </div>
  );
};

/**
 * Custom hook for scroll handling
 * 
 * @param {Object} options - Hook options
 * @param {React.RefObject<HTMLElement>} options.targetRef - Reference to the element to track
 * @param {number} options.threshold - Scroll threshold in pixels (default: 100)
 * @param {boolean} options.enableSticky - Whether to enable sticky positioning (default: true)
 * @param {Function} options.onScroll - Callback function when scroll position changes
 * @returns {Object} Scroll state and utilities
 */
export const useScrollHandler = ({
  targetRef,
  threshold = 100,
  enableSticky = true,
  onScroll
}: Omit<ScrollHandlerProps, 'children'>) => {
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
    window.addEventListener('scroll', handleScroll);
    
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
}; 