"use client";
import { useEffect, useRef } from "react";
import HomeCourseSection from "@/components/sections/courses/HomeCourseSection";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

const HomeCoursesPage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, []);

  // Function that handles smooth scrolling to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <main 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pb-20"
    >
      {/* Navigation Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <Home size={14} />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">Featured Courses</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container max-w-[1440px] mx-auto px-4 pt-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-sm transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container max-w-[1440px] mx-auto px-4">
        <HomeCourseSection 
          CustomText="Our Learning Experiences"
          CustomDescription="Explore our diverse range of learning formats designed to fit your schedule and preferences. Choose between blended courses and live interactive sessions."
          scrollToTop={scrollToTop}
        />
      </div>

      {/* Newsletter Subscription */}
      <div className="container max-w-[1440px] mx-auto px-4 mt-28">
        <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated on New Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter to receive notifications when new courses are added to our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {/* <BackToTopButton onClick={scrollToTop} /> */}
    </main>
  );
};

export default HomeCoursesPage; 