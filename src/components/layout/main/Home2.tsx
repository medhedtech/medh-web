"use client";

import Hero2 from "@/components/sections/hero-banners/Hero2";
import React, { useEffect, useRef, useState, useCallback, createContext, useMemo } from "react";
import { useTheme } from "next-themes";
import { initializeIOSOptimizations, deviceDetection, memoryManager, errorRecovery, iosVideoConfig } from "@/utils/ios-video-utils";
import { iosTest } from "@/utils/ios-test";
import "@/styles/glassmorphism.css";
import "@/styles/ios-optimizations.css";

// Lazy loading - simplified without extra wrapper - GPU optimized
const HomeCourseSection = React.lazy(() => import("@/components/sections/courses/HomeCourseSection2"));
const JobGuaranteedSection = React.lazy(() => import("@/components/sections/job-guaranteed/JobGuaranteedSection"));
const WhyMedh = React.lazy(() => import("@/components/sections/why-medh/WhyMedh2"));
const JoinMedh = React.lazy(() => import("@/components/sections/hire/JoinMedh2"));
const Hire = React.lazy(() => import("@/components/sections/hire/Hire2"));
const Blogs = React.lazy(() => import("@/components/sections/blogs/Blogs"));

// GPU-optimized video config with iOS fallbacks
const getVideoSrc = (isDark: boolean, isMobile: boolean, isIOSDevice: boolean): string => {
  // For iOS devices, use optimized, lighter videos
  if (isIOSDevice) {
    return isDark 
      ? "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4"
      : "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4";
  }
  
  if (isDark) {
    return isMobile 
      ? "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4"
      : "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4";
  }
  return isMobile 
    ? "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4"
    : "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4";
};

// Minimal context interface with GPU optimization flags
export interface VideoBackgroundContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoaded: boolean;
  isDark: boolean;
  isMobile: boolean;
  isIOSDevice: boolean;
  hasVideoError: boolean;
  isPlaying: boolean;
  startVideo: () => Promise<void>;
}

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true,
  isMobile: false,
  isIOSDevice: false,
  hasVideoError: false,
  isPlaying: false,
  startVideo: async () => {}
});

// GPU-optimized debounce utility with proper cleanup
const debouncedResize = (() => {
  let resizeTimeout: NodeJS.Timeout | null = null;
  return (callback: () => void) => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(callback, 150);
  };
})();

