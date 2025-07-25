/**
 * Performance Optimization Utilities
 * Provides tools to prevent forced reflows and optimize DOM operations
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Cache for computed styles to avoid repeated getComputedStyle calls
const styleCache = new Map<string, { value: CSSStyleDeclaration; timestamp: number }>();
const STYLE_CACHE_DURATION = 1000; // Cache for 1 second

// Cache for element dimensions to avoid repeated getBoundingClientRect calls
const dimensionCache = new Map<Element, { rect: DOMRect; timestamp: number }>();
const DIMENSION_CACHE_DURATION = 500; // Cache for 500ms

// RAF queue for batching DOM operations
let rafQueue: Array<() => void> = [];
let rafId: number | null = null;

/**
 * Batch DOM operations to avoid forced reflows
 */
export const batchDOMOperations = (operation: () => void) => {
  rafQueue.push(operation);
  
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      const operations = [...rafQueue];
      rafQueue = [];
      rafId = null;
      
      // Execute all batched operations
      operations.forEach(op => op());
    });
  }
};

/**
 * Get cached computed style to avoid forced reflows
 */
export const getCachedComputedStyle = (element: Element): CSSStyleDeclaration | null => {
  const cacheKey = element.tagName + element.className + element.id;
  const cached = styleCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < STYLE_CACHE_DURATION) {
    return cached.value;
  }
  
  // Batch the style computation
  batchDOMOperations(() => {
    const style = window.getComputedStyle(element);
    styleCache.set(cacheKey, { value: style, timestamp: now });
  });
  
  return cached?.value || null;
};

/**
 * Get cached element dimensions to avoid forced reflows
 */
export const getCachedElementRect = (element: Element): DOMRect | null => {
  const cached = dimensionCache.get(element);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < DIMENSION_CACHE_DURATION) {
    return cached.rect;
  }
  
  // Batch the dimension computation
  batchDOMOperations(() => {
    const rect = element.getBoundingClientRect();
    dimensionCache.set(element, { rect, timestamp: now });
  });
  
  return cached?.rect || null;
};

/**
 * Throttle function to limit execution frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Debounce function to delay execution until after calls have stopped
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * RAF-based throttle for scroll handlers
 */
export const throttleRAF = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};

/**
 * Optimize scroll handler to prevent forced reflows
 */
export const createOptimizedScrollHandler = (
  callback: (scrollY: number, scrollDirection: 'up' | 'down' | 'none') => void,
  threshold: number = 10
) => {
  let lastScrollY = 0;
  let lastDirection: 'up' | 'down' | 'none' = 'none';
  
  return throttleRAF(() => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    
    let direction: 'up' | 'down' | 'none' = 'none';
    if (Math.abs(deltaY) > threshold) {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    
    if (direction !== lastDirection || Math.abs(deltaY) > threshold) {
      callback(currentScrollY, direction);
      lastDirection = direction;
    }
    
    lastScrollY = currentScrollY;
  });
};

/**
 * Optimize resize handler to prevent forced reflows
 */
export const createOptimizedResizeHandler = (
  callback: (width: number, height: number) => void,
  threshold: number = 50
) => {
  let lastWidth = 0;
  let lastHeight = 0;
  
  return debounce(() => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    if (
      Math.abs(currentWidth - lastWidth) > threshold ||
      Math.abs(currentHeight - lastHeight) > threshold
    ) {
      callback(currentWidth, currentHeight);
      lastWidth = currentWidth;
      lastHeight = currentHeight;
    }
  }, 150);
};

/**
 * Intersection Observer with performance optimizations
 */
export const createOptimizedIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    ...options
  };
  
  return new IntersectionObserver(
    throttleRAF((entries: IntersectionObserverEntry[]) => {
      callback(entries);
    }),
    defaultOptions
  );
};

/**
 * Optimize element visibility detection
 */
