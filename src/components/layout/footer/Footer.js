"use client";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/assets/images/logo/medh_logo-1.png";
import QRCode from "@/assets/images/footer/qr.png";

const Footer = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect with a slight delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    // Check for mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <footer className={`w-full relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Modern subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>
      
      {/* Subtle accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
      
      {/* Minimal animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px' 
        }}
      ></div>
      
      {/* Mobile-optimized or desktop footer based on viewport */}
      {isMobile ? (
        // Mobile footer - optimized for small screens
        <div className="relative z-10 w-full px-3 pt-6 pb-2 font-body">
          <div className="max-w-full mx-auto">
            {/* Mobile footer main content */}
            <div className="relative">
              <FooterNavList logoImage={Logo} isMobile={true} />
            </div>
            
            {/* Simple divider */}
            <div className="h-px bg-gray-800 my-3"></div>
            
            {/* Copyright section */}
            <CopyRight qrCodeImage={QRCode} isMobile={true} />
          </div>
        </div>
      ) : (
        // Desktop footer - unchanged
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-10 md:pt-12 pb-3 md:pb-4 font-body">
          <div className="max-w-7xl mx-auto">
            {/* Footer main content */}
            <div className="relative">
              <FooterNavList logoImage={Logo} isMobile={false} />
            </div>
            
            {/* Simple divider */}
            <div className="h-px bg-gray-800 my-4 md:my-6"></div>
            
            {/* Copyright section */}
            <CopyRight qrCodeImage={QRCode} isMobile={false} />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
