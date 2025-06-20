"use client";

import Hero2 from "@/components/sections/hero-banners/Hero2";
import React, { useEffect, useRef, useState, useCallback, createContext, useMemo } from "react";
import { useTheme } from "next-themes";
import { initializeIOSOptimizations, deviceDetection, memoryManager, errorRecovery, iosVideoConfig } from "@/utils/ios-video-utils";
import { iosTest } from "@/utils/ios-test";
import "@/styles/glassmorphism.css";
import "@/styles/ios-optimizations.css";

// Lazy loading - simplified without extra wrapper
const HomeCourseSection = React.lazy(() => import("@/components/sections/courses/HomeCourseSection2"));
const JobGuaranteedSection = React.lazy(() => import("@/components/sections/job-guaranteed/JobGuaranteedSection"));
const WhyMedh = React.lazy(() => import("@/components/sections/why-medh/WhyMedh2"));
const JoinMedh = React.lazy(() => import("@/components/sections/hire/JoinMedh2"));
const Hire = React.lazy(() => import("@/components/sections/hire/Hire2"));
const Blogs = React.lazy(() => import("@/components/sections/blogs/Blogs"));

// Simplified video config with iOS fallbacks
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

// Minimal context interface
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

// Debounce utility
let resizeTimeout: NodeJS.Timeout;
const debouncedResize = (callback: () => void) => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(callback, 150);
};

const Home2: React.FC = () => {
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);
  const userInteracted = useRef(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  
  // Minimal state with error handling
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoAttempted, setVideoAttempted] = useState(false);
  
  // Memoized derived values to prevent unnecessary re-renders
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  const videoSrc = useMemo(() => 
    getVideoSrc(isDark, isMobile, isIOSDevice), 
    [isDark, isMobile, isIOSDevice]
  );

  // Start video function using iOS-optimized utility
  const startVideo = useCallback(async () => {
    if (!videoRef.current || !shouldShowVideo || hasVideoError || videoAttempted) return;
    
    try {
      setVideoAttempted(true);
      
      // Use the iOS-optimized video starter
      const success = await iosVideoConfig.startBackgroundVideo(videoRef.current);
      
      if (success) {
        setIsPlaying(true);
        console.log('✅ Background video started successfully');
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

  // Handle user interaction to start video on iOS
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

  // Setup intersection observer for video visibility
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

  // Device detection effect with iOS optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const iosDevice = deviceDetection.isIOS();
    const lowPower = deviceDetection.isLowPowerMode();
    const memoryInfo = deviceDetection.getMemoryInfo();
    
    setIsIOSDevice(iosDevice);
    
    // Initialize iOS optimizations
    const cleanupIOS = initializeIOSOptimizations();
    
    // Run iOS tests in development
    if (process.env.NODE_ENV === 'development' && iosDevice) {
      iosTest.runAllTests();
    }
    
    // Only disable video for very low-end devices or extreme low memory
    if (iosDevice && (window.screen.width < 320 || (memoryInfo.deviceMemory && memoryInfo.deviceMemory < 2))) {
      setShouldShowVideo(false);
      console.warn('Very low-end device detected, disabling video background');
    }
    
    // Setup user interaction listeners for iOS
    if (iosDevice) {
      window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: false });
      window.addEventListener('click', handleUserInteraction, { passive: true, once: false });
      window.addEventListener('scroll', handleUserInteraction, { passive: true, once: false });
    }
    
    // Start memory monitoring for iOS devices
    let memoryCleanup = () => {};
    if (iosDevice) {
      memoryCleanup = memoryManager.monitorMemoryUsage((shouldCleanup) => {
        if (shouldCleanup) {
          console.warn('High memory usage detected, disabling video');
          setShouldShowVideo(false);
          setHasVideoError(true);
        }
      });
    }
    
    setIsClient(true);
    setMounted(true);
    mountedRef.current = true;
    
    return () => {
      if (cleanupIOS) cleanupIOS();
      if (memoryCleanup) memoryCleanup();
      
      // Clean up interaction listeners
      if (iosDevice) {
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
      }
    };
  }, [handleUserInteraction]);

  // Optimized resize handler with iOS considerations
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

  // Single initialization effect with error handling
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    setIsMobile(window.innerWidth < 768);
    
    // Quick load with iOS-friendly timing
    const loadTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoaded(true);
      }
    }, isIOSDevice ? 100 : 50);
    
    // Resize listener with passive for better performance
    const handleResizePassive = (event: Event) => {
      event.preventDefault();
      handleResize();
    };
    
    window.addEventListener('resize', handleResizePassive, { passive: true });
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResizePassive);
      mountedRef.current = false;
    };
  }, [isClient, handleResize, isIOSDevice]);

  // Theme effect with iOS considerations
  useEffect(() => {
    if (mounted && isClient && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted, isClient]);

  // Video error handling with iOS-specific recovery
  const handleVideoError = useCallback((error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Video background failed to load, using fallback');
    
    // Use iOS-specific error handling
    if (videoRef.current) {
      errorRecovery.handleVideoErrorWithFallback(error.nativeEvent, videoRef, () => {
        setHasVideoError(true);
        setShouldShowVideo(false);
      });
    } else {
      setHasVideoError(true);
      setShouldShowVideo(false);
    }
  }, []);

  // Video load handling with automatic play attempt
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current && mountedRef.current) {
      setHasVideoError(false);
      
      // Try to start video immediately on load for non-iOS or after user interaction
      if (!isIOSDevice || userInteracted.current) {
        startVideo();
      }
    }
  }, [isIOSDevice, startVideo]);

  // Handle video play events
  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Handle video pause events
  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
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

  // Fast loading state with better iOS support
  if (!isClient || !mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
        </div>
      </main>
    );
  }

  return (
    <VideoBackgroundContext.Provider value={contextValue}>
      {/* Video background with iOS optimizations - Always show if no error */}
      {shouldShowVideo && !hasVideoError && (
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{ 
            opacity: isDark ? 0.85 : 0.9,
            willChange: isIOSDevice ? 'auto' : 'opacity'
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
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: isDark 
                ? 'brightness(0.7) contrast(1.1) saturate(1.0)' 
                : 'brightness(1.2) contrast(0.95) saturate(0.9)',
              transform: isIOSDevice ? 'none' : 'translateZ(0)',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none' // Ensure no interaction
            }}
            src={videoSrc}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            webkit-playsinline="true"
            data-testid="background-video"
          />
          
          {/* iOS Help Text - Only show briefly if video hasn't started */}
          {isIOSDevice && !isPlaying && !hasVideoError && isLoaded && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-60 pointer-events-none">
              Tap anywhere to activate background video
            </div>
          )}
        </div>
      )}

      {/* Fallback background for when video is disabled */}
      {(!shouldShowVideo || hasVideoError) && (
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
            opacity: 0.9
          }}
        />
      )}

      <main 
        ref={homeRef}
        className={`min-h-screen relative transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col w-full relative z-10">
          {/* Hero Section */}
          <section className="w-full relative -mt-6">
            <Hero2 isCompact={false} />
          </section>

          {/* Main Content Sections with error boundaries */}
          <div className="flex flex-col relative z-10 -mt-8">
            {/* Courses Section */}
            <section className="w-full relative z-10 glass-container">
              <React.Suspense fallback={
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
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
            <section className="w-full relative z-10">
              <React.Suspense fallback={
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
                </div>
              }>
                <JobGuaranteedSection showStats={false} />
              </React.Suspense>
            </section>

            {/* Why Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-light">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
                </div>
              }>
                <WhyMedh />
              </React.Suspense>
            </section>

            {/* Join Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-card">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
                </div>
              }>
                <JoinMedh />
              </React.Suspense>
            </section>

            {/* Hire Section */}
            <section className="w-full relative overflow-hidden z-10 glass-dark">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
                </div>
              }>
                <Hire />
              </React.Suspense>
            </section>
            
            {/* Blog Section */}
            <section className="w-full relative z-10 glass-container">
              <React.Suspense fallback={
                <div className="h-72 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" />
                </div>
              }>
                <Blogs />
              </React.Suspense>
            </section>

            {/* Spacer */}
            <div className="h-20" />
          </div>
        </div>
      </main>
    </VideoBackgroundContext.Provider>
  );
};

export default Home2; 