export const isElementInViewport = (element: Element, threshold: number = 0): boolean => {
  const rect = getCachedElementRect(element);
  if (!rect) return false;
  
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

/**
 * Batch style changes to avoid layout thrashing
 */
export const batchStyleChanges = (element: Element, styles: Record<string, string>) => {
  batchDOMOperations(() => {
    const htmlElement = element as HTMLElement;
    Object.entries(styles).forEach(([property, value]) => {
      htmlElement.style.setProperty(property, value);
    });
  });
};

/**
 * Optimize class manipulation to avoid forced reflows
 */
export const batchClassChanges = (
  element: Element,
  operations: Array<{ action: 'add' | 'remove' | 'toggle'; className: string }>
) => {
  batchDOMOperations(() => {
    operations.forEach(({ action, className }) => {
      switch (action) {
        case 'add':
          element.classList.add(className);
          break;
        case 'remove':
          element.classList.remove(className);
          break;
        case 'toggle':
          element.classList.toggle(className);
          break;
      }
    });
  });
};

/**
 * Memory management for performance optimization
 */
export const clearPerformanceCaches = () => {
  styleCache.clear();
  dimensionCache.clear();
  
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
    rafQueue = [];
  }
};

/**
 * Performance monitoring utilities
 */
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

/**
 * GPU acceleration utilities
 */
export const enableGPUAcceleration = (element: HTMLElement) => {
  batchStyleChanges(element, {
    'transform': 'translate3d(0,0,0)',
    'will-change': 'transform',
    'backface-visibility': 'hidden',
    'perspective': '1000px'
  });
};

export const disableGPUAcceleration = (element: HTMLElement) => {
  batchStyleChanges(element, {
    'transform': '',
    'will-change': '',
    'backface-visibility': '',
    'perspective': ''
  });
};

/**
 * Optimize animation performance
 */
export const createOptimizedAnimation = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation => {
  // Enable GPU acceleration before animation
  enableGPUAcceleration(element);
  
  const animation = element.animate(keyframes, {
    ...options,
    composite: 'replace',
    iterationComposite: 'replace'
  });
  
  // Clean up GPU acceleration after animation
  animation.addEventListener('finish', () => {
    disableGPUAcceleration(element);
  });
  
  return animation;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = (resources: Array<{ href: string; as: string; type?: string }>) => {
  batchDOMOperations(() => {
    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });
  });
};

/**
 * Optimize font loading
 */
export const optimizeFontLoading = (fontFamilies: string[]) => {
  if ('fonts' in document) {
    fontFamilies.forEach(family => {
      document.fonts.load(`16px ${family}`);
    });
  }
};

// Export performance optimization hooks
export const usePerformanceOptimization = () => {
  return {
    batchDOMOperations,
    getCachedComputedStyle,
    getCachedElementRect,
    throttle,
    debounce,
    throttleRAF,
    createOptimizedScrollHandler,
    createOptimizedResizeHandler,
    createOptimizedIntersectionObserver,
    isElementInViewport,
    batchStyleChanges,
    batchClassChanges,
    clearPerformanceCaches,
    measurePerformance,
    enableGPUAcceleration,
    disableGPUAcceleration,
    createOptimizedAnimation,
    preloadCriticalResources,
    optimizeFontLoading
  };
};

// ============================================================================
// BUNDLE SPLITTING & CODE SPLITTING UTILITIES
// ============================================================================

// Advanced dynamic import with retry mechanism and error boundary
export const createOptimizedDynamicImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    retries?: number;
    retryDelay?: number;
    chunkName?: string;
    preload?: boolean;
    priority?: 'high' | 'low' | 'auto';
  } = {}
) => {
  const { retries = 3, retryDelay = 1000, chunkName, preload = false } = options;

  const dynamicImport = async (attempt = 1): Promise<{ default: T }> => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return dynamicImport(attempt + 1);
      }
      throw new Error(`Failed to load component after ${retries} attempts: ${error}`);
    }
  };

  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        dynamicImport().catch(() => {
          // Silent fail for preloading
        });
      });
    } else {
      setTimeout(() => {
        dynamicImport().catch(() => {
          // Silent fail for preloading
        });
      }, 2000);
    }
  }

  return dynamicImport;
};

// ============================================================================
// MAIN-THREAD WORK SCHEDULING
// ============================================================================

// Task scheduler to break up heavy work into smaller chunks
export class TaskScheduler {
  private queue: Array<() => void> = [];
  private isRunning = false;
  private frameDeadline = 5; // 5ms per frame to maintain 60fps

  public schedule(task: () => void, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    if (priority === 'high') {
      this.queue.unshift(task);
    } else {
      this.queue.push(task);
    }
    
    if (!this.isRunning) {
      this.processQueue();
    }
  }

