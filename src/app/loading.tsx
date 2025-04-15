'use client';

import { useEffect, useState } from 'react';

/**
 * Global loading component for the Next.js application
 * Shows during page transitions and chunk loading
 */
export default function Loading() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    // Only show the loader after a slight delay to avoid flashing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center" 
      role="status" 
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24" aria-hidden="true">
          {/* Spinner animation */}
          <div className="absolute inset-0 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-secondary-500 border-solid rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-4 border-b-4 border-purple-500 border-solid rounded-full animate-spin animate-delay-150"></div>
        </div>
        
        <div className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading content...</div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a moment</div>
      </div>
      
      {/* Add global styles for the animations */}
      <style jsx global>{`
        @keyframes reverse-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        .animate-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}
