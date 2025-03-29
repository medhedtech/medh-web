import { useEffect, useRef } from 'react';

/**
 * A hook that returns the previous value of a variable after it changes
 * @param value The value to track
 * @param initialValue Optional initial value for first render
 * @returns The previous value of the variable (initialValue on first render if provided, undefined otherwise)
 */
function usePrevious<T>(value: T, initialValue?: T): T | undefined {
  // Ref to store the previous value
  const previousRef = useRef<T | undefined>(initialValue);
  // Ref to store the current value
  const currentRef = useRef<T>(value);
  
  // Keep track of whether this is the first render
  const isFirstRender = useRef<boolean>(true);
  
  useEffect(() => {
    // Skip effect on the first render if initial value is provided
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Update previous value with the last value before the current update
    previousRef.current = currentRef.current;
    // Update current value with the new value from the current render
    currentRef.current = value;
  }, [value]);

  return previousRef.current;
}

export default usePrevious; 