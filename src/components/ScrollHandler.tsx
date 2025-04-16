import React, { useRef } from 'react';
import { useScrollHandler } from '@/hooks/useScrolling';

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
  
  // Use the consolidated scroll handler hook with type assertion
  useScrollHandler({
    targetRef: targetRef || (internalRef as React.RefObject<HTMLElement>),
    threshold,
    enableSticky,
    onScroll
  });
  
  // If using internal ref, wrap children in a div
  if (!targetRef) {
    return <div ref={internalRef}>{children}</div>;
  }
  
  // If targetRef is provided, just render children
  return <>{children}</>;
}; 