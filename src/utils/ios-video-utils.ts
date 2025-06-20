/**
 * iOS Video Utilities
 * 
 * This utility provides iOS-specific video optimizations and crash prevention
 * for Safari and Chrome on iOS devices.
 */

// Device detection utilities
export const deviceDetection = {
  isIOS: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  isSafari: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },

  isIOSChrome: (): boolean => {
    if (typeof window === 'undefined') return false;
    return /CriOS/.test(navigator.userAgent);
  },

  isLowPowerMode: (): boolean => {
    if (typeof window === 'undefined') return false;
    // Check for reduced motion preference (often enabled in low power mode)
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  getIOSVersion: (): number | null => {
    if (typeof window === 'undefined') return null;
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  },

  getMemoryInfo: (): { deviceMemory?: number; usedJSHeapSize?: number; totalJSHeapSize?: number } => {
    if (typeof window === 'undefined') return {};
    
    const info: any = {};
    
    // Device memory (if available)
    if ('deviceMemory' in navigator) {
      info.deviceMemory = (navigator as any).deviceMemory;
    }
    
    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      info.usedJSHeapSize = memory.usedJSHeapSize;
      info.totalJSHeapSize = memory.totalJSHeapSize;
    }
    
    return info;
  }
};

// Video configuration for iOS devices
export const iosVideoConfig = {
  // Optimal video settings for different iOS device types
  getOptimalVideoSettings: (isIOSDevice: boolean, memoryInfo?: any) => {
    if (!isIOSDevice) {
      return {
        preload: 'auto',
        autoplay: true,
        quality: 'high',
        enableBackgroundVideo: true
      };
    }

    const iosVersion = deviceDetection.getIOSVersion();
    const isLowMemory = memoryInfo?.deviceMemory && memoryInfo.deviceMemory < 3;
    const isOldDevice = iosVersion && iosVersion < 14;

    return {
      preload: isLowMemory || isOldDevice ? 'metadata' : 'auto',
      autoplay: false, // Will be handled programmatically
      quality: isLowMemory || isOldDevice ? 'low' : 'medium',
      maxConcurrentVideos: 1,
      enableBackgroundVideo: !deviceDetection.isLowPowerMode() && !isLowMemory,
      requiresUserInteraction: true,
      playsinline: true,
      muted: true
    };
  },

  // Video source optimization for iOS
  getIOSOptimizedVideoSrc: (baseSrc: string, isDark: boolean, isMobile: boolean): string => {
    // Use optimized videos for iOS - same quality but better compression
    if (isDark) {
      return "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4";
    }
    return "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4";
  },

  // Helper to start video with proper iOS handling
  startBackgroundVideo: async (videoElement: HTMLVideoElement): Promise<boolean> => {
    if (!videoElement) return false;

    try {
      // Ensure video is properly configured for iOS
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.controls = false;
      
      // Set iOS-specific attributes
      videoElement.setAttribute('webkit-playsinline', 'true');
      videoElement.setAttribute('playsinline', 'true');
      
      // Attempt to play
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('iOS video autoplay failed:', error);
      return false;
    }
  }
};

// Memory management utilities
export const memoryManager = {
  // Monitor memory usage and trigger cleanup if needed
  monitorMemoryUsage: (callback: (shouldCleanup: boolean) => void) => {
    if (typeof window === 'undefined') return () => {};

    const checkMemory = () => {
      const memInfo = deviceDetection.getMemoryInfo();
      
      if (memInfo.usedJSHeapSize && memInfo.totalJSHeapSize) {
        const usagePercent = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100;
        
        // Trigger cleanup if memory usage exceeds 80%
        if (usagePercent > 80) {
          callback(true);
        }
      }
    };

    const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  },

  // Cleanup video resources
  cleanupVideoResources: (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Pause and remove source
      video.pause();
      video.removeAttribute('src');
      video.load(); // Reset the video element
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
    }
  },

  // Preload cleanup
  cleanupPreloadedResources: () => {
    if (typeof document === 'undefined') return;
    
    // Remove preloaded video elements
    const preloadedVideos = document.querySelectorAll('video[preload]');
    preloadedVideos.forEach(video => {
      if (video instanceof HTMLVideoElement) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    });
  }
};

// Performance optimization utilities
export const performanceOptimizer = {
  // Reduce CSS animations and transitions on iOS
  optimizeForIOS: () => {
    if (typeof document === 'undefined') return;
    
    const isIOSDevice = deviceDetection.isIOS();
    const isLowPower = deviceDetection.isLowPowerMode();
    
    if (isIOSDevice || isLowPower) {
      // Add class to reduce animations
      document.documentElement.classList.add('reduce-motion');
      
      // Inject CSS to optimize performance
      const style = document.createElement('style');
      style.textContent = `
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .reduce-motion video {
          will-change: auto !important;
          transform: none !important;
          filter: none !important;
        }
        
        .reduce-motion .glass-container,
        .reduce-motion .glass-card,
        .reduce-motion .glass-light,
        .reduce-motion .glass-dark {
          backdrop-filter: none !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        .reduce-motion.dark .glass-container,
        .reduce-motion.dark .glass-card,
        .reduce-motion.dark .glass-light,
        .reduce-motion.dark .glass-dark {
          background: rgba(0, 0, 0, 0.95) !important;
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Throttle resize events for better performance
  createThrottledResizeHandler: (handler: () => void, delay: number = 150) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return (event?: Event) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        handler();
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handler();
          lastExecTime = Date.now();
        }, delay);
      }
    };
  }
};

// Error handling and recovery
export const errorRecovery = {
  // Handle video errors gracefully
  handleVideoError: (error: Event, videoRef: React.RefObject<HTMLVideoElement | null>, fallbackCallback: () => void) => {
    console.warn('Video error detected:', error);
    
    // Clean up the problematic video
    memoryManager.cleanupVideoResources(videoRef);
    
    // Trigger fallback
    fallbackCallback();
    
    // Track error for analytics (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'video_error', {
        event_category: 'performance',
        event_label: 'ios_video_error',
        value: 1
      });
    }
  },

  // Handle video errors with fallback strategy  
  handleVideoErrorWithFallback: (error: Event, videoRef: React.RefObject<HTMLVideoElement | null>, fallbackCallback: () => void) => {
    console.warn('Video error detected, applying fallback strategy:', error);
    
    // Clean up the problematic video
    memoryManager.cleanupVideoResources(videoRef);
    
    // Trigger fallback
    fallbackCallback();
    
    // Track error for analytics (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'video_error', {
        event_category: 'performance',
        event_label: 'ios_video_error_fallback',
        value: 1
      });
    }
  }
};

// Main utility function to initialize iOS optimizations
export const initializeIOSOptimizations = () => {
  if (typeof window === 'undefined') return;

  const isIOSDevice = deviceDetection.isIOS();
  
  if (isIOSDevice) {
    // Apply performance optimizations
    performanceOptimizer.optimizeForIOS();
    
    // Start memory monitoring
    const cleanup = memoryManager.monitorMemoryUsage((shouldCleanup) => {
      if (shouldCleanup) {
        console.warn('High memory usage detected, cleaning up resources');
        memoryManager.cleanupPreloadedResources();
      }
    });
    
    // Cleanup on page unload
    const handleUnload = () => {
      cleanup();
      memoryManager.cleanupPreloadedResources();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    
    // Return cleanup function
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }
  
  return () => {}; // No-op for non-iOS devices
};

export default {
  deviceDetection,
  iosVideoConfig,
  memoryManager,
  performanceOptimizer,
  errorRecovery,
  initializeIOSOptimizations
}; 