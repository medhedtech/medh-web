"use client";
import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs2";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import HomeCourseSection from "@/components/sections/courses/HomeCourseSection2";
import Hero2 from "@/components/sections/hero-banners/Hero2";
import Hire from "@/components/sections/hire/Hire2";
import JoinMedh from "@/components/sections/hire/JoinMedh2";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh2";
import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// Create a context for sharing the video background
export interface VideoBackgroundContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoaded: boolean;
  isDark: boolean;
}

export const VideoBackgroundContext = createContext<VideoBackgroundContextType>({
  videoRef: { current: null },
  isLoaded: false,
  isDark: true
});

// Define interfaces for component props and state
interface IHomeState {
  isLoaded: boolean;
  windowWidth: number;
  isInitialLoad: boolean;
  showScrollingVideo: boolean;
  scrollY: number;
  mounted: boolean;
}

// Enhanced glassmorphism styles for global use with theme support - lighter borders
const getGlobalStyles = (isDark: boolean) => `
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
  
  .constant-video-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.03) 0%,
      rgba(0, 0, 0, 0.015) 30%,
      rgba(0, 0, 0, 0.01) 50%,
      rgba(0, 0, 0, 0.015) 70%,
      rgba(0, 0, 0, 0.03) 100%
    );
  }
  
  .light-video-overlay {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(255, 255, 255, 0.01) 30%,
      rgba(255, 255, 255, 0.005) 50%,
      rgba(255, 255, 255, 0.01) 70%,
      rgba(255, 255, 255, 0.02) 100%
    );
  }
  
  .section-blur {
    backdrop-filter: blur(4px);
  }
  
  .static-video {
    transform: translateZ(0);
    will-change: auto;
  }
  

`;

