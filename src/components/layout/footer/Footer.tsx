"use client";
import React, { useState, useEffect } from "react";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import { usePathname } from "next/navigation";
import { useIsMobile, getHydrationSafeProps } from "@/utils/hydration";
import { useTheme } from "@/hooks/useTheme";

interface FooterProps {
  /**
   * Optional custom className
   */
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { isMobile, isClient } = useIsMobile(640);
  
  useEffect(() => {
    if (isClient) {
      setIsVisible(true);
    }
  }, [isClient]);

  // Theme-aware styling - use resolvedTheme which is typed as 'light' | 'dark'
  // Updated to blend with improved FooterNavList colors
  const currentTheme = resolvedTheme || 'dark'; // Default to dark if undefined
  const footerBg = currentTheme === 'light' ? 'bg-gray-200' : 'bg-slate-900';
  const footerBorder = currentTheme === 'light' ? 'border-gray-400' : 'border-slate-700';
  const loadingBg = currentTheme === 'light' ? 'bg-gray-300' : 'bg-slate-800';

  // Show a loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <footer 
        className={`w-full bg-gray-100 dark:bg-gray-950 ${className}`}
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-300 dark:bg-gray-800 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className={`w-full bg-gray-100 dark:bg-gray-950 border-t border-gray-300 dark:border-gray-800 ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      {...getHydrationSafeProps()}
    >
      {/* Main Footer Content */}
      <div className="w-full px-3 sm:px-4 lg:px-6 py-7">
        <FooterNavList theme={currentTheme} />
      </div>
      
      {/* Bottom Bar
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CopyRight />
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;

