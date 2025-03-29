import { useEffect, useCallback, RefObject } from 'react';

export interface UseClickOutsideOptions {
  enabled?: boolean;
  events?: Array<'mousedown' | 'mouseup' | 'touchstart' | 'touchend'>;
  capture?: boolean;
  excludeRefs?: RefObject<HTMLElement>[];
}

/**
 * Hook that triggers a callback when a click occurs outside of the specified element(s)
 * @param ref React ref object pointing to the element to monitor
 * @param callback Function to call when a click outside the element is detected
 * @param options Optional configuration for the hook behavior
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  callback: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {}
): void {
  const {
    enabled = true,
    events = ['mousedown', 'touchstart'],
    capture = false,
    excludeRefs = [],
  } = options;

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      // Convert single ref to array for consistent handling
      const refs = Array.isArray(ref) ? ref : [ref];
      
      // Get the event target as a Node
      const target = event.target as Node;
      
      // Check if the click is outside all tracked refs
      const isOutside = refs.every(r => !r.current || !r.current.contains(target));
      
      // Check if the click is inside any of the excluded refs
      const isExcluded = excludeRefs.some(
        r => r.current && r.current.contains(target)
      );
      
      // Only trigger callback if click is outside all refs and not in excluded refs
      if (isOutside && !isExcluded && enabled) {
        callback(event);
      }
    },
    [ref, callback, enabled, excludeRefs]
  );

  useEffect(() => {
    if (!enabled) return;

    // Add event listeners for all configured events
    events.forEach(event => {
      document.addEventListener(event, handleClickOutside as EventListener, capture);
    });

    // Clean up event listeners on component unmount
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleClickOutside as EventListener, capture);
      });
    };
  }, [events, handleClickOutside, enabled, capture]);
}

export default useClickOutside; 