import React, { useState, useEffect } from 'react';

// Performance-optimized dynamic import function
export function createDynamicComponent<T = {}>(
  importFunction: () => Promise<{ default: React.ComponentType<T> }>,
  options: {
    ssr?: boolean;
    suspense?: boolean;
  } = {}
) {
  const { ssr = false, suspense = true } = options;

  if (typeof window === 'undefined') {
    // Server-side: return null or basic component
    return null;
  }

  // Use React.lazy for dynamic imports
  return React.lazy(importFunction);
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, hasLoaded, options]);

  return { isVisible, hasLoaded };
};

// Motion preference detection
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Optimized animation variants that respect motion preferences
export const createOptimizedVariants = (prefersReducedMotion: boolean) => ({
  initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
  animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
  exit: prefersReducedMotion ? {} : { opacity: 0, y: -20 },
  transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
});

// Bundle size analyzer
export const bundleAnalyzer = {
  logLargeComponents: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analyzer: Check for large components');
    }
  },
  
  measureRenderTime: (componentName: string, renderFn: () => void) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      renderFn();
      const end = performance.now();
      if (end - start > 16) { // More than one frame (16ms)
        console.warn(`Slow render: ${componentName} took ${end - start}ms`);
      }
    } else {
      renderFn();
    }
  }
};

// Image optimization helper
export const optimizeImage = (src: string, width?: number, height?: number) => {
  if (!src) return '';
  
  // If it's already a Next.js optimized image or external URL, return as-is
  if (src.startsWith('/_next/') || src.startsWith('http')) {
    return src;
  }
  
  // Add optimization parameters for internal images
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', '75'); // Quality setting
  
  return `${src}?${params.toString()}`;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/Bulgatti.woff';
  fontLink.as = 'font';
  fontLink.type = 'font/woff';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical images
  const heroImage = new Image();
  heroImage.src = '/images/medhlogo.svg';
};

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  },
  
  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      if (measure && measure.duration > 100) {
        console.warn(`Performance: ${name} took ${measure.duration}ms`);
      }
    }
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  checkMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      const memory = (window.performance as any).memory;
      const used = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
      const total = Math.round(memory.totalJSHeapSize / 1048576);
      
      if (used > 100) { // Alert if using more than 100MB
        console.warn(`Memory usage: ${used}MB / ${total}MB`);
      }
      
      return { used, total };
    }
    return null;
  }
}; 