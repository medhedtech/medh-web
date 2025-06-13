"use client";
import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import HomeCourseSection from "@/components/sections/courses/HomeCourseSection2";
import Hero2 from "@/components/sections/hero-banners/Hero2";
import Hire from "@/components/sections/hire/Hire2";
import JoinMedh from "@/components/sections/hire/JoinMedh2";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh2";
import React, { useEffect, useRef, useState, useCallback, createContext, useContext, useMemo } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// Server-side optimized video configuration
interface IVideoConfig {
  primary: string;
  fallback: string;
  poster?: string;
  preload: 'none' | 'metadata' | 'auto';
}

interface IServerVideoProps {
  darkMobile: IVideoConfig;
  darkDesktop: IVideoConfig;
  lightMobile: IVideoConfig;
  lightDesktop: IVideoConfig;
}

// Enhanced server-side video configuration with compression optimization
const SERVER_VIDEO_CONFIG: IServerVideoProps = {
  darkMobile: {
    primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4",
    preload: 'metadata'
  },
  darkDesktop: {
    primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark+1080.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/Dark.mp4",
    preload: 'metadata'
  },
  lightMobile: {
    primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4",
    preload: 'metadata'
  },
  lightDesktop: {
    primary: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white1.mp4",
    fallback: "https://medhdocuments.s3.ap-south-1.amazonaws.com/Website/white2.mp4",
    preload: 'metadata'
  }
};

// Server-side optimized context
export interface VideoBackgroundContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoaded: boolean;
  isDark: boolean;
  isMobile: boolean;
  videoConfig: IVideoConfig;
}

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true,
  isMobile: false,
  videoConfig: SERVER_VIDEO_CONFIG.darkDesktop
});

// Optimized state interface
interface IHomeState {
  isLoaded: boolean;
  isMobile: boolean;
  mounted: boolean;
  windowWidth: number;
}

// Server-side style generation function - moved to reduce client bundle
const generateGlassmorphismStyles = (isDark: boolean): string => `
  .global-glass-container {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.08)' 
      : 'rgba(255, 255, 255, 0.08)'
    };
    backdrop-filter: blur(25px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.25)'
    };
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 16px 64px rgba(0, 0, 0, 0.08)' 
        : '0 8px 32px rgba(0, 0, 0, 0.06), 0 16px 64px rgba(0, 0, 0, 0.02)'
      },
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.35)'
      },
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.18)'
      };
    position: relative;
  }
  
  .global-glass-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.10)' 
      : 'rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.70), rgba(255, 255, 255, 0.85)'
    });
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .global-glass-card {
    background: ${isDark ? 'rgba(126, 127, 135, 0.06)' : 'rgba(255, 255, 255, 0.06)'};
    backdrop-filter: blur(6px);
    box-shadow: 
      ${isDark ? '0 6px 28px rgba(126, 127, 135, 0.15), 0 12px 56px rgba(0, 0, 0, 0.1)' : '0 6px 28px rgba(126, 127, 135, 0.08), 0 12px 56px rgba(126, 127, 135, 0.04)'},
      inset 0 1px 0 ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.4)'};
  }
  
  .global-glass-light {
    background: ${isDark ? 'rgba(126, 127, 135, 0.04)' : 'rgba(255, 255, 255, 0.08)'};
    backdrop-filter: blur(4px);
    box-shadow: 
      ${isDark ? '0 4px 20px rgba(126, 127, 135, 0.12), 0 8px 40px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(126, 127, 135, 0.06), 0 8px 40px rgba(126, 127, 135, 0.03)'},
      inset 0 1px 0 ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)'};
  }
  
  .global-glass-dark {
    background: ${isDark ? 'rgba(126, 127, 135, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
    backdrop-filter: blur(6px);
    box-shadow: 
      ${isDark ? '0 8px 32px rgba(126, 127, 135, 0.18), 0 16px 64px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(126, 127, 135, 0.10), 0 16px 64px rgba(126, 127, 135, 0.05)'},
      inset 0 1px 0 ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.4)'};
  }
  
  .optimized-video {
    transform: translateZ(0);
    will-change: auto;
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  .performance-optimized {
    contain: layout style paint;
    content-visibility: auto;
  }
`;