const Home2: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<IHomeState>({
    isLoaded: false,
    windowWidth: 0,
    isInitialLoad: true,
    showScrollingVideo: true, // Start with video visible
    scrollY: 0,
    mounted: false
  });
  
  const isDark = state.mounted ? theme === 'dark' : true; // Default to dark during SSR

  // Memoize the resize handler to prevent unnecessary re-renders
  const handleResize = useCallback((): void => {
    if (typeof window !== 'undefined') {
      setState(prev => ({
        ...prev,
        windowWidth: window.innerWidth
      }));
    }
  }, []);

  // Scroll handler - only for tracking scroll position (video stays fixed)
  const handleScroll = useCallback((): void => {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY;
      
      // Video remains completely static, only track scroll for other purposes
      setState(prev => ({
        ...prev,
        showScrollingVideo: true, // Always show video
        scrollY: scrollY
      }));
    }
  }, []);

  // Initial setup effect
  useEffect((): (() => void) => {
    setState(prev => ({
      ...prev,
      mounted: true
    }));

    // Prevent scroll during initial load
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Set initial window width
    if (typeof window !== 'undefined') {
      setState(prev => ({
        ...prev,
        windowWidth: window.innerWidth
      }));

      // Add window resize listener
      window.addEventListener('resize', handleResize);
      // Add scroll listener (minimal - video stays static)
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Reset scroll position
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    // Enable smooth loading transition
    const loadTimer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoaded: true,
        isInitialLoad: false,
        showScrollingVideo: true // Show video immediately after loading
      }));
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(loadTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [handleResize, handleScroll]);

  // Inject global styles only on client side
  useEffect(() => {
    if (typeof document !== 'undefined' && state.mounted) {
      const existingStyle = document.getElementById('global-glassmorphism-styles');
      if (!existingStyle) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'global-glassmorphism-styles';
        styleSheet.innerText = getGlobalStyles(isDark);
        document.head.appendChild(styleSheet);
      }
    }
  }, [isDark, state.mounted]);

  // Calculate dynamic spacing based on screen height (client-side only)
  const isLaptopHeight: boolean = state.mounted && typeof window !== 'undefined' ? window.innerHeight <= 768 : false;

  // Dynamic video opacity based on theme for better visibility
  const videoOpacity = isDark ? 0.7 : 0.8;
  const videoScale = 1; // No scaling - video remains completely static

  // Don't render until mounted to avoid hydration mismatch
  if (!state.mounted) {
    return (
      <main className="min-h-screen flex flex-col relative bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </main>
    );
  }

  return (
    <VideoBackgroundContext.Provider value={{ videoRef, isLoaded: state.isLoaded, isDark }}>
      <>
        {/* Global Static Video Background - Completely Fixed */}
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{
            opacity: state.mounted ? videoOpacity : 0
          }}
        >
          <video
            ref={videoRef}
            key={`background-video-${isDark ? 'dark' : 'light'}`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover static-video"
            style={{ 
              filter: isDark 
                ? 'brightness(0.4) contrast(1.3) saturate(0.9) hue-rotate(12deg)' 
                : 'brightness(1.1) contrast(0.9) saturate(0.8) hue-rotate(-5deg)'
            }}
          >
            <source src={isDark ? "https://d2cxn2x1vtrou8.cloudfront.net/Website/1659171_Trapcode_Particles_3840x2160.mp4" : "https://d2cxn2x1vtrou8.cloudfront.net/Website/0_Wind_Flowing_3840x2160.mp4"} type="video/mp4" />
          </video>
          
          {/* Fully transparent overlay - no interference with video colors */}
        </div>

        <main 
          ref={homeRef}
          className={`min-h-screen flex flex-col relative transition-all duration-700 ${
            state.isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${state.isInitialLoad ? 'overflow-hidden' : ''}`}
          style={{ position: 'relative', zIndex: 10 }}
        >
          {/* Content Container - Enhanced with glassmorphism */}
          <div className={`flex flex-col w-full transition-all duration-700 relative z-10 ${
            state.isLoaded ? 'translate-y-0' : 'translate-y-4'
          }`}>
            {/* Hero Section - No additional background needed */}
            <section className="w-full relative -mt-4 md:-mt-6 lg:-mt-8">
              <div className="w-full">
                <Hero2 isCompact={isLaptopHeight} />
              </div>
            </section>

            {/* Main Content Sections with Enhanced Glassmorphism */}
            <div className={`flex flex-col relative z-10 ${
              isLaptopHeight ? '-mt-4' : '-mt-8'
            }`}>
              {/* Courses Section - Edge to Edge with Glassmorphism */}
              <section className="w-full relative z-10">
                <div className="w-full global-glass-container">
                  <HomeCourseSection
                    CustomText="Discover our comprehensive range of "
                    CustomDescription="Skill Development Courses"
                    hideGradeFilter
                  />
                </div>
              </section>

              {/* Why Medh Section - Edge to Edge */}
              <section className="w-full relative overflow-hidden z-10">
                <div className="w-full global-glass-light">
                  <WhyMedh />
                </div>
                {/* Subtle background enhancement */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none"></div>
              </section>

              {/* Join Medh Section - Edge to Edge */}
              <section className="w-full relative overflow-hidden z-10">
                <div className="w-full global-glass-card animate-gentle-float animate-subtle-glow" style={{ animationDelay: '1s' }}>
                  <JoinMedh />
                </div>
                {/* Dynamic background pattern */}
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/3 to-transparent pointer-events-none"></div>
              </section>

              {/* Hire Section - Edge to Edge */}
              <section className="w-full relative overflow-hidden z-10">
                <div className="w-full global-glass-dark animate-gentle-float" style={{ animationDelay: '1.5s' }}>
                  <Hire />
                </div>
                {/* Gradient enhancement */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-500/5 to-transparent pointer-events-none"></div>
              </section>
              
              {/* Blog Section - Edge to Edge */}
              <section className="w-full relative z-10">
                <div className="w-full global-glass-container animate-gentle-float" style={{ animationDelay: '2s' }}>
                  <Blogs />
                </div>
              </section>

              {/* Bottom Spacer for Better Scroll Experience */}
              <div className="h-20 md:h-32 lg:h-40"></div>
            </div>
          </div>

          {/* Enhanced responsive styles with glassmorphism optimizations */}
          <style jsx>{`
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(20px, -30px) scale(1.1);
              }
              66% {
                transform: translate(-15px, 15px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }

            .animate-blob {
              animation: blob 7s infinite;
            }

            .animation-delay-2000 {
              animation-delay: 2s;
            }

            .animation-delay-4000 {
              animation-delay: 4s;
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(15px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fade-in-up {
              animation: fadeInUp 0.4s ease-out forwards;
            }

            /* Enhanced responsive styles with glassmorphism considerations - reduced blur values */
            @media (max-width: 640px) {
              .section {
                padding-left: 0.75rem;
                padding-right: 0.75rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                border-radius: 1rem;
                backdrop-filter: blur(6px);
              }
            }

            @media (min-width: 641px) and (max-width: 768px) {
              .section {
                padding-left: 1rem;
                padding-right: 1rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                backdrop-filter: blur(8px);
              }
            }

            @media (min-width: 769px) and (max-width: 1024px) {
              .section {
                padding-left: 1.25rem;
                padding-right: 1.25rem;
                margin-bottom: 0.5rem;
              }
              .section + .section {
                margin-top: 0.75rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                backdrop-filter: blur(10px);
              }
            }

            @media (min-width: 1025px) and (max-width: 1366px) {
              .section {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                backdrop-filter: blur(10px);
              }
            }

            @media (min-width: 1367px) {
              .section {
                padding-left: 2rem;
                padding-right: 2rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                backdrop-filter: blur(10px);
              }
            }

            /* Specific optimizations for 1366x768 with glassmorphism */
            @media (min-width: 1024px) and (max-height: 768px) {
              .main-content {
                padding: 1rem 1.5rem;
              }
              .section {
                margin-bottom: 0.75rem;
              }
              .section + .section {
                margin-top: 1rem;
              }
              .global-glass-container,
              .global-glass-card,
              .global-glass-light,
              .global-glass-dark {
                padding: 1.5rem;
                backdrop-filter: blur(8px);
              }
            }
          `}</style>
        </main>
      </>
    </VideoBackgroundContext.Provider>
  );
};

export default Home2; 