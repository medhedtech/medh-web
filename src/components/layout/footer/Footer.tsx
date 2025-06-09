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
        <div className="relative z-10 w-full pt-16 pb-0 font-body">
          <div className="w-full backdrop-blur-sm bg-black/20 dark:bg-black/30 border-t border-white/5 py-10 md:py-12 shadow-xl">
            <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-20">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-700 rounded-2xl mb-10"></div>
                <div className="h-px bg-gray-700 my-8"></div>
                <div className="h-40 bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className={`w-full relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      {...getHydrationSafeProps()}
    >
      {/* Enhanced modern gradient background with improved depth and character spacing */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black dark:from-gray-950 dark:via-gray-950 dark:to-black z-0 overflow-hidden">
        {/* Enhanced animated radial gradient overlay */}
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(76,175,80,0.25),rgba(0,0,0,0))]"></div>
        
        {/* Enhanced animated dot pattern with better visibility and spacing */}
        <div className="absolute inset-0 opacity-15" aria-hidden="true">
          <div className="absolute w-full h-full" 
               style={{
                 backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
                 backgroundSize: '50px 50px',
                 backgroundPosition: '0 0'
               }}>
          </div>
        </div>
        
        {/* Additional enhanced mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(76,175,80,0.15),transparent_50%)]" aria-hidden="true"></div>
        
        {/* Subtle animated gradient waves */}
        <div className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(76,175,80,0.1)_0deg,transparent_60deg,rgba(76,175,80,0.05)_120deg,transparent_180deg)]" aria-hidden="true"></div>
      </div>
      
      {/* Enhanced accent line at top with improved animation and spacing */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-10" aria-hidden="true">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-90 animate-pulse"></div>
        <div className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-primary-400/60 to-transparent blur-sm"></div>
        <div className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-primary-300/30 to-transparent blur-lg"></div>
      </div>
      
      {/* Mobile-optimized or desktop footer based on viewport with enhanced spacing */}
      {isMobile ? (
        // Enhanced mobile footer with improved character spacing and visual hierarchy
        <div className="relative z-10 w-full pt-10 pb-0 font-body">
          <div className="w-full backdrop-blur-lg bg-black/50 dark:bg-black/60 border-t border-white/15 px-5 py-8 shadow-3xl">
            {/* Mobile footer main content with enhanced spacing */}
            <div className="relative">
              <FooterNavList logoImage={Logo} qrCodeImage={QRCode} isMobile={true} />
            </div>
            
            {/* Enhanced divider with better gradient, spacing and character separation */}
            <div className="h-px my-8 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-90 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/30 to-transparent blur-sm"></div>
            </div>
            
            {/* Copyright section with improved spacing */}
            <CopyRight qrCodeImage={QRCode} isMobile={true} />
          </div>
        </div>
      ) : (
        // Enhanced desktop footer with improved character spacing and visual hierarchy
        <div className="relative z-10 w-full pt-20 pb-0 font-body">
          <div className="w-full backdrop-blur-lg bg-black/40 dark:bg-black/50 border-t border-white/15 py-12 md:py-16 shadow-3xl">
            {/* Enhanced glow effect for desktop with better positioning and spacing */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-2/5 h-3 bg-gradient-to-r from-transparent via-primary-400/70 to-transparent blur-3xl" aria-hidden="true"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary-300/50 to-transparent blur-xl" aria-hidden="true"></div>
            
            {/* Footer main content with enhanced max width, spacing and character separation */}
            <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-20">
              <div className="relative">
                <FooterNavList logoImage={Logo} qrCodeImage={QRCode} isMobile={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

