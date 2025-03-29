'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * A hook for using localStorage with React state
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value to use if no value is found in localStorage
 * @returns A tuple of [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] {
  // Get from localStorage on initial render
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried to set localStorage key "${key}" even though window is not defined`);
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a custom event so other instances can update
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes to this localStorage key from other components
  useEffect(() => {
    // Handle storage events - for when localStorage changes in another document
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    // Handle custom events - for when localStorage changes in the same document
    const handleCustomEvent = () => {
      setStoredValue(readValue());
    };

    // Subscribe to events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleCustomEvent);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleCustomEvent);
    };
  }, [key, readValue, initialValue]);

  return [storedValue, setValue];
}

// For backwards compatibility
export default useLocalStorage; 