/**
 * Performance Optimization Utilities
 * Provides tools to prevent forced reflows and optimize DOM operations
 */

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