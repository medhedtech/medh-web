import { useCallback } from 'react';

/**
 * Custom hook that provides smooth scrolling for anchor links
 * Respects user's motion preferences
 */
export function useSmoothAnchorScroll() {
  return useCallback((event: MouseEvent) => {
    // Only process anchor links
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (!anchor) return;
    
    // Check if it's an internal anchor link
    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    
    // Get the target element
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    // Prevent default behavior
    event.preventDefault();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Calculate header offset (if you have a fixed header)
    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0', 10);
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;
    
    // Perform the scroll
    window.scrollTo({
      top: offsetPosition,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    
    // Update URL hash without scrolling
    history.pushState(null, '', href);
    
    // Focus the target for accessibility
    targetElement.focus({ preventScroll: true });
    
    // Set tabindex if not interactive
    if (!targetElement.getAttribute('tabindex')) {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.addEventListener('blur', () => {
        targetElement.removeAttribute('tabindex');
      }, { once: true });
    }
  }, []);
} 