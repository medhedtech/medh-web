"use client";
import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import Hero1 from "@/components/sections/hero-banners/Hero1";
import Hire from "@/components/sections/hire/Hire";
import JoinMedh from "@/components/sections/hire/JoinMedh";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh";
import React, { useEffect, useRef } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";

const Home1 = () => {
  const router = useRouter();
  const homeRef = useRef(null);

  // Scroll to top ONLY when component mounts (page first loads)
  useEffect(() => {
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
  }, []); // Empty dependency array for mount-only execution
  
  // Function that only scrolls to top on initial load
  const initialScrollToTop = () => {
    // Only runs on component mount, not on filter changes
  };
  
  return (
    <main 
      ref={homeRef}
      className="min-h-screen flex flex-col relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"
    >
      {/* Hero Section with full-width container */}
      <section className="w-full">
        <Hero1 />
      </section>

      {/* Main Content Sections with consistent spacing */}
      <div className="flex flex-col gap-y-24 md:gap-y-32">
        {/* Courses Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1920px] mx-auto">
            <CoursesFilter
              CustomText="Skill Development Courses"
              scrollToTop={initialScrollToTop}
              hideGradeFilter
            />
          </div>
        </section>

        {/* Why Medh Section */}
        <section className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 
          dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <WhyMedh />
          </div>
        </section>

        {/* Browse Categories Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1920px] mx-auto">
            <BrowseCategories />
          </div>
        </section>

        {/* Join Medh Section with enhanced background */}
        <section className="w-full bg-gradient-to-r from-primary-50 via-white to-primary-50 
          dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <JoinMedh />
          </div>
        </section>

        {/* Blog Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1920px] mx-auto">
            <Blogs />
          </div>
        </section>

        {/* Hire Section with gradient background */}
        <section className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 
          dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <Hire />
          </div>
        </section>
      </div>
      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @media (min-width: 1024px) {
          .main-content {
            padding: 2rem 4rem;
          }
          .section {
            margin-bottom: 3rem;
          }
        }

        .section {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .section + .section {
          margin-top: 2rem;
        }
      `}</style>
    </main>
  );
};

export default Home1;
