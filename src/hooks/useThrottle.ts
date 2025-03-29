import { useState, useEffect, useRef } from 'react';

/**
 * A hook that throttles a value, limiting how frequently it updates
 * @param value The value to throttle
 * @param limit The minimum time between updates in milliseconds
 * @param leading Whether to invoke on the leading edge of the timeout
 * @param trailing Whether to invoke on the trailing edge of the timeout
 * @returns The throttled value
 */
function useThrottle<T>(
  value: T, 
  limit: number = 300, 
  leading: boolean = true, 
  trailing: boolean = true
): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialValue = useRef<T>(value);
  
  // Store pending value for trailing edge execution
  const pendingValue = useRef<T>(value);

  useEffect(() => {
    pendingValue.current = value;
    const now = Date.now();
    const timeElapsed = now - lastUpdated.current;

    // Clear any existing timeout
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    if (timeElapsed >= limit) {
      // If enough time has passed since last update and we want leading edge execution
      if (leading || lastUpdated.current === 0) {
        setThrottledValue(value);
        lastUpdated.current = now;
      } else if (trailing) {
        // Schedule trailing execution
        timer.current = setTimeout(() => {
          setThrottledValue(pendingValue.current);
          lastUpdated.current = Date.now();
          timer.current = null;
        }, limit);
      }
    } else if (trailing) {
      // Schedule an update after the remaining time for trailing edge
      timer.current = setTimeout(() => {
        setThrottledValue(pendingValue.current);
        lastUpdated.current = Date.now();
        timer.current = null;
      }, limit - timeElapsed);
    }

    // On unmount, clear the timeout
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [value, limit, leading, trailing]);

  // On first render, if leading is false, return initial value
  if (lastUpdated.current === 0 && !leading) {
    return initialValue.current;
  }

  return throttledValue;
}

export default useThrottle; 