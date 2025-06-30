"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import custom hooks from consolidated file
import {
  useScrollToTop,
  useSmoothAnchorScroll,
  useScrollVisibility,
  useDynamicFooterHeight
} from "@/hooks/useScrolling";
import { useDocumentBodyReset, useFixBodyClasses } from "@/hooks/useDocumentBodyReset";

interface PageWrapperProps {
  children: ReactNode;
  /**
   * Skip to content ID for accessibility
   */
  skipToContentId?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children,
  skipToContentId = "main-content" 
}) => {
  const [hasPageLoaded, setHasPageLoaded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use custom hooks for better separation of concerns
  const scrollToTop = useScrollToTop();
  const handleSmoothScroll = useSmoothAnchorScroll();
  const showScrollTop = useScrollVisibility(300);
  
  // Fix body styling issues
  useDocumentBodyReset();
  useFixBodyClasses();
  
  // Handle dynamic footer height
  useDynamicFooterHeight(contentRef);



  // Effect for smooth scroll anchor handling
  useEffect(() => {
    // Add event listeners
    document.addEventListener('click', handleSmoothScroll as EventListener);
    
    // Set page as loaded after a small delay for smoother transitions
    const timer = setTimeout(() => {
      setHasPageLoaded(true);
    }, 100);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll as EventListener);
      clearTimeout(timer);
    };
  }, [handleSmoothScroll]);

  // Keyboard shortcut for scroll to top (Alt+ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowUp') {
        scrollToTop();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToTop]);



  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* CSS Variables for layout measurements */}
      <style jsx global>{`
        :root {
          --header-height: 64px;
          --footer-margin: 0px;
        }
        
        @media (min-width: 768px) {
          :root {
            --header-height: 80px;
          }
        }

        /* Ensure proper stacking context */
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        /* Optimize scrolling performance */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar but keep functionality */
        body {
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        
        /* Dark mode scrollbar */
        .dark ::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
        }
        
        /* Auto-collapse long sections for better UX */
        @media (max-width: 768px) {
          .collapse-mobile {
            max-height: 300px;
            overflow: hidden;
            position: relative;
          }
          
          .collapse-mobile.expanded {
            max-height: none;
          }
          
          .collapse-mobile:not(.expanded)::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(to bottom, transparent, white);
            pointer-events: none;
          }
          
          .dark .collapse-mobile:not(.expanded)::after {
            background: linear-gradient(to bottom, transparent, rgb(17, 24, 39));
          }
        }
      `}</style>

      {/* Skip to content link for accessibility */}
      <a 
        href={`#${skipToContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary-500 focus:text-white focus:top-0 focus:left-0"
      >
        Skip to content
      </a>
      
      {/* Header - Fixed height */}
      <Header className="h-[var(--header-height)]" />



      {/* Main content with dynamic min-height */}
      <main 
        ref={contentRef}
        id={skipToContentId}
        role="main"
        tabIndex={-1}
        className={`flex-grow w-full transition-opacity duration-700 pt-[var(--header-height)] will-change-opacity ${hasPageLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      
      {/* Footer with theme prop */}
              <Footer />
    </div>
  );
};

export default PageWrapper; 