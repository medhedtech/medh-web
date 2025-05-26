"use client";
import React, { useState, useEffect } from "react";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/images/logo/medh_logo-1.png";
import QRCode from "@/assets/images/footer/qr.png";
import { useIsMobile, getHydrationSafeProps } from "@/utils/hydration";

interface FooterProps {
  /**
   * Optional custom className
   */
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { isMobile, isClient } = useIsMobile(640);
  
  useEffect(() => {
    if (isClient) {
      // Add entrance animation effect with a slight delay
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  // Show a loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <footer 
        className={`w-full relative ${className}`}
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black dark:from-gray-950 dark:via-gray-950 dark:to-black z-0">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,rgba(76,175,80,0.15),rgba(0,0,0,0))]"></div>
        </div>
        <div className="relative z-10 w-full pt-10 pb-0 font-body">
          <div className="w-full backdrop-blur-sm bg-black/20 dark:bg-black/30 border-t border-white/5 py-6 md:py-8 shadow-xl">
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-700 rounded mb-6"></div>
                <div className="h-px bg-gray-700 my-5"></div>
                <div className="h-24 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className={`w-full relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      {...getHydrationSafeProps()}
    >
      {/* Enhanced modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black dark:from-gray-950 dark:via-gray-950 dark:to-black z-0 overflow-hidden">
        {/* Subtle animated radial gradient overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,rgba(76,175,80,0.15),rgba(0,0,0,0))]"></div>
        
        {/* Animated dot pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute w-full h-full" 
               style={{
                 backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                 backgroundSize: '30px 30px',
                 backgroundPosition: '0 0'
               }}>
          </div>
        </div>
      </div>
      
      {/* Enhanced accent line at top with animation */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-10" aria-hidden="true">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-70 animate-pulse"></div>
      </div>
      
      {/* Mobile-optimized or desktop footer based on viewport */}
      {isMobile ? (
        // Enhanced mobile footer - full width with glass-morphism effect
        <div className="relative z-10 w-full pt-6 pb-0 font-body">
          <div className="w-full backdrop-blur-sm bg-black/30 dark:bg-black/40 border-t border-white/5 px-3 py-4 shadow-lg">
            {/* Mobile footer main content */}
            <div className="relative">
              <FooterNavList logoImage={Logo} isMobile={true} />
            </div>
            
            {/* Improved divider with gradient */}
            <div className="h-px my-3 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            
            {/* Copyright section */}
            <CopyRight qrCodeImage={QRCode} isMobile={true} />
          </div>
        </div>
      ) : (
        // Enhanced desktop footer - full width with glass-morphism effect
        <div className="relative z-10 w-full pt-10 pb-0 font-body">
          <div className="w-full backdrop-blur-sm bg-black/20 dark:bg-black/30 border-t border-white/5 py-6 md:py-8 shadow-xl">
            {/* Enhanced glow effect for desktop */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent blur-xl" aria-hidden="true"></div>
            
            {/* Footer main content - centered with max width for readability */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
              <div className="relative">
                <FooterNavList logoImage={Logo} isMobile={false} />
              </div>
              
              {/* Improved divider with gradient */}
              <div className="h-px my-5 md:my-7 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              
              {/* Copyright section */}
              <CopyRight qrCodeImage={QRCode} isMobile={false} />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

