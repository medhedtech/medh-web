"use client";
import React, { useEffect, useState, useRef } from "react";
import About11 from "@/components/sections/abouts/About11";
import AboutContent from "@/components/sections/abouts/AboutContent";
import AtMedh from "@/components/sections/abouts/AtMedh";
import WhoWeAre from "@/components/sections/abouts/WhoWeAre";
import WhyChooseMEDH from "@/components/sections/abouts/WhyChooseMEDH";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import HeroSectionContant from "@/components/sections/hero-banners/HeroSectionContant";
import Overview from "@/components/sections/overviews/Overview";
import Testimonials from "@/components/sections/testimonials/Testimonials";

const AboutMain = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // References for each section for scroll tracking
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const atMedhRef = useRef(null);
  const whoWeAreRef = useRef(null);
  const whyChooseRef = useRef(null);
  
  // Handle scroll events for animations and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage for potential progress bar
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      
      // Determine active section based on scroll position
      const sections = [
        { ref: heroRef, id: "hero" },
        { ref: aboutRef, id: "about" },
        { ref: atMedhRef, id: "atMedh" },
        { ref: whoWeAreRef, id: "whoWeAre" },
        { ref: whyChooseRef, id: "whyChoose" }
      ];
      
      // Find the current section in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              // You could push to browser history here to update URL without reload
              // window.history.pushState(null, null, `#${section.id}`);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);
  
  // Handle initial animations and potentially scroll to hash on load
  useEffect(() => {
    // Set loaded state for animations
    setIsLoaded(true);
    
    // If URL has a hash, scroll to that section
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
    
    // Prefetch content for better performance
    const prefetchImages = () => {
      // You could add logic here to prefetch important images
    };
    prefetchImages();
  }, []);
  
  // Scroll to section function for navigation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main 
      className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-hidden"
      aria-label="About Medh main content"
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      />
      
      {/* Background Elements with improved animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-6000"></div>
      </div>

      {/* Loading Indicator - shows only during initial load */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Main Content Container with width constraints */}
      <div className="relative">
        {/* Hero Section with Animation - Improved header padding */}
        <div className="px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black/10 to-transparent dark:from-black/20">
          <div className="max-w-7xl mx-auto">
            <section 
              ref={heroRef}
              id="hero"
              className={`pt-20 pb-12 md:pt-28 md:pb-16 lg:pt-36 lg:pb-20 z-10 relative transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              aria-labelledby="hero-heading"
            >
              <HeroSectionContant />
            </section>
          </div>
        </div>

        {/* Content Sections with proper width constraints */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Content with Fade In */}
          <section 
            ref={aboutRef}
            id="about"
            className={`mt-20 md:mt-28 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            aria-labelledby="about-heading"
          >
            <div className="mx-auto">
              <AboutContent />
            </div>
          </section>

          {/* At Medh Section with Slide In */}
          <section 
            ref={atMedhRef}
            id="atMedh"
            className={`mt-20 md:mt-28 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            aria-labelledby="atmedh-heading"
          >
            <div className="mx-auto">
              <AtMedh />
            </div>
          </section>

          {/* Who We Are Section with Fade Up */}
          <section 
            ref={whoWeAreRef}
            id="whoWeAre"
            className="relative overflow-hidden mt-20 md:mt-28"
            aria-labelledby="whoweare-heading"
          >
            <div className={`transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mx-auto">
                <WhoWeAre />
              </div>
            </div>
          </section>
        </div>

        {/* Why Choose MEDH Section with Scale In - Full width but with internal content constraints */}
        <section 
          ref={whyChooseRef}
          id="whyChoose"
          className="relative bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 mt-20 md:mt-28 pb-20 md:pb-28"
          aria-labelledby="whychoose-heading"
        >
          <div className={`transform transition-all duration-1000 delay-900 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <WhyChooseMEDH />
            </div>
          </div>
        </section>

        {/* Quick Navigation - Fixed buttons for easy navigation between sections */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 md:hidden">
          <button 
            onClick={() => scrollToSection('hero')} 
            className={`p-2 rounded-full ${activeSection === 'hero' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
            aria-label="Navigate to Hero section"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
          <button 
            onClick={() => scrollToSection('whyChoose')} 
            className={`p-2 rounded-full ${activeSection === 'whyChoose' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
            aria-label="Navigate to Why Choose Medh section"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Optional Sections with proper width constraints */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <section className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 mt-20 md:mt-28">
            <About11 />
          </section> */}

          {/* <section className="relative overflow-hidden mt-20 md:mt-28">
            <Overview />
          </section> */}

          {/* <section className="bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 mt-20 md:mt-28">
            <FeatureCourses
              title={
                <>
                  Choose The Best Package <br />
                  For your Learning
                </>
              }
              course="2"
              subTitle="Popular Courses"
            />
          </section> */}

          {/* <section className="relative overflow-hidden mt-20 md:mt-28">
            <Testimonials />
          </section>

          <section className="bg-white dark:bg-gray-900 mt-20 md:mt-28">
            <Brands />
          </section> */}
        </div>
      </div>
    </main>
  );
};

export default AboutMain;
