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
import React, { useEffect, useRef, useState, useCallback } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// Define interfaces for component props and state
interface IHomeState {
  isLoaded: boolean;
  windowWidth: number;
  isInitialLoad: boolean;
  showScrollingVideo: boolean;
  scrollY: number;
  mounted: boolean;
}

// Enhanced glassmorphism styles for global use with theme support
const getGlobalStyles = (isDark: boolean) => `
  .global-glass-container {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .global-glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  .global-glass-light {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 2px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  
  .global-glass-dark {
    background: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 6px 28px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
  
  .scrolling-video-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.05) 30%,
      rgba(0, 0, 0, 0.02) 50%,
      rgba(0, 0, 0, 0.05) 70%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
  
  .section-blur {
    backdrop-filter: blur(8px);
  }
  
  .enhanced-parallax {
    transform: translateZ(0);
    will-change: transform;
  }
  
  @keyframes gentle-float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-6px) scale(1.01); }
  }
  
  @keyframes subtle-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 172, 99, 0.1); }
    50% { box-shadow: 0 0 30px rgba(59, 172, 99, 0.2); }
  }
  
  .animate-gentle-float {
    animation: gentle-float 8s ease-in-out infinite;
  }
  
  .animate-subtle-glow {
    animation: subtle-glow 4s ease-in-out infinite;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('global-glassmorphism-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'global-glassmorphism-styles';
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
  }
}

const Home2: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const homeRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<IHomeState>({
    isLoaded: false,
    windowWidth: 0,
    isInitialLoad: true,
    showScrollingVideo: false,
    scrollY: 0,
    mounted: false
  });
  
  const isDark = state.mounted ? theme === 'dark' : true; // Default to dark during SSR

  // Memoize the resize handler to prevent unnecessary re-renders
  const handleResize = useCallback((): void => {
    setState(prev => ({
      ...prev,
      windowWidth: window.innerWidth
    }));
  }, []);

  // Enhanced scroll handler for seamless video background
  const handleScroll = useCallback((): void => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Show scrolling video after scrolling past 30% of hero section
    setState(prev => ({
      ...prev,
      showScrollingVideo: scrollY > windowHeight * 0.3,
      scrollY: scrollY
    }));
  }, []);

  // Initial setup effect
  useEffect((): (() => void) => {
    // Prevent scroll during initial load
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Set initial window width
    setState(prev => ({
      ...prev,
      windowWidth: window.innerWidth
    }));

    // Add window resize listener
    window.addEventListener('resize', handleResize);
    // Add scroll listener for video background
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Reset scroll position
    if (typeof window !== 'undefined') {
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
        isInitialLoad: false
      }));
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [handleResize, handleScroll]);

  // Calculate dynamic spacing based on screen height
  const isLaptopHeight: boolean = typeof window !== 'undefined' && window.innerHeight <= 768;

  // Calculate video opacity based on scroll position
  const videoOpacity = Math.min(0.6, Math.max(0.2, (state.scrollY / (window.innerHeight * 2))));
  const videoScale = 1 + (state.scrollY * 0.0001); // Subtle parallax scaling

  return (
    <>
      {/* Global Seamless Video Background - Enhanced */}
      <div 
        className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none transition-all duration-1000 ease-out ${
          state.showScrollingVideo && state.isLoaded ? 'opacity-100 z-0' : 'opacity-0 -z-10'
        }`}
        style={{
          transform: `scale(${videoScale})`,
          opacity: videoOpacity
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover enhanced-parallax"
          style={{ 
            filter: 'brightness(0.3) contrast(1.3) saturate(1.2)',
            transform: `translateY(${state.scrollY * 0.5}px)` // Parallax effect
          }}
        >
          <source src="/video/1659171_Trapcode_Particles_3840x2160.mp4" type="video/mp4" />
        </video>
        
        {/* Enhanced scrolling overlay */}
        <div className="absolute inset-0 scrolling-video-overlay"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      <main 
        ref={homeRef}
        className={`min-h-screen flex flex-col relative transition-all duration-700 ${
          state.isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        } ${state.isInitialLoad ? 'overflow-hidden' : ''}`}
        style={{ position: 'relative', zIndex: 1 }}
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
          <div className={`flex flex-col gap-y-4 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 relative z-10 ${
            isLaptopHeight ? '-mt-4' : '-mt-8'
          }`}>
            {/* Courses Section - Enhanced Glassmorphism */}
            <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-1 md:py-2 laptop:py-3 relative z-10">
              <div className="max-w-[1366px] mx-auto global-glass-container rounded-2xl shadow-2xl animate-gentle-float">
                <div className="p-4 sm:p-6 md:p-8">
                  <HomeCourseSection
                    CustomText="Discover our comprehensive range of "
                    CustomDescription="Skill Development Courses"
                    hideGradeFilter
                  />
                </div>
              </div>
            </section>

            {/* Why Medh Section - Enhanced Glassmorphism */}
            <section className="w-full py-8 md:py-2 laptop:py-4 relative overflow-hidden z-10">
              <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
                <div className="global-glass-light rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl animate-gentle-float" style={{ animationDelay: '0.5s' }}>
                  <WhyMedh />
                </div>
              </div>
              {/* Subtle background enhancement */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none"></div>
            </section>

            {/* Join Medh Section - Enhanced Glassmorphism */}
            <section className="w-full py-8 md:py-5 laptop:py-6 relative overflow-hidden z-10">
              <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
                <div className="global-glass-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl animate-gentle-float animate-subtle-glow" style={{ animationDelay: '1s' }}>
                  <JoinMedh />
                </div>
              </div>
              {/* Dynamic background pattern */}
              <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/3 to-transparent pointer-events-none"></div>
            </section>

            {/* Hire Section - Enhanced Glassmorphism */}
            <section className="w-full py-8 md:py-5 laptop:py-6 relative overflow-hidden z-10">
              <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
                <div className="global-glass-dark rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl animate-gentle-float" style={{ animationDelay: '1.5s' }}>
                  <Hire />
                </div>
              </div>
              {/* Gradient enhancement */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-500/5 to-transparent pointer-events-none"></div>
            </section>
            
            {/* Blog Section - Enhanced Glassmorphism */}
            <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-3 laptop:py-4 relative z-10">
              <div className="max-w-[1366px] mx-auto global-glass-container rounded-2xl shadow-2xl animate-gentle-float" style={{ animationDelay: '2s' }}>
                <div className="p-4 sm:p-6 md:p-8">
                  <Blogs />
                </div>
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

          /* Enhanced responsive styles with glassmorphism considerations */
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
              backdrop-filter: blur(12px);
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
              backdrop-filter: blur(16px);
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
              backdrop-filter: blur(18px);
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
              backdrop-filter: blur(20px);
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
              backdrop-filter: blur(24px);
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
              backdrop-filter: blur(16px);
              border-radius: 1.5rem;
            }
          }

          /* Performance optimizations for glassmorphism */
          .global-glass-container,
          .global-glass-card,
          .global-glass-light,
          .global-glass-dark {
            transform: translateZ(0);
            will-change: transform, opacity;
            contain: layout style paint;
          }

          /* Smooth transitions for all glass elements */
          .global-glass-container:hover,
          .global-glass-card:hover,
          .global-glass-light:hover,
          .global-glass-dark:hover {
            transform: translateY(-2px) translateZ(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </main>
    </>
  );
};

export default React.memo(Home2); 