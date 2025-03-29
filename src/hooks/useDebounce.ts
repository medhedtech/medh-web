import { useState, useEffect, useRef } from 'react';

/**
 * A hook that debounces a value, delaying updates until after a specified timeout
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @param immediate Whether to update the value immediately on the first change
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number = 500, immediate: boolean = false): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isFirstRender = useRef<boolean>(true);
  
  useEffect(() => {
    // If immediate is true and it's the first render, update immediately
    if (immediate && isFirstRender.current) {
      setDebouncedValue(value);
      isFirstRender.current = false;
      return;
    }
    
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, immediate]);

  return debouncedValue;
}

export default useDebounce;