// Utility function for debouncing
const debounce = (func: Function, wait: number): Function => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Home2: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [state, setState] = useState<IHomeState>({
    isLoaded: false,
    isMobile: false,
    mounted: false,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024
  });
  
  const isDark = state.mounted ? theme === 'dark' : true;

  // Optimized device detection with fallbacks
  const deviceInfo = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, deviceType: 'desktop' as const };
    }
    
    const width = state.windowWidth;
    const isMobile = width < 768;
    
    return {
      isMobile,
      deviceType: isMobile ? 'mobile' as const : 'desktop' as const
    };
  }, [state.windowWidth]);

  // Server-side optimized video configuration selection
  const videoConfig = useMemo((): IVideoConfig => {
    const configKey = `${isDark ? 'dark' : 'light'}${deviceInfo.deviceType === 'mobile' ? 'Mobile' : 'Desktop'}` as keyof IServerVideoProps;
    return SERVER_VIDEO_CONFIG[configKey];
  }, [isDark, deviceInfo.deviceType]);

  // Optimized resize handler with debouncing
  const handleResize = useCallback((): void => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    setState(prev => ({
      ...prev,
      windowWidth: width,
      isMobile: width < 768
    }));
  }, []);

  // Simplified initialization - removed async complications
  useEffect(() => {
    let mounted = true;
    
    // Set mounted state immediately
    setState(prev => ({ ...prev, mounted: true }));

    // Set initial window width
    if (typeof window !== 'undefined') {
      setState(prev => ({
        ...prev,
        windowWidth: window.innerWidth,
        isMobile: window.innerWidth < 768
      }));

      // Add debounced resize listener
      const debouncedResize = debounce(handleResize, 100);
      window.addEventListener('resize', debouncedResize as EventListener, { passive: true });

      // Cleanup
      return () => {
        mounted = false;
        window.removeEventListener('resize', debouncedResize as EventListener);
      };
    }

    return () => {
      mounted = false;
    };
  }, [handleResize]);

  // Quick loading sequence - simplified
  useEffect(() => {
    if (!state.mounted) return;

    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, isLoaded: true }));
    }, 100);

    return () => clearTimeout(timer);
  }, [state.mounted]);

  // Server-side style injection with optimization
  useEffect(() => {
    if (!state.mounted) return;

    const styleId = 'server-optimized-glassmorphism';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      existingStyle = document.createElement("style");
      existingStyle.id = styleId;
      document.head.appendChild(existingStyle);
    }
    
    existingStyle.textContent = generateGlassmorphismStyles(isDark);
  }, [isDark, state.mounted]);

  // Video opacity optimization
  const videoOpacity = isDark ? 0.7 : 0.8;

  // Simplified loading state - show content even if not fully loaded
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
      isMobile: deviceInfo.isMobile,
      videoConfig 
    }}>
      <>
        {/* Server-optimized video background */}
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 performance-optimized"
          style={{ opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            key={`optimized-video-${isDark ? 'dark' : 'light'}-${deviceInfo.deviceType}`}
            autoPlay
            muted
            loop
            playsInline
            preload={videoConfig.preload}
            className="absolute inset-0 w-full h-full object-cover optimized-video"
            style={{ 
              filter: isDark 
                ? 'brightness(0.4) contrast(1.3) saturate(0.9) hue-rotate(12deg)' 
                : 'brightness(1.1) contrast(0.9) saturate(0.8) hue-rotate(-5deg)'
            }}
            onError={(e) => {
              // Fallback to secondary video source
              if (videoRef.current && videoRef.current.src === videoConfig.primary) {
                videoRef.current.src = videoConfig.fallback;
              }
            }}
          >
            <source src={videoConfig.primary} type="video/mp4" />
            <source src={videoConfig.fallback} type="video/mp4" />
          </video>
        </div>

        <main 
          ref={homeRef}
          className={`min-h-screen flex flex-col relative transition-all duration-500 performance-optimized ${
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

            {/* Main Content Sections with Server-optimized Glassmorphism */}
            <div className="flex flex-col relative z-10 -mt-8">
              {/* Courses Section */}
              <section className="w-full relative z-10 performance-optimized">
                <div className="w-full global-glass-container">
                  <HomeCourseSection
                    CustomText="Discover our comprehensive range of "
                    CustomDescription="Skill Development Courses"
                    hideGradeFilter
                  />
                </div>
              </section>

              {/* Why Medh Section */}
              <section className="w-full relative overflow-hidden z-10 performance-optimized">
                <div className="w-full global-glass-light">
                  <WhyMedh />
                </div>
              </section>

              {/* Join Medh Section */}
              <section className="w-full relative overflow-hidden z-10 performance-optimized">
                <div className="w-full global-glass-card">
                  <JoinMedh />
                </div>
              </section>

              {/* Hire Section */}
              <section className="w-full relative overflow-hidden z-10 performance-optimized">
                <div className="w-full global-glass-dark">
                  <Hire />
                </div>
              </section>
              
              {/* Blog Section */}
              <section className="w-full relative z-10 performance-optimized">
                <div className="w-full global-glass-container">
                  <Blogs />
                </div>
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