const Home2: React.FC = () => {
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);
  const userInteracted = useRef(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  
  // Minimal state with error handling and GPU optimization flags
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoAttempted, setVideoAttempted] = useState(false);
  
  // Memoized derived values to prevent unnecessary re-renders with GPU optimization
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  const videoSrc = useMemo(() => 
    getVideoSrc(isDark, isMobile, isIOSDevice), 
    [isDark, isMobile, isIOSDevice]
  );

  // GPU-optimized start video function using iOS-optimized utility
  const startVideo = useCallback(async () => {
    if (!videoRef.current || !shouldShowVideo || hasVideoError || videoAttempted) return;
    
    try {
      setVideoAttempted(true);
      
      // Use the iOS-optimized video starter with safety checks and GPU acceleration
      const success = iosVideoConfig?.startBackgroundVideo 
        ? await iosVideoConfig.startBackgroundVideo(videoRef.current)
        : false;
      
      if (success) {
        setIsPlaying(true);
        // Enable GPU acceleration for video element
        if (videoRef.current) {
          videoRef.current.style.transform = 'translate3d(0,0,0)';
          videoRef.current.style.willChange = 'transform, opacity';
        }
        console.log('✅ Background video started successfully with GPU acceleration');
      } else {
        console.warn('Video autoplay failed, will try again on user interaction');
        // Reset attempt flag to allow retry
        setVideoAttempted(false);
      }
    } catch (error) {
      console.warn('Video autoplay failed:', error);
      // Reset attempt flag to allow retry
      setVideoAttempted(false);
    }
  }, [shouldShowVideo, hasVideoError, videoAttempted]);

  // GPU-optimized handle user interaction to start video on iOS
  const handleUserInteraction = useCallback(async () => {
    if (userInteracted.current || !isIOSDevice) return;
    
    userInteracted.current = true;
    await startVideo();
    
    // Remove interaction listeners after first use
    if (typeof window !== 'undefined') {
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    }
  }, [isIOSDevice, startVideo]);

  // GPU-optimized intersection observer for video visibility
  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying && shouldShowVideo) {
            startVideo();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      intersectionObserverRef.current.observe(videoRef.current);
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [isClient, isPlaying, shouldShowVideo, startVideo]);

  // GPU-optimized device detection effect with iOS optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const iosDevice = deviceDetection.isIOS();
    const lowPower = deviceDetection.isLowPowerMode();
    const memoryInfo = deviceDetection.getMemoryInfo();
    
    setIsIOSDevice(iosDevice);
    
    // Initialize iOS optimizations with safety checks and GPU acceleration
    const cleanupIOS = initializeIOSOptimizations?.() || (() => {});
    
    // Run iOS tests in development with safety checks
    if (process.env.NODE_ENV === 'development' && iosDevice && iosTest?.runAllTests) {
      try {
        iosTest.runAllTests();
      } catch (testError) {
        console.warn('iOS tests failed:', testError);
      }
    }
    
    // Only disable video for very low-end devices or extreme low memory
    if (iosDevice && (window.screen.width < 320 || (memoryInfo.deviceMemory && memoryInfo.deviceMemory < 2))) {
      setShouldShowVideo(false);
      console.warn('Very low-end device detected, disabling video background');
    }
    
    // Setup user interaction listeners for iOS with GPU optimization
    if (iosDevice) {
      window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: false });
      window.addEventListener('click', handleUserInteraction, { passive: true, once: false });
      window.addEventListener('scroll', handleUserInteraction, { passive: true, once: false });
    }
    
    // Start memory monitoring for iOS devices with safety checks
    let memoryCleanup = () => {};
    if (iosDevice && memoryManager?.monitorMemoryUsage) {
      try {
        memoryCleanup = memoryManager.monitorMemoryUsage((shouldCleanup) => {
          if (shouldCleanup) {
            console.warn('High memory usage detected, disabling video');
            setShouldShowVideo(false);
            setHasVideoError(true);
          }
        });
      } catch (memoryError) {
        console.warn('Memory monitoring failed:', memoryError);
      }
    }
    
    setIsClient(true);
    setMounted(true);
    mountedRef.current = true;
    
    return () => {
      try {
        if (cleanupIOS && typeof cleanupIOS === 'function') cleanupIOS();
        if (memoryCleanup && typeof memoryCleanup === 'function') memoryCleanup();
        
        // Clean up interaction listeners
        if (iosDevice && typeof window !== 'undefined') {
          window.removeEventListener('touchstart', handleUserInteraction);
          window.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('scroll', handleUserInteraction);
        }
      } catch (cleanupError) {
        console.warn('Cleanup failed:', cleanupError);
      }
    };
  }, [handleUserInteraction]);

  // GPU-optimized resize handler with iOS considerations
  const handleResize = useCallback(() => {
    if (!isClient || typeof window === 'undefined' || !mountedRef.current) return;
    
    debouncedResize(() => {
      if (!mountedRef.current) return;
      
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    });
  }, [isMobile, isClient]);

  // GPU-optimized initialization effect with error handling
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    setIsMobile(window.innerWidth < 768);
    
    // Quick load with iOS-friendly timing and GPU optimization
    const loadTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoaded(true);
      }
    }, isIOSDevice ? 100 : 50);
    
    // Resize listener with passive for better performance
    const handleResizePassive = () => {
      handleResize();
    };
    
    window.addEventListener('resize', handleResizePassive, { passive: true });
    
    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('resize', handleResizePassive);
      mountedRef.current = false;
    };
  }, [isClient, handleResize, isIOSDevice]);

  // GPU-optimized theme effect with iOS considerations
  useEffect(() => {
    if (mounted && isClient && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      // Enable GPU acceleration for theme transitions
      document.documentElement.style.transform = 'translate3d(0,0,0)';
      document.documentElement.style.willChange = 'background-color, color';
    }
  }, [isDark, mounted, isClient]);

  // GPU-optimized video error handling with iOS-specific recovery
  const handleVideoError = useCallback((error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Video background failed to load, using fallback');
    
    // Use iOS-specific error handling with safety checks
    if (videoRef.current && errorRecovery?.handleVideoErrorWithFallback) {
      try {
        errorRecovery.handleVideoErrorWithFallback(error.nativeEvent, videoRef, () => {
          setHasVideoError(true);
          setShouldShowVideo(false);
        });
      } catch (recoveryError) {
        console.warn('Error recovery failed:', recoveryError);
        setHasVideoError(true);
        setShouldShowVideo(false);
      }
    } else {
      setHasVideoError(true);
      setShouldShowVideo(false);
    }
  }, []);

  // GPU-optimized video load handling with automatic play attempt
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current && mountedRef.current) {
      setHasVideoError(false);
      
      // Enable GPU acceleration for loaded video
      videoRef.current.style.transform = 'translate3d(0,0,0)';
      videoRef.current.style.willChange = 'transform, opacity';
      
      // Try to start video immediately on load for non-iOS or after user interaction
      if (!isIOSDevice || userInteracted.current) {
        startVideo();
      }
    }
  }, [isIOSDevice, startVideo]);

  // GPU-optimized handle video play events
  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
    // Optimize GPU usage during playback
    if (videoRef.current) {
      videoRef.current.style.willChange = 'auto';
    }
  }, []);

  // GPU-optimized handle video pause events
  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
    // Re-enable GPU acceleration when paused
    if (videoRef.current) {
      videoRef.current.style.willChange = 'transform, opacity';
    }
  }, []);

  // Create stable context value - MUST be before any conditional returns
  const contextValue = useMemo((): VideoBackgroundContextType => ({
    videoRef,
    isLoaded,
    isDark,
    isMobile,
    isIOSDevice,
    hasVideoError,
    isPlaying,
    startVideo
  }), [isLoaded, isDark, isMobile, isIOSDevice, hasVideoError, isPlaying, startVideo]);

  // GPU-optimized loading state with better iOS support
  if (!isClient || !mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 gpu-accelerated">
        <div className="flex items-center justify-center min-h-screen gpu-accelerated">
          <div className="animate-spin-gpu rounded-full h-8 w-8 border-t-2 border-primary-500 gpu-accelerated" />
        </div>
      </main>
    );
  }

  return (
    <VideoBackgroundContext.Provider value={contextValue}>
      {/* GPU-optimized video background with iOS optimizations - Always show if no error */}
      {shouldShowVideo && !hasVideoError && (
        <div 
          className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0 gpu-accelerated"
          style={{ 
            opacity: isDark ? 0.85 : 0.9,
            willChange: isIOSDevice ? 'auto' : 'opacity',
            transform: 'translate3d(0,0,0)',
            margin: 0,
            padding: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          }}
        >
          <video
            ref={videoRef}
            key={`${isDark ? 'dark' : 'light'}-${isMobile ? 'mobile' : 'desktop'}-${isIOSDevice ? 'ios' : 'other'}`}
            autoPlay={!isIOSDevice} // Only autoplay on non-iOS devices
            muted // Always muted for background video
            loop // Always loop
            playsInline // Required for iOS
            preload={isIOSDevice ? "metadata" : "auto"} // Balanced preloading for iOS
            controls={false} // Never show controls
            className="fixed inset-0 w-screen h-screen min-w-full min-h-full max-w-none max-h-none object-cover gpu-accelerated video-background-hq"
            style={{ 
              filter: isDark 
                ? 'brightness(0.7) contrast(1.1) saturate(1.0)' 
                : 'brightness(1.2) contrast(0.95) saturate(0.9)',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none', // Ensure no interaction
              willChange: 'transform, opacity',
              margin: 0,
              padding: 0,
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }}
            src={videoSrc}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            data-testid="background-video"
          />
          
          {/* iOS Help Text - Only show briefly if video hasn't started */}
          {isIOSDevice && !isPlaying && !hasVideoError && isLoaded && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-60 pointer-events-none gpu-accelerated">
              Tap anywhere to activate background video
            </div>
          )}
        </div>
      )}

      {/* GPU-optimized fallback background for when video is disabled */}
      {(!shouldShowVideo || hasVideoError) && (
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-0 gpu-accelerated"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
            opacity: 0.9,
            transform: 'translate3d(0,0,0)',
            willChange: 'background-color'
          }}
        />
      )}

      <main 
        ref={homeRef}
        className={`min-h-screen relative transition-gpu gpu-accelerated ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        style={{ 
          zIndex: 10,
          transform: 'translate3d(0,0,0)',
          willChange: 'opacity'
        }}
      >
        <div className="flex flex-col w-full relative z-10 gpu-accelerated">
          {/* GPU-optimized Hero Section */}
          <section className="w-full relative -mt-6 gpu-accelerated">
            <Hero2 isCompact={false} />
          </section>

          {/* GPU-optimized Main Content Sections with error boundaries */}
          <div className="flex flex-col relative z-10 -mt-8 gpu-accelerated">
            {/* Courses Section */}
            <section className="w-full relative z-10 glass-container gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-96 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <HomeCourseSection
                  CustomText="Discover our comprehensive range of "
                  CustomDescription="Skill Development Courses"
                  hideGradeFilter
                />
              </React.Suspense>
            </section>

            {/* Job Guaranteed Section */}
            <section className="w-full relative z-10 gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-96 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <JobGuaranteedSection showStats={false} />
              </React.Suspense>
            </section>

            {/* Why Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-light gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <WhyMedh />
              </React.Suspense>
            </section>

            {/* Join Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-card gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <JoinMedh />
              </React.Suspense>
            </section>

            {/* Hire Section */}
            <section className="w-full relative overflow-hidden z-10 glass-dark gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <Hire />
              </React.Suspense>
            </section>
            
            {/* Blog Section */}
            <section className="w-full relative z-10 glass-container gpu-accelerated">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center gpu-accelerated">
                  <div className="animate-spin-gpu rounded-full h-6 w-6 border-t-2 border-primary-500 gpu-accelerated" />
                </div>
              }>
                <Blogs />
              </React.Suspense>
            </section>

            {/* Spacer */}
            <div className="h-20 gpu-accelerated" />
          </div>
        </div>
      </main>
    </VideoBackgroundContext.Provider>
  );
};

export default Home2; 