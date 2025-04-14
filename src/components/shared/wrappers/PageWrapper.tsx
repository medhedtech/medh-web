"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Initialize smooth scroll behavior for all anchor links
    const handleSmoothScroll = (e: MouseEvent): void => {
      const target = (e.target as Element).closest('a[href^="#"]');
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

    document.addEventListener('click', handleSmoothScroll as EventListener);
    
    // Set page as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll as EventListener);
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
    </div>
  );
};

export default PageWrapper; 