  private processQueue = (): void => {
    this.isRunning = true;
    
    const processChunk = (deadline: IdleDeadline) => {
      while (deadline.timeRemaining() > this.frameDeadline && this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) {
          try {
            task();
          } catch (error) {
            console.warn('Task execution failed:', error);
          }
        }
      }

      if (this.queue.length > 0) {
        this.scheduleNextChunk();
      } else {
        this.isRunning = false;
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(processChunk, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        processChunk({ timeRemaining: () => 5, didTimeout: false });
      }, 0);
    }
  };

  private scheduleNextChunk(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(this.processQueue, { timeout: 1000 });
    } else {
      setTimeout(this.processQueue, 16); // ~60fps
    }
  }
}

// Global task scheduler instance
export const taskScheduler = new TaskScheduler();

// ============================================================================
// COMPONENT OPTIMIZATION HOOKS
// ============================================================================

// Hook for deferring non-critical renders
export const useDeferredRender = (delay: number = 100) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldRender;
};

// Hook for progressive loading of list items
export const useProgressiveLoading = <T>(
  items: T[],
  batchSize: number = 10,
  delay: number = 50
) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (visibleCount < items.length && !isLoading) {
      setIsLoading(true);
      
      taskScheduler.schedule(() => {
        setVisibleCount(prev => Math.min(prev + batchSize, items.length));
        setIsLoading(false);
      }, 'normal');
    }
  }, [visibleCount, items.length, batchSize, isLoading]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return { visibleItems, hasMore, loadMore, isLoading };
};

// ============================================================================
// SCRIPT OPTIMIZATION
// ============================================================================

// Lazy script loader for third-party libraries
// Fix the fetchPriority type error and useRef initialization
export const loadScript = (
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    module?: boolean;
    priority?: 'high' | 'low';
    onLoad?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = options.async ?? true;
    script.defer = options.defer ?? false;
    
    if (options.module) {
      script.type = 'module';
    }

    // Fix fetchPriority type error by casting to any
    if (options.priority === 'high') {
      (script as any).fetchPriority = 'high';
    } else if (options.priority === 'low') {
      (script as any).fetchPriority = 'low';
    }

    script.onload = () => {
      options.onLoad?.();
      resolve();
    };

    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`);
      options.onError?.(error);
      reject(error);
    };

    document.head.appendChild(script);
  });
};

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

// Memory-efficient cache with LRU eviction
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global component cache
export const componentCache = new LRUCache(50);

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

// Performance metrics collector
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  public measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    // Keep only last 100 measurements
    const measurements = this.metrics.get(name)!;
    if (measurements.length > 100) {
      measurements.shift();
    }

    return result;
  }

  public async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    return result;
  }

  public getStats(name: string) {
    const measurements = this.metrics.get(name) || [];
    if (measurements.length === 0) return null;

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return { avg, min, max, count: measurements.length };
  }

  public getAllStats() {
    const stats: Record<string, any> = {};
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor();

// ============================================================================
// BUNDLE ANALYSIS UTILITIES
// ============================================================================

// Analyze bundle size impact
export const analyzeBundleImpact = () => {
  if (typeof window === 'undefined') return null;

  const navigation = (performance as any).getEntriesByType?.('navigation')?.[0];
  if (!navigation) return null;

  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstPaint: (performance as any).getEntriesByName?.('first-paint')?.[0]?.startTime || 0,
    firstContentfulPaint: (performance as any).getEntriesByName?.('first-contentful-paint')?.[0]?.startTime || 0,
    largestContentfulPaint: (performance as any).getEntriesByType?.('largest-contentful-paint')?.[0]?.startTime || 0,
  };
};

// ============================================================================
// EXPORT OPTIMIZED UTILITIES
// ============================================================================

// React component wrapper for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const renderStart = useRef<number>(0);

    useEffect(() => {
      renderStart.current = performance.now();
    });

    useEffect(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart.current;
      performanceMonitor.measure(`${componentName}-render`, () => renderTime);
    }, []);

    return React.createElement(Component, props);
  });
};

// Optimized intersection observer for lazy loading
// Fix the useRef initialization error
export const useOptimizedIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      setEntries(entries);
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [options]);

  return { entries, observe, unobserve };
}; 