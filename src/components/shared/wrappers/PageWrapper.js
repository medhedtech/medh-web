"use client";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import Scrollup from "../others/Scrollup";
import { useState, useEffect } from "react";

const PageWrapper = ({ children }) => {
  const [pageLoaded, setPageLoaded] = useState(false);
  
  useEffect(() => {
    // Function to handle smooth scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      });
    };

    // Handle initial page load
    const handleLoad = () => {
      scrollToTop();
      setPageLoaded(true);
    };

    // Add event listeners
    window.addEventListener('load', handleLoad);
    
    // Initialize smooth scroll behavior for all anchor links
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      const id = target.getAttribute('href');
      if (!id || id === '#') return;

      const element = document.querySelector(id);
      if (!element) return;

      e.preventDefault();
      const yOffset = -80; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      });
    };

    document.addEventListener('click', handleSmoothScroll);
    
    // Simulate a small delay for smoother transitions
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('click', handleSmoothScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950" role="main">
      {/* header */}
      <Header />

      {/* main content */}
      <main 
        className={`flex-grow transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      
      {/* footer - positioned at the bottom with no margin above it */}
      <Footer />
      
      {/* scroll to top button */}
      <Scrollup />
    </div>
  );
};

export default PageWrapper;
