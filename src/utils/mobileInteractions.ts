/**
 * Mobile Interaction Utilities
 * Handles mobile-specific interactions, animations, and keyboard optimizations
 */

export interface MobileInteractionConfig {
  hapticFeedback?: boolean;
  preventScroll?: boolean;
  focusManagement?: boolean;
  touchOptimization?: boolean;
}

export class MobileInteractionManager {
  private static readonly HAPTIC_PATTERNS = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [20, 100, 20, 100, 20],
    notification: [10, 20, 10]
  };

  /**
   * Provide haptic feedback on supported devices
   */
  static hapticFeedback(pattern: keyof typeof MobileInteractionManager.HAPTIC_PATTERNS = 'light'): void {
    try {
      // Check for Vibration API support
      if ('vibrate' in navigator) {
        const vibrationPattern = this.HAPTIC_PATTERNS[pattern];
        navigator.vibrate(vibrationPattern);
      }
      
      // Check for iOS Haptic Feedback (if available through web APIs)
      if ('ontouchstart' in window && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // iOS devices - attempt to use any available haptic APIs
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      // Silently fail if haptic feedback is not available
      console.debug('Haptic feedback not available:', error);
    }
  }

  /**
   * Optimize input focus for mobile keyboards
   */
  static optimizeMobileInput(element: HTMLInputElement | HTMLTextAreaElement, options: {
    scrollIntoView?: boolean;
    preventZoom?: boolean;
    keyboardType?: 'default' | 'email' | 'numeric' | 'tel' | 'url' | 'search';
  } = {}): void {
    try {
      const { scrollIntoView = true, preventZoom = true, keyboardType = 'default' } = options;

      // Set appropriate input mode and keyboard type
      const inputModeMap = {
        default: 'text',
        email: 'email',
        numeric: 'numeric',
        tel: 'tel',
        url: 'url',
        search: 'search'
      };

      element.setAttribute('inputmode', inputModeMap[keyboardType]);
      
      // Prevent zoom on iOS
      if (preventZoom && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        element.style.fontSize = '16px'; // Prevents zoom on iOS
      }

      // Smooth scroll into view
      if (scrollIntoView) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }

      // Add touch-friendly styling
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'text';
      
      // Focus with slight delay for better UX
      setTimeout(() => {
        element.focus();
      }, 150);
    } catch (error) {
      console.error('Mobile input optimization failed:', error);
    }
  }

  /**
   * Handle mobile-friendly button interactions
   */
  static optimizeMobileButton(element: HTMLButtonElement, options: {
    hapticFeedback?: boolean;
    preventDoubleClick?: boolean;
    loadingState?: boolean;
  } = {}): void {
    try {
      const { hapticFeedback = true, preventDoubleClick = true, loadingState = false } = options;

      // Add touch-friendly properties
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'none';
      element.style.webkitTapHighlightColor = 'transparent';

      // Prevent double-click if requested
      if (preventDoubleClick) {
        let isProcessing = false;
        const originalOnClick = element.onclick;
        
        element.onclick = (event) => {
          if (isProcessing || loadingState) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
          
          isProcessing = true;
          
          if (hapticFeedback) {
            this.hapticFeedback('light');
          }
          
          // Reset processing state after a delay
          setTimeout(() => {
            isProcessing = false;
          }, 1000);
          
          if (originalOnClick) {
            return originalOnClick.call(element, event);
          }
        };
      }

      // Add visual feedback for touch
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.1s ease';
      }, { passive: true });

      element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
      }, { passive: true });

      element.addEventListener('touchcancel', () => {
        element.style.transform = 'scale(1)';
      }, { passive: true });
    } catch (error) {
      console.error('Mobile button optimization failed:', error);
    }
  }

  /**
   * Prevent body scroll when modal/overlay is open
   */
  static preventBodyScroll(prevent: boolean = true): void {
    try {
      if (prevent) {
        // Store current scroll position
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // Store scroll position for restoration
        document.body.setAttribute('data-scroll-y', scrollY.toString());
      } else {
        // Restore scroll position
        const scrollY = document.body.getAttribute('data-scroll-y');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY, 10));
          document.body.removeAttribute('data-scroll-y');
        }
      }
    } catch (error) {
      console.error('Body scroll prevention failed:', error);
    }
  }

  /**
   * Detect if device supports touch
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Detect if device is mobile
   */
  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Detect if device is iOS
   */
  static isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /**
   * Get safe area insets for devices with notches
   */
  static getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0', 10)
      };
    } catch {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
  }

  /**
   * Optimize animations for mobile performance
   */
  static optimizeAnimation(element: HTMLElement, animation: {
    duration?: number;
    easing?: string;
    willChange?: string[];
  } = {}): void {
    try {
      const { duration = 300, easing = 'ease-out', willChange = ['transform', 'opacity'] } = animation;

      // Set will-change for better performance
      element.style.willChange = willChange.join(', ');
      
      // Use transform3d to enable hardware acceleration
      element.style.transform = element.style.transform || 'translate3d(0, 0, 0)';
      
      // Set transition properties
      element.style.transitionDuration = `${duration}ms`;
      element.style.transitionTimingFunction = easing;
      
      // Clean up will-change after animation
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, duration + 100);
    } catch (error) {
      console.error('Animation optimization failed:', error);
    }
  }

  /**
   * Handle keyboard appearance on mobile
   */
  static handleMobileKeyboard(options: {
    onShow?: () => void;
    onHide?: () => void;
    adjustViewport?: boolean;
  } = {}): () => void {
    const { onShow, onHide, adjustViewport = true } = options;
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      try {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        if (heightDifference > 150) { // Keyboard is likely open
          if (adjustViewport) {
            document.documentElement.style.setProperty('--keyboard-height', `${heightDifference}px`);
          }
          onShow?.();
        } else { // Keyboard is likely closed
          if (adjustViewport) {
            document.documentElement.style.removeProperty('--keyboard-height');
          }
          onHide?.();
        }
      } catch (error) {
        console.error('Keyboard handling failed:', error);
      }
    };

    // Listen for viewport changes
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);

    // Return cleanup function
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      document.documentElement.style.removeProperty('--keyboard-height');
    };
  }

  /**
   * Create mobile-optimized loading state
   */
  static createMobileLoader(container: HTMLElement, options: {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    backdrop?: boolean;
  } = {}): HTMLElement {
    const { size = 'md', color = '#3B82F6', backdrop = true } = options;
    
    const sizeMap = {
      sm: '24px',
      md: '32px',
      lg: '48px'
    };

    const loader = document.createElement('div');
    loader.className = 'mobile-loader';
    loader.style.cssText = `
      position: ${backdrop ? 'fixed' : 'absolute'};
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${backdrop ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
      z-index: 9999;
      backdrop-filter: ${backdrop ? 'blur(4px)' : 'none'};
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: ${sizeMap[size]};
      height: ${sizeMap[size]};
      border: 3px solid rgba(59, 130, 246, 0.3);
      border-top: 3px solid ${color};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;

    // Add keyframes if not already present
    if (!document.querySelector('#mobile-loader-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-loader-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    loader.appendChild(spinner);
    container.appendChild(loader);

    return loader;
  }

  /**
   * Remove mobile loader
   */
  static removeMobileLoader(loader: HTMLElement): void {
    try {
      if (loader && loader.parentNode) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
    } catch (error) {
      console.error('Failed to remove mobile loader:', error);
    }
  }
}

/**
 * React hook for mobile interactions
 */
export const useMobileInteractions = (config: MobileInteractionConfig = {}) => {
  const {
    hapticFeedback = true,
    preventScroll = false,
    focusManagement = true,
    touchOptimization = true
  } = config;

  React.useEffect(() => {
    if (preventScroll) {
      MobileInteractionManager.preventBodyScroll(true);
      return () => MobileInteractionManager.preventBodyScroll(false);
    }
  }, [preventScroll]);

  const optimizeInput = React.useCallback((element: HTMLInputElement | HTMLTextAreaElement, options?: Parameters<typeof MobileInteractionManager.optimizeMobileInput>[1]) => {
    if (focusManagement) {
      MobileInteractionManager.optimizeMobileInput(element, options);
    }
  }, [focusManagement]);

  const optimizeButton = React.useCallback((element: HTMLButtonElement, options?: Parameters<typeof MobileInteractionManager.optimizeMobileButton>[1]) => {
    if (touchOptimization) {
      MobileInteractionManager.optimizeMobileButton(element, {
        hapticFeedback,
        ...options
      });
    }
  }, [touchOptimization, hapticFeedback]);

  const triggerHaptic = React.useCallback((pattern?: Parameters<typeof MobileInteractionManager.hapticFeedback>[0]) => {
    if (hapticFeedback) {
      MobileInteractionManager.hapticFeedback(pattern);
    }
  }, [hapticFeedback]);

  return {
    isTouchDevice: MobileInteractionManager.isTouchDevice(),
    isMobileDevice: MobileInteractionManager.isMobileDevice(),
    isIOSDevice: MobileInteractionManager.isIOSDevice(),
    safeAreaInsets: MobileInteractionManager.getSafeAreaInsets(),
    optimizeInput,
    optimizeButton,
    triggerHaptic,
    handleKeyboard: MobileInteractionManager.handleMobileKeyboard,
    optimizeAnimation: MobileInteractionManager.optimizeAnimation
  };
};

// Add React import
import React from 'react'; 