"use client";

import Hero2 from "@/components/sections/hero-banners/Hero2";
import React, { useEffect, useRef, useState, useCallback, createContext, useMemo, Suspense } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import "@/styles/glassmorphism.css";

// Lazy load heavy components for better performance
const HomeCourseSection = React.lazy(() => import("@/components/sections/courses/HomeCourseSection2"));
const WhyMedh = React.lazy(() => import("@/components/sections/why-medh/WhyMedh2"));
const JoinMedh = React.lazy(() => import("@/components/sections/hire/JoinMedh2"));
const Hire = React.lazy(() => import("@/components/sections/hire/Hire2"));
const Blogs = React.lazy(() => import("@/components/sections/blogs/Blogs"));

// Optimized video configuration - simplified
interface IVideoConfig {
  src: string;
  fallback: string;
}

const VIDEO_SOURCES = {
  darkDesktop: {
    src: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4"
  },
  darkMobile: {
    src: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4"
  },
  lightDesktop: {
    src: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4"
  },
  lightMobile: {
    src: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4"
  }
} as const;

// Simplified context
export interface VideoBackgroundContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoaded: boolean;
  isDark: boolean;
  isMobile: boolean;
}

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true,
  isMobile: false
});

// Optimized state interface - combine related state
interface IAppState {
  isLoaded: boolean;
  isMobile: boolean;
  mounted: boolean;
}

// Debounce utility - moved outside component to prevent recreation
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Optimized theme switching - just toggle data attribute
const updateThemeAttribute = (isDark: boolean) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

const Home2: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simplified state management
  const [state, setState] = useState<IAppState>({
    isLoaded: false,
    isMobile: false,
    mounted: false
  });
  
  // Memoized theme and device detection
  const { isDark, isMobile } = useMemo(() => ({
    isDark: state.mounted ? theme === 'dark' : true,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  }), [state.mounted, theme]);

  // Memoized video config selection
  const videoConfig = useMemo((): IVideoConfig => {
    const key = `${isDark ? 'dark' : 'light'}${isMobile ? 'Mobile' : 'Desktop'}` as keyof typeof VIDEO_SOURCES;
    return VIDEO_SOURCES[key];
  }, [isDark, isMobile]);

  // Optimized resize handler with debouncing
  const handleResize = useCallback(
    debounce(() => {
      if (typeof window === 'undefined') return;
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }));
    }, 150),
    []
  );

  // Combined initialization effect
  useEffect(() => {
    setState(prev => ({ ...prev, mounted: true }));

    if (typeof window !== 'undefined') {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }));

      window.addEventListener('resize', handleResize, { passive: true });
      
      // Quick loading sequence
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, isLoaded: true }));
      }, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [handleResize]);

  // Optimized theme attribute update
  useEffect(() => {
    if (state.mounted) {
      updateThemeAttribute(isDark);
    }
  }, [isDark, state.mounted]);

  // Memoized video opacity - increased for better visibility
  const videoOpacity = useMemo(() => isDark ? 0.9 : 0.9, [isDark]);

  // Memoized video filter - brighter and more vibrant
  const videoFilter = useMemo(() => 
    isDark 
      ? 'brightness(0.7) contrast(1.1) saturate(1.0) hue-rotate(8deg)' 
      : 'brightness(1.2) contrast(0.95) saturate(0.9) hue-rotate(-3deg)',
    [isDark]
  );

  // Simplified loading state
  if (!state.mounted) {
    return (
      <main className="min-h-screen flex flex-col relative bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
        </div>
      </main>
    );
  }

  return (
    <VideoBackgroundContext.Provider value={{ 
      videoRef, 
      isLoaded: state.isLoaded, 
      isDark, 
      isMobile 
    }}>
      <>
        {/* Optimized video background */}
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{ opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            key={`video-${isDark ? 'dark' : 'light'}-${isMobile ? 'mobile' : 'desktop'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: videoFilter,
              transform: 'translateZ(0)',
              willChange: 'auto'
            }}
            onError={() => {
              if (videoRef.current && videoRef.current.src === videoConfig.src) {
                videoRef.current.src = videoConfig.fallback;
              }
            }}
          >
            <source src={videoConfig.src} type="video/mp4" />
            <source src={videoConfig.fallback} type="video/mp4" />
          </video>
        </div>

        <main 
          ref={homeRef}
          className={`min-h-screen flex flex-col relative transition-all duration-500 ${
            state.isLoaded ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'
          }`}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className={`flex flex-col w-full transition-all duration-500 relative z-10 ${
            state.isLoaded ? 'translate-y-0' : 'translate-y-2'
          }`}>
            {/* Hero Section */}
            <section className="w-full relative -mt-4 md:-mt-6 lg:-mt-8">
              <div className="w-full">
                <Hero2 isCompact={false} />
              </div>
            </section>

            {/* Main Content Sections with Optimized Glassmorphism */}
            <div className="flex flex-col relative z-10 -mt-8">
              {/* Courses Section */}
              <section className="w-full relative z-10 glass-container">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                  </div>
                }>
                  <HomeCourseSection
                    CustomText="Discover our comprehensive range of "
                    CustomDescription="Skill Development Courses"
                    hideGradeFilter
                  />
                </Suspense>
              </section>

              {/* Why Medh Section */}
              <section className="w-full relative overflow-hidden z-10 glass-light">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                  </div>
                }>
                  <WhyMedh />
                </Suspense>
              </section>

              {/* Join Medh Section */}
              <section className="w-full relative overflow-hidden z-10 glass-card">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                  </div>
                }>
                  <JoinMedh />
                </Suspense>
              </section>

              {/* Hire Section */}
              <section className="w-full relative overflow-hidden z-10 glass-dark">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                  </div>
                }>
                  <Hire />
                </Suspense>
              </section>
              
              {/* Blog Section */}
              <section className="w-full relative z-10 glass-container">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                  </div>
                }>
                  <Blogs />
                </Suspense>
              </section>

              {/* Spacer */}
              <div className="h-20 md:h-32 lg:h-40" />
            </div>
          </div>
        </main>


      </>
    </VideoBackgroundContext.Provider>
  );
};

export default Home2; 