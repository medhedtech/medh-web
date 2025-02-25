"use client";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import FooterTop from "./FooterTop";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Footer = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect with a slight delay for better perceived performance
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className={`mt-auto w-full relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Font imports */}
      <style jsx global>{`
        /* Import fonts from Google Fonts - in production, consider using next/font or hosting locally */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>
      
      {/* Background gradient with improved colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-60"></div>
      <div className="absolute top-8 right-0 w-1/3 h-1/3 bg-primary-500/5 rounded-full blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-500/5 rounded-full blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/4"></div>
      
      {/* Improved decorative mesh grid overlay with subtle animation */}
      <div 
        className="absolute inset-0 opacity-5 animate-pulse-slow" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `, 
          backgroundSize: '60px 60px' 
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 font-body">
        {/* Footer main content */}
        <div className="relative">
          <FooterNavList />
        </div>

        {/* Decorative divider with animation */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-10 opacity-70"></div>
        
        {/* Copyright section */}
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
