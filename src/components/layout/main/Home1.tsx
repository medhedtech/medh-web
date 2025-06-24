"use client";

import Hero2 from "@/components/sections/hero-banners/Hero2";
import React, { 
  useEffect, 
  useRef, 
  useState, 
  useCallback, 
  createContext, 
  useMemo,
  useTransition,
  useDeferredValue,
  startTransition,
  Suspense
} from "react";
import { useTheme } from "next-themes";
import "@/styles/glassmorphism.css";

// Enhanced lazy loading with preloading hints and error boundaries - React 2025 optimization
const HomeCourseSection = React.lazy(() => 
  import("@/components/sections/courses/HomeCourseSection2").catch(error => {
    console.warn('Failed to load HomeCourseSection:', error);
    return { default: React.memo(() => <div className="h-96 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

const JobGuaranteedSection = React.lazy(() => 
  import("@/components/sections/job-guaranteed/JobGuaranteedSection").catch(error => {
    console.warn('Failed to load JobGuaranteedSection:', error);
    return { default: React.memo(() => <div className="h-96 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

const WhyMedh = React.lazy(() => 
  import("@/components/sections/why-medh/WhyMedh2").catch(error => {
    console.warn('Failed to load WhyMedh:', error);
    return { default: React.memo(() => <div className="h-72 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

const JoinMedh = React.lazy(() => 
  import("@/components/sections/hire/JoinMedh2").catch(error => {
    console.warn('Failed to load JoinMedh:', error);
    return { default: React.memo(() => <div className="h-72 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

const Hire = React.lazy(() => 
  import("@/components/sections/hire/Hire2").catch(error => {
    console.warn('Failed to load Hire:', error);
    return { default: React.memo(() => <div className="h-72 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

const Blogs = React.lazy(() => 
  import("@/components/sections/blogs/Blogs").catch(error => {
    console.warn('Failed to load Blogs:', error);
    return { default: React.memo(() => <div className="h-72 flex items-center justify-center text-gray-500">Content temporarily unavailable</div>) };
  })
);

// Intelligent component preloading with priority and device detection
if (typeof window !== 'undefined') {
  const preloadComponents = () => {
    // Check device capabilities before preloading
    const isLowEndDevice = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
    const isSlowConnection = 'connection' in navigator && 
      ['slow-2g', '2g'].includes((navigator as any).connection?.effectiveType);
    
    if (isLowEndDevice || isSlowConnection) {
      // Preload only critical components on low-end devices
      import("@/components/sections/courses/HomeCourseSection2");
      return;
    }
    
    // Progressive preloading with requestIdleCallback for better performance
    const preloadTasks = [
      () => import("@/components/sections/courses/HomeCourseSection2"),
      () => import("@/components/sections/job-guaranteed/JobGuaranteedSection"),
      () => import("@/components/sections/why-medh/WhyMedh2"),
      () => import("@/components/sections/hire/JoinMedh2"),
      () => import("@/components/sections/hire/Hire2"),
      () => import("@/components/sections/blogs/Blogs")
    ];
    
    const runPreloadTasks = (tasks: (() => Promise<any>)[], index = 0) => {
      if (index >= tasks.length) return;
      
      const runNext = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => runPreloadTasks(tasks, index + 1), { timeout: 2000 });
        } else {
          setTimeout(() => runPreloadTasks(tasks, index + 1), 100);
        }
      };
      
      tasks[index]().then(runNext).catch(runNext);
    };
    
    runPreloadTasks(preloadTasks);
  };
  
  // Delayed preloading after initial render with intersection observer optimization
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadComponents, { timeout: 5000 });
  } else {
    setTimeout(preloadComponents, 200);
  }
}

// LCP-OPTIMIZED video configuration with aggressive compression and local fallbacks
const VIDEO_CONFIG = {
  dark: {
    mobile: {
      primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4", // Use compressed as primary
      fallback: "/video/1659171_Trapcode_Particles_3840x2160.mp4", // Local fallback for instant loading
      localFallback: "/video/1659171_Trapcode_Particles_3840x2160.mp4"
    },
    desktop: {
      primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4", // Use compressed as primary
      fallback: "/video/1659171_Trapcode_Particles_3840x2160.mp4", // Local fallback
      localFallback: "/video/1659171_Trapcode_Particles_3840x2160.mp4"
    },
          poster: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZGFya0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWUyOTNiO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGYxNzJhO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAyMDYxNztzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSJ1cmwoI2RhcmtHcmFkaWVudCkiLz48L3N2Zz4=" // Instant loading dark gradient
  },
  light: {
    mobile: {
      primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4", // Use compressed as primary
      fallback: "/video/0_Flutter_Wind_3840x2160.mp4", // Local fallback
      localFallback: "/video/0_Flutter_Wind_3840x2160.mp4"
    },
    desktop: {
      primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4", // Use compressed as primary
      fallback: "/video/0_Flutter_Wind_3840x2160.mp4", // Local fallback
      localFallback: "/video/0_Flutter_Wind_3840x2160.mp4"
    },
          poster: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ibGlnaHRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZmFmYztzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2UyZThmMDtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjYmQ1ZTE7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNsaWdodEdyYWRpZW50KSIvPjwvc3ZnPg==" // Instant loading light gradient
  }
} as const;

// LCP-OPTIMIZED video source selector with aggressive timeout and local fallback
const getOptimizedVideoSrc = (
  isDark: boolean, 
  isMobile: boolean, 
  useCompressed = false, 
  forceLocal = false
): string => {
  const config = isDark ? VIDEO_CONFIG.dark : VIDEO_CONFIG.light;
  const deviceConfig = isMobile ? config.mobile : config.desktop;
  
  // Force local fallback for instant loading if network is slow
  if (forceLocal) {
    return deviceConfig.localFallback;
  }
  
  return useCompressed ? deviceConfig.fallback : deviceConfig.primary;
};

const getVideoPoster = (isDark: boolean): string => {
  return isDark ? VIDEO_CONFIG.dark.poster : VIDEO_CONFIG.light.poster;
};

// Enhanced context interface with performance tracking and error recovery
export interface VideoBackgroundContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoaded: boolean;
  isDark: boolean;
  isMobile: boolean;
  isPlaying: boolean;
  hasError: boolean;
  retryVideo: () => void;
  videoLoadTime?: number;
  compressionLevel: 'high' | 'medium' | 'low';
}

// Stable context value factory with performance monitoring
const createStableContextValue = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isLoaded: boolean,
  isDark: boolean,
  isMobile: boolean,
  isPlaying: boolean,
  hasError: boolean,
  retryVideo: () => void,
  videoLoadTime?: number,
  compressionLevel: 'high' | 'medium' | 'low' = 'medium'
): VideoBackgroundContextType => ({
  videoRef,
  isLoaded,
  isDark,
  isMobile,
  isPlaying,
  hasError,
  retryVideo,
  videoLoadTime,
  compressionLevel
});

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true,
  isMobile: false,
  isPlaying: false,
  hasError: false,
  retryVideo: () => {},
  compressionLevel: 'medium'
});

// Performance-optimized debounce with cleanup and memory management
let resizeTimeoutId: NodeJS.Timeout | null = null;
const optimizedDebounce = (callback: () => void, delay: number = 150) => {
  if (resizeTimeoutId) {
    clearTimeout(resizeTimeoutId);
  }
  resizeTimeoutId = setTimeout(() => {
    callback();
    // Clear reference after execution for memory optimization
    resizeTimeoutId = null;
  }, delay);
};

// Enhanced loading component with skeleton animation and accessibility
const LoadingFallback = React.memo(({ 
  height = "96", 
  showSkeleton = true,
  ariaLabel = "Loading content..."
}: { 
  height?: string; 
  showSkeleton?: boolean;
  ariaLabel?: string;
}) => (
  <div 
    className={`h-${height} flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg animate-pulse`}
    role="status"
    aria-label={ariaLabel}
  >
    {showSkeleton ? (
      <div className="flex flex-col items-center space-y-4 w-full max-w-md px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
        <div className="w-full space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    ) : (
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )}
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Enhanced error boundary with retry mechanism and error reporting
class SectionErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  { hasError: boolean; retryCount: number }
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Section failed to load:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Auto-retry mechanism with exponential backoff
    if (this.state.retryCount < 2) {
      const retryDelay = Math.pow(2, this.state.retryCount) * 1000;
      this.retryTimeoutId = setTimeout(() => {
        this.setState(prevState => ({ 
          hasError: false, 
          retryCount: prevState.retryCount + 1 
        }));
      }, retryDelay);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="h-72 flex flex-col items-center justify-center text-gray-500 space-y-2">
          <p>Section temporarily unavailable</p>
          {this.state.retryCount < 2 && (
            <div className="text-sm text-gray-400">Retrying...</div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const Home1: React.FC = () => {
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);
  const retryCountRef = useRef(0);
  const videoLoadStartTime = useRef<number>(0);
  
  // Enhanced state management with React 18+ concurrent features
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [useCompressedVideo, setUseCompressedVideo] = useState(false);
  const [videoLoadTime, setVideoLoadTime] = useState<number>();
  const [compressionLevel, setCompressionLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [useLocalVideo, setUseLocalVideo] = useState(false);
  const [videoLoadTimeout, setVideoLoadTimeout] = useState(false);
  const [allowVideoLoad, setAllowVideoLoad] = useState(false);
  
  // Deferred values for non-critical updates - React 18+ optimization
  const deferredIsLoaded = useDeferredValue(isLoaded);
  const deferredIsMobile = useDeferredValue(isMobile);
  const deferredIsPlaying = useDeferredValue(isPlaying);
  
  // Memoized derived values with performance tracking and aggressive local fallback
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  const videoSrc = useMemo(() => 
    getOptimizedVideoSrc(isDark, deferredIsMobile, useCompressedVideo, useLocalVideo || videoLoadTimeout), 
    [isDark, deferredIsMobile, useCompressedVideo, useLocalVideo, videoLoadTimeout]
  );
  const videoPoster = useMemo(() => getVideoPoster(isDark), [isDark]);

  // Device capability detection with performance optimization
  const deviceCapabilities = useMemo(() => {
    if (typeof window === 'undefined') return { isLowEnd: false, hasSlowConnection: false };
    
    const isLowEndDevice = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
    const hasSlowConnection = 'connection' in navigator && 
      ['slow-2g', '2g'].includes((navigator as any).connection?.effectiveType);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return { 
      isLowEnd: isLowEndDevice, 
      hasSlowConnection, 
      prefersReducedMotion 
    };
  }, [mounted]);

  // Enhanced video retry mechanism with exponential backoff and compression fallback
  const retryVideo = useCallback(() => {
    if (retryCountRef.current >= 3) return;
    
    retryCountRef.current += 1;
    setHasVideoError(false);
    
    // Try compressed version on retry
    if (retryCountRef.current > 1 && !useCompressedVideo) {
      setUseCompressedVideo(true);
      setCompressionLevel('high');
    }
    
    setShouldShowVideo(true);
    
    if (videoRef.current) {
      videoLoadStartTime.current = performance.now();
      videoRef.current.load();
    }
  }, [useCompressedVideo]);

  // Optimized video error handler with intelligent fallback
  const handleVideoError = useCallback((error: React.SyntheticEvent<HTMLVideoElement>) => {
    const loadTime = performance.now() - videoLoadStartTime.current;
    console.warn('Video background failed to load:', error, `Load time: ${loadTime}ms`);
    
    setHasVideoError(true);
    
    // Auto-retry with progressive compression
    if (retryCountRef.current < 2) {
      const retryDelay = Math.pow(2, retryCountRef.current) * 1000;
      setTimeout(() => {
        // Use compressed version for retry
        if (!useCompressedVideo) {
          setUseCompressedVideo(true);
          setCompressionLevel('high');
        }
        retryVideo();
      }, retryDelay);
    } else {
      setShouldShowVideo(false);
      setCompressionLevel('low');
    }
  }, [retryVideo, useCompressedVideo]);

  // Enhanced video load handler with performance monitoring
  const handleVideoLoad = useCallback(() => {
    const loadTime = performance.now() - videoLoadStartTime.current;
    setVideoLoadTime(loadTime);
    setHasVideoError(false);
    retryCountRef.current = 0;
    
    if (videoRef.current) {
      // Enable hardware acceleration and GPU optimizations
      const video = videoRef.current;
      video.style.transform = 'translate3d(0,0,0)';
      video.style.willChange = 'transform, opacity';
      video.style.backfaceVisibility = 'hidden';
      
      // Performance-optimized autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Remove will-change after animation settles for better performance
            setTimeout(() => {
              if (video) video.style.willChange = 'auto';
            }, 1000);
          })
          .catch((error) => {
            console.warn('Video autoplay failed:', error);
            // Don't treat autoplay failure as an error
          });
      }
    }
    
    // Performance logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Video loaded in ${loadTime}ms`, {
        compressed: useCompressedVideo,
        mobile: deferredIsMobile,
        dark: isDark
      });
    }
  }, [useCompressedVideo, deferredIsMobile, isDark]);

  // Video play/pause handlers with state synchronization
  const handleVideoPlay = useCallback(() => {
    startTransition(() => {
      setIsPlaying(true);
    });
  }, []);

  const handleVideoPause = useCallback(() => {
    startTransition(() => {
      setIsPlaying(false);
    });
  }, []);

  // Optimized resize handler with device detection and performance throttling
  const handleResize = useCallback(() => {
    optimizedDebounce(() => {
      if (!mountedRef.current || typeof window === 'undefined') return;
      
      const newIsMobile = window.innerWidth < 768;
      const hasConnectionInfo = 'connection' in navigator;
      const isSlowConnection = hasConnectionInfo && 
        ['slow-2g', '2g'].includes((navigator as any).connection?.effectiveType);
      
      // Update mobile state with transition for smooth updates
      if (newIsMobile !== isMobile) {
        startTransition(() => {
          setIsMobile(newIsMobile);
        });
      }
      
      // Adaptive video quality based on connection
      if (isSlowConnection && !useCompressedVideo) {
        startTransition(() => {
          setUseCompressedVideo(true);
          setCompressionLevel('high');
        });
      } else if (!isSlowConnection && useCompressedVideo && retryCountRef.current === 0) {
        startTransition(() => {
          setUseCompressedVideo(false);
          setCompressionLevel('medium');
        });
      }
      
      // Disable video on very slow connections or low-end devices
      if ((isSlowConnection || deviceCapabilities.isLowEnd) && shouldShowVideo) {
        setShouldShowVideo(false);
      }
    });
  }, [isMobile, useCompressedVideo, shouldShowVideo, deviceCapabilities.isLowEnd]);

  // Enhanced initialization effect with performance optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    mountedRef.current = true;
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    // Advanced device capability detection
    const { isLowEnd, hasSlowConnection, prefersReducedMotion } = deviceCapabilities;
    
    // Adaptive video settings based on device capabilities with aggressive local fallback
    if (isLowEnd || prefersReducedMotion) {
      setShouldShowVideo(false);
      setCompressionLevel('low');
    } else if (hasSlowConnection) {
      // For slow connections, immediately use local video to prevent 15s+ load times
      setUseLocalVideo(true);
      setUseCompressedVideo(true);
      setCompressionLevel('high');
      console.log('Slow connection detected - using local video for optimal LCP');
    }
    
    // Performance-optimized load timing with requestAnimationFrame
    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (mountedRef.current) {
            startTransition(() => {
              setIsLoaded(true);
            });
          }
        }, { timeout: 100 });
      } else {
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (mountedRef.current) {
              startTransition(() => {
                setIsLoaded(true);
              });
            }
          }, 50);
        });
      }
    };
    
    scheduleLoad();
    
    // AGGRESSIVE LCP OPTIMIZATION: Delay video loading by 5 seconds to prioritize hero content
    const videoDelayTimer = setTimeout(() => {
      if (mountedRef.current) {
        setAllowVideoLoad(true);
        console.log('Hero content prioritized - now allowing video background');
      }
    }, 5000); // 5 second delay for maximum LCP optimization
    
    // Optimized resize listener with passive events
    const resizeHandler = () => handleResize();
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Intelligent resource preloading based on device capabilities
    if (!prefersReducedMotion && !isLowEnd) {
      const preloadVideo = () => {
        const linkPreload = document.createElement('link');
        linkPreload.rel = 'preload';
        linkPreload.as = 'video';
        linkPreload.href = getOptimizedVideoSrc(
          theme === 'dark', 
          window.innerWidth < 768, 
          hasSlowConnection
        );
        document.head.appendChild(linkPreload);
        
        // Cleanup preload link after a delay
        setTimeout(() => {
          if (document.head.contains(linkPreload)) {
            document.head.removeChild(linkPreload);
          }
        }, 10000);
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadVideo, { timeout: 2000 });
      } else {
        setTimeout(preloadVideo, 500);
      }
    }
    
    return () => {
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      clearTimeout(videoDelayTimer);
      window.removeEventListener('resize', resizeHandler);
      mountedRef.current = false;
    };
  }, [handleResize, theme, deviceCapabilities]);

  // Theme effect with hardware acceleration and performance optimization
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      
      // Enable hardware acceleration for theme transitions with performance optimization
      requestAnimationFrame(() => {
        root.style.transform = 'translate3d(0,0,0)';
        
        // Remove hardware acceleration hint after transition
        setTimeout(() => {
          root.style.transform = '';
        }, 300);
      });
    }
  }, [isDark, mounted]);

  // Performance monitoring effect for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && mounted) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('video') || entry.entryType === 'measure') {
            console.log('Performance:', entry.name, entry.duration);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        // Performance Observer not supported
      }
      
      return () => observer.disconnect();
    }
  }, [mounted]);

  // Stable context value with enhanced performance tracking
  const contextValue = useMemo(() => 
    createStableContextValue(
      videoRef, 
      deferredIsLoaded, 
      isDark, 
      deferredIsMobile, 
      deferredIsPlaying, 
      hasVideoError, 
      retryVideo,
      videoLoadTime,
      compressionLevel
    ), 
    [deferredIsLoaded, isDark, deferredIsMobile, deferredIsPlaying, hasVideoError, retryVideo, videoLoadTime, compressionLevel]
  );

  // Enhanced loading state with progressive enhancement
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingFallback showSkeleton={false} ariaLabel="Initializing application..." />
        </div>
      </main>
    );
  }

  return (
    <VideoBackgroundContext.Provider value={contextValue}>
      {/* LCP-optimized video background - HEAVILY delayed to prioritize hero content */}
      {shouldShowVideo && !hasVideoError && deferredIsLoaded && allowVideoLoad && (
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{ 
            opacity: isDark ? 0.85 : 0.9,
            willChange: 'opacity',
            transform: 'translate3d(0,0,0)',
            contain: 'strict'
          }}
        >
          <video
            ref={videoRef}
            key={`${isDark ? 'dark' : 'light'}-${deferredIsMobile ? 'mobile' : 'desktop'}-${useCompressedVideo ? 'compressed' : 'hd'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={videoPoster}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: isDark 
                ? 'brightness(0.7) contrast(1.1) saturate(1.0)' 
                : 'brightness(1.2) contrast(0.95) saturate(0.9)',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden'
            }}
            src={videoSrc}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onLoadStart={() => {
              videoLoadStartTime.current = performance.now();
              
              // AGGRESSIVE TIMEOUT: Force local video after 3 seconds
              const timeoutId = setTimeout(() => {
                if (!deferredIsPlaying && !hasVideoError && videoLoadStartTime.current > 0) {
                  console.warn('Video loading timeout - switching to local fallback');
                  setVideoLoadTimeout(true);
                  setUseLocalVideo(true);
                }
              }, 3000); // 3 second timeout for LCP optimization
              
              // Clear timeout if video loads successfully
              const clearTimeoutOnLoad = () => {
                clearTimeout(timeoutId);
              };
              
              if (videoRef.current) {
                videoRef.current.addEventListener('canplay', clearTimeoutOnLoad, { once: true });
                videoRef.current.addEventListener('loadeddata', clearTimeoutOnLoad, { once: true });
              }
            }}
            aria-hidden="true"
          />
          
          {/* Enhanced loading indicator with compression info */}
          {!deferredIsPlaying && !hasVideoError && (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/20 to-gray-100/20 dark:from-gray-900/20 dark:to-gray-950/20 flex items-center justify-center">
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                  {useCompressedVideo ? 'Compressed' : 'HD'} • {compressionLevel}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* INSTANT CSS background for optimal LCP - Always show until video loads */}
      {(!shouldShowVideo || hasVideoError || !allowVideoLoad) && (
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
            opacity: 0.9,
            transform: 'translate3d(0,0,0)',
            contain: 'strict'
          }}
        />
      )}

      <main 
        ref={homeRef}
        className={`min-h-screen relative transition-opacity duration-300 ${
          deferredIsLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        style={{ 
          zIndex: 10,
          transform: 'translate3d(0,0,0)'
        }}
      >
        <div className="flex flex-col w-full relative z-10">
          {/* Hero Section - Critical path with LCP optimization */}
          <section className="w-full relative -mt-6 z-20" style={{ contain: 'layout style paint' }}>
            <Hero2 isCompact={false} />
          </section>

          {/* Main Content Sections with LCP-optimized lazy loading */}
          <div className="flex flex-col relative z-10 -mt-8">
            {/* Courses Section - Deferred to not compete with LCP */}
            {deferredIsLoaded && (
              <section className="w-full relative z-10 glass-container">
                <SectionErrorBoundary
                  onError={(error, errorInfo) => {
                    if (process.env.NODE_ENV === 'development') {
                      console.error('HomeCourseSection error:', error, errorInfo);
                    }
                  }}
                >
                  <Suspense fallback={<LoadingFallback height="96" ariaLabel="Loading courses..." />}>
                    <HomeCourseSection
                      CustomText="Discover our comprehensive range of "
                      CustomDescription="Skill Development Courses"
                      hideGradeFilter
                    />
                  </Suspense>
                </SectionErrorBoundary>
              </section>
            )}

            {/* Job Guaranteed Section */}
            {deferredIsLoaded && (
              <section className="w-full relative z-10">
                <SectionErrorBoundary
                  onError={(error, errorInfo) => {
                    if (process.env.NODE_ENV === 'development') {
                      console.error('JobGuaranteedSection error:', error, errorInfo);
                    }
                  }}
                >
                  <Suspense fallback={<LoadingFallback height="96" ariaLabel="Loading job guarantee section..." />}>
                    <JobGuaranteedSection showStats={false} />
                  </Suspense>
                </SectionErrorBoundary>
              </section>
            )}

            {/* Remaining sections - Progressive loading after LCP */}
            {deferredIsLoaded && (
              <>
                {/* Why Medh Section */}
                <section className="w-full relative overflow-hidden z-10 glass-light">
                  <SectionErrorBoundary>
                    <Suspense fallback={<LoadingFallback height="72" ariaLabel="Loading why choose us..." />}>
                      <WhyMedh />
                    </Suspense>
                  </SectionErrorBoundary>
                </section>

                {/* Join Medh Section */}
                <section className="w-full relative overflow-hidden z-10 glass-card">
                  <SectionErrorBoundary>
                    <Suspense fallback={<LoadingFallback height="72" ariaLabel="Loading join section..." />}>
                      <JoinMedh />
                    </Suspense>
                  </SectionErrorBoundary>
                </section>

                {/* Hire Section */}
                <section className="w-full relative overflow-hidden z-10 glass-dark">
                  <SectionErrorBoundary>
                    <Suspense fallback={<LoadingFallback height="72" ariaLabel="Loading hire section..." />}>
                      <Hire />
                    </Suspense>
                  </SectionErrorBoundary>
                </section>
                
                {/* Blog Section - Lowest priority */}
                <section className="w-full relative z-10 glass-container">
                  <SectionErrorBoundary>
                    <Suspense fallback={<LoadingFallback height="72" ariaLabel="Loading blog posts..." />}>
                      <Blogs />
                    </Suspense>
                  </SectionErrorBoundary>
                </section>
              </>
            )}

            {/* Optimized spacer */}
            <div className="h-20" />
          </div>
        </div>
        
        {/* Enhanced performance indicators for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 space-y-1 z-50">
            {isPending && (
              <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                Updating...
              </div>
            )}
            {videoLoadTime && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                Video: {Math.round(videoLoadTime)}ms
              </div>
            )}
            {hasVideoError && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                Video Error (Retry: {retryCountRef.current})
              </div>
            )}
          </div>
        )}
      </main>
    </VideoBackgroundContext.Provider>
  );
};

export default Home1; 