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

  // Enhanced theme-aware styling with glassmorphism
  const currentTheme = resolvedTheme || 'dark';

  // Show a loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <footer 
        className={`w-full bg-slate-100 dark:bg-slate-950 ${className}`}
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-300 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-full"></div>
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
      className={`relative w-full min-h-[400px] overflow-hidden ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      {...getHydrationSafeProps()}
    >
      {/* Enhanced Glassmorphic Background with Atmospheric Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/95 via-slate-200/90 to-slate-300/95 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-800/95">
        
        {/* Multiple Layered Floating Orbs for Depth - Fixed dimensions */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-radial from-blue-400/30 via-indigo-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-radial from-violet-400/25 via-purple-500/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-16 w-48 h-48 sm:w-60 sm:h-60 bg-gradient-radial from-emerald-400/20 via-teal-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 -right-16 w-40 h-40 sm:w-52 sm:h-52 bg-gradient-radial from-rose-400/20 via-pink-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-radial from-amber-400/18 via-yellow-500/8 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-44 h-44 sm:w-56 sm:h-56 bg-gradient-radial from-cyan-400/22 via-sky-500/12 to-transparent rounded-full blur-3xl animate-pulse delay-800"></div>
        
        {/* Additional Atmospheric Layers */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-radial from-indigo-300/15 via-blue-400/8 to-transparent rounded-full blur-xl animate-pulse delay-200"></div>
        <div className="absolute bottom-1/2 right-1/4 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-radial from-purple-300/18 via-violet-400/9 to-transparent rounded-full blur-xl animate-pulse delay-600"></div>
        <div className="absolute top-3/4 left-1/8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-radial from-green-300/16 via-emerald-400/8 to-transparent rounded-full blur-lg animate-pulse delay-400"></div>
        
        {/* Enhanced Mesh/Grid Pattern for Texture */}
        <div className="absolute inset-0 opacity-40 dark:opacity-25" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0),
            radial-gradient(circle at 20px 20px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 40px 40px, rgba(16, 185, 129, 0.15) 1px, transparent 0)
          `,
          backgroundSize: '24px 24px, 48px 48px, 80px 80px'
        }}></div>
        
        {/* Dynamic gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-200/30 dark:from-slate-800/20 dark:via-transparent dark:to-slate-700/30"></div>
        
        {/* Frosted glass overlay */}
        <div className="absolute inset-0 backdrop-blur-[0.5px] bg-gradient-to-t from-white/8 via-white/4 to-white/12 dark:from-slate-800/8 dark:via-slate-800/4 dark:to-slate-800/12"></div>
      </div>

      {/* Main Footer Content with Enhanced Glassmorphism */}
      <div className="relative z-10">
        {/* Glassmorphic Container */}
        <div className="relative bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border-t border-white/30 dark:border-slate-600/30 shadow-2xl shadow-slate-900/10 dark:shadow-black/20">
          
          {/* Additional atmospheric glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 dark:from-blue-400/5 dark:to-violet-400/5"></div>
          
          {/* Content */}
          <div className="relative z-10 w-full px-3 sm:px-4 lg:px-6 pt-8 md:pt-12">
            <FooterNavList theme={currentTheme} />
          </div>
          
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 dark:via-slate-700/5 dark:to-slate-700/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Optional bottom section for copyright */}
      {/* 
      <div className="relative z-10 border-t border-white/20 dark:border-slate-600/20 bg-white/10 dark:bg-slate-800/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CopyRight />
        </div>
      </div> 
      */}
    </footer>
  );
};

export default Footer;

