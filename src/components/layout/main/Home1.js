"use client";
import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import HomeCourseSection from "@/components/sections/courses/HomeCourseSection";
import Hero1 from "@/components/sections/hero-banners/Hero1";
import Hire from "@/components/sections/hire/Hire";
import JoinMedh from "@/components/sections/hire/JoinMedh";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";

const Home1 = () => {
  const router = useRouter();
  const homeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Scroll to top ONLY when component mounts (page first loads)
  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add window resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    // Smooth scroll to top with fallback
    const smoothScrollToTop = () => {
      try {
        window.scrollTo({
          top: 0,
          behavior: "instant" // Use instant for initial load
        });
      } catch (error) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    smoothScrollToTop();

    // Alternative approach using ref if window.scrollTo doesn't work
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ 
        behavior: 'instant', 
        block: 'start' 
      });
    }

    // Set loaded state after a small delay for animations
    const timer = setTimeout(() => setIsLoaded(true), 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array for mount-only execution
  
  // Function that only scrolls to top on initial load
  const initialScrollToTop = () => {
    // Only runs on component mount, not on filter changes
  };

  // Calculate dynamic spacing based on screen height
  const isLaptopHeight = typeof window !== 'undefined' && window.innerHeight <= 768;
  
  return (
    <main 
      ref={homeRef}
      className={`min-h-screen flex flex-col relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-all duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Enhanced Background Elements - Optimized for 1366x768 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-56 md:w-72 h-56 md:h-72 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-56 md:w-72 h-56 md:h-72 bg-secondary-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-56 md:w-72 h-56 md:h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle_at_center,white,transxparent_80%)] opacity-5"></div>
      </div>

      {/* Hero Section with optimized height for 1366x768 */}
      <section className="w-full relative">
        <div className={`w-full`}>
          <Hero1 isCompact={isLaptopHeight} />
        </div>
      </section>

      {/* Main Content Sections with optimized spacing for 1366x768 */}
      <div className={`flex flex-col gap-y-4 sm:gap-y- md:gap-y-8 lg:gap-y-10 relative z-10 ${
        isLaptopHeight ? 'mt-0' : 'mt-0'
      }`}>
        {/* Courses Section - Optimized padding for 1366x768 */}
        <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-2 md:py-3 laptop:py-4">
          <div className="max-w-[1366px] mx-auto">
            <HomeCourseSection
              CustomText="Discover our comprehensive range of "
              CustomDescription="Skill Development Courses"
              scrollToTop={initialScrollToTop}
              hideGradeFilter
            />
          </div>
        </section>

        {/* Why Medh Section - Optimized for 1366x768 */}
        <section className="w-full bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900/80 dark:via-gray-950 dark:to-gray-900/80 backdrop-blur-sm py-8 md:py-2 laptop:py-4 relative overflow-hidden">
          {/* <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10"> */}
            <WhyMedh />
          {/* </div> */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent"></div> */}
        </section>

        {/* Browse Categories Section - Optimized for 1366x768
        <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 laptop:py-6">
          <div className="max-w-[1366px] mx-auto">
            <BrowseCategories />
          </div>
        </section> */}

        {/* Join Medh Section - Optimized for 1366x768 */}
        <section className="w-full bg-gradient-to-r from-primary-50/90 via-white to-primary-50/90 dark:from-gray-900/90 dark:via-gray-950 dark:to-gray-900/90 backdrop-blur-sm py-8 md:py-5 laptop:py-6 relative overflow-hidden">
          <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
            <JoinMedh />
          </div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5"></div>
        </section>


        {/* Hire Section - Optimized for 1366x768 */}
        <section className="w-full bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 dark:from-gray-900/90 dark:via-gray-950 dark:to-gray-900/90 backdrop-blur-sm py-8 md:py-5 laptop:py-6 relative overflow-hidden">
          <div className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
            <Hire />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-500/5 to-transparent"></div>
        </section>
      </div>
      
      {/* Blog Section - Optimized for 1366x768 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-3 laptop:py-4">
          <div className="max-w-[1366px] mx-auto">
            <Blogs />
          </div>
        </section>

      {/* Enhanced animations and responsive styles - Optimized for 1366x768 */}
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

        /* Optimized responsive styles for 1366x768 */
        @media (max-width: 640px) {
          .section {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .section {
            padding-left: 1rem;
            padding-right: 1rem;
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
        }

        @media (min-width: 1025px) and (max-width: 1366px) {
          .section {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

        }

        @media (min-width: 1367px) {
          .section {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* Specific optimizations for 1366x768 */
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
        }
      `}</style>
    </main>
  );
};

export default Home1;

