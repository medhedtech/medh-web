"use client";

import Hero2 from "@/components/sections/hero-banners/Hero2";
import React, { useEffect, useRef, useState, useCallback, createContext } from "react";
import { useTheme } from "next-themes";
import "@/styles/glassmorphism.css";

// Lazy loading - simplified without extra wrapper
const HomeCourseSection = React.lazy(() => import("@/components/sections/courses/HomeCourseSection2"));
const JobGuaranteedSection = React.lazy(() => import("@/components/sections/job-guaranteed/JobGuaranteedSection"));
const WhyMedh = React.lazy(() => import("@/components/sections/why-medh/WhyMedh2"));
const JoinMedh = React.lazy(() => import("@/components/sections/hire/JoinMedh2"));
const Hire = React.lazy(() => import("@/components/sections/hire/Hire2"));
const Blogs = React.lazy(() => import("@/components/sections/blogs/Blogs"));

// Simplified video config - direct strings to reduce object overhead
const getVideoSrc = (isDark: boolean, isMobile: boolean): string => {
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
}

// Reusable context value to prevent recreation
const createContextValue = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isLoaded: boolean,
  isDark: boolean,
  isMobile: boolean
): VideoBackgroundContextType => ({
  videoRef,
  isLoaded,
  isDark,
  isMobile
});

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true,
  isMobile: false
});

// Simple debounce without closure
let resizeTimeout: NodeJS.Timeout;
const debouncedResize = (callback: () => void) => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(callback, 100);
};

const Home2: React.FC = () => {
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Minimal state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Simple derived values
  const isDark = mounted ? theme === 'dark' : true;
  const videoSrc = getVideoSrc(isDark, isMobile);

  // Client-side mounting effect
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    debouncedResize(() => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    });
  }, [isMobile, isClient]);

  // Single initialization effect
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    setIsMobile(window.innerWidth < 768);
    
    // Quick load
    const loadTimer = setTimeout(() => setIsLoaded(true), 50);
    
    // Resize listener
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, handleResize]);

  // Theme effect
  useEffect(() => {
    if (mounted && isClient) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted, isClient]);

  // Fast loading state
  if (!isClient || !mounted) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
        </div>
      </main>
    );
  }

  // Create context value only when needed
  const contextValue = createContextValue(videoRef, isLoaded, isDark, isMobile);

  return (
    <VideoBackgroundContext.Provider value={contextValue}>
      {/* Optimized video background */}
      <div 
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{ 
          opacity: isDark ? 0.85 : 0.9,
          willChange: 'opacity'
        }}
      >
        <video
          ref={videoRef}
          key={`${isDark ? 'dark' : 'light'}-${isMobile ? 'mobile' : 'desktop'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            filter: isDark 
              ? 'brightness(0.7) contrast(1.1) saturate(1.0)' 
              : 'brightness(1.2) contrast(0.95) saturate(0.9)',
            transform: 'translateZ(0)'
          }}
          src={videoSrc}
        />
      </div>

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

          {/* Main Content Sections */}
          <div className="flex flex-col relative z-10 -mt-8">
            {/* Courses Section */}
            <section className="w-full relative z-10 glass-container">
              <React.Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
                <HomeCourseSection
                  CustomText="Discover our comprehensive range of "
                  CustomDescription="Skill Development Courses"
                  hideGradeFilter
                />
              </React.Suspense>
            </section>

            {/* Job Guaranteed Section */}
            <section className="w-full relative z-10">
              <React.Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
                <JobGuaranteedSection showStats={false} />
              </React.Suspense>
            </section>

            {/* Why Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-light">
              <React.Suspense fallback={<div className="h-72 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
                <WhyMedh />
              </React.Suspense>
            </section>

            {/* Join Medh Section */}
            <section className="w-full relative overflow-hidden z-10 glass-card">
              <React.Suspense fallback={<div className="h-72 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
                <JoinMedh />
              </React.Suspense>
            </section>

            {/* Hire Section */}
            <section className="w-full relative overflow-hidden z-10 glass-dark">
              <React.Suspense fallback={<div className="h-72 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
                <Hire />
              </React.Suspense>
            </section>
            
            {/* Blog Section */}
            <section className="w-full relative z-10 glass-container">
              <React.Suspense fallback={<div className="h-72 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500" /></div>}>
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