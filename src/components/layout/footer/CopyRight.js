"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube, QrCode, ArrowUpRight } from "lucide-react";
import { useIsClient, useCurrentYear, getHydrationSafeProps } from "@/utils/hydration";

const CopyRight = ({ qrCodeImage, isMobile }) => {
  const router = useRouter();
  const isClient = useIsClient();
  const currentYear = useCurrentYear();
  
  const handleNavigation = (path) => {
    router.push(path);
  };
  
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/medhupskill/",
      icon: <Facebook size={isMobile ? 12 : 14} className="sm:w-4 sm:h-4" />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/101210304/admin/feed/posts/",
      icon: <Linkedin size={isMobile ? 12 : 14} className="sm:w-4 sm:h-4" />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/medhupskill/",
      icon: <Instagram size={isMobile ? 12 : 14} className="sm:w-4 sm:h-4" />
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw",
      icon: <Youtube size={isMobile ? 12 : 14} className="sm:w-4 sm:h-4" />
    }
  ];
  
  const policyLinks = [
    { name: "Terms of Use", path: "/terms-and-services" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Cookie Policy", path: "/cookie-policy" },
    { name: "Refund Policy", path: "/cancellation-and-refund-policy" }
  ];

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative font-body w-full">
        <div className="w-full flex flex-col items-center">
          <div className="animate-pulse">
            <div className="h-32 w-32 bg-gray-200 rounded-xl mb-8"></div>
            <div className="flex gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced mobile-optimized view - full width with specific ordering
  if (isMobile) {
    return (
      <div className="relative font-body w-full">
        <div className="w-full">
          <div className="flex flex-col items-center space-y-5">
            {/* 1. QR Code - centered at the top */}
            <div className="pt-2">
              <div className="group relative w-[90px] h-[90px] bg-gradient-to-br from-primary-500/10 to-primary-600/5 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-primary-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 bg-white rounded-md overflow-hidden w-full h-full shadow-inner">
                  {qrCodeImage ? (
                    <Image 
                      src={qrCodeImage} 
                      alt="Medh QR Code" 
                      fill
                      className="object-contain p-1"
                      sizes="90px"
                      priority
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                      <QrCode className="text-gray-600" size={30} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Scan me
                </div>
              </div>
            </div>
            
            {/* 2. Social Media Links */}
            <div className="flex justify-center gap-4 pt-1 pb-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white transition-all duration-300 shadow-md hover:shadow-primary-500/20"
                  {...getHydrationSafeProps()}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            {/* 3. Policy Links - each on their own line for clarity */}
            <div className="flex items-center gap-2 pt-2 pb-3 w-full">
              {policyLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="text-gray-400 hover:text-primary-400 transition-colors text-xs hover:underline decoration-primary-400/30 underline-offset-2 flex items-center gap-1 py-1"
                  {...getHydrationSafeProps()}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight size={10} className="opacity-70" />
                </button>
              ))}
            </div>
            
            {/* 4. Copyright text with modern styling */}
            <div className="text-center pt-1 pb-2">
              <p className="text-gray-500 text-xs tracking-wide" {...getHydrationSafeProps()}>
                © {currentYear} MEDH. All Rights Reserved.
              </p>
              <p className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent text-sm font-semibold tracking-wide animate-gradient pt-1">
                LEARN. UPSKILL. ELEVATE.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view remains unchanged
  return (
    <div className="relative font-body w-full">
      <div className="w-full flex flex-col items-center">
        {/* Enhanced QR Code Section with modern styling */}
        <div className="flex justify-center mb-8">
          <div className="group relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] bg-gradient-to-br from-primary-500/10 to-primary-600/5 p-2.5 rounded-xl shadow-xl backdrop-blur-sm border border-white/10 transition-all duration-500 hover:shadow-primary-500/30 hover:border-primary-500/20">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Pulsing dot decorations */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-400/70 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-primary-400/70 animate-pulse delay-300"></div>
            
            <div className="relative z-10 bg-white rounded-lg overflow-hidden w-full h-full shadow-inner">
              {qrCodeImage ? (
                <Image 
                  src={qrCodeImage} 
                  alt="Medh QR Code" 
                  fill
                  className="object-contain p-1.5"
                  sizes="(max-width: 768px) 120px, 140px"
                  priority
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                  <QrCode className="text-gray-600" size={50} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Scan to connect
            </div>
          </div>
        </div>

        {/* Enhanced layout with modern styling - full width with better space distribution */}
        <div className="w-full flex flex-col items-center space-y-6">
          {/* Policy links section - centered for all screen sizes */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {policyLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(link.path)}
                className="text-gray-400 hover:text-primary-400 transition-colors"
                {...getHydrationSafeProps()}
              >
                <span>{link.name}</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
              </button>
            ))}
          </div>
          
          {/* Flex container for social media and copyright */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-4">
            {/* Copyright Text with gradient effect */}
            <div className="text-center sm:text-left order-2 sm:order-1 mt-4 sm:mt-0">
              <p className="text-gray-400 text-xs tracking-wide" {...getHydrationSafeProps()}>
                Copyright © {currentYear} MEDH. All Rights Reserved.
              </p>
              <p className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent text-sm font-semibold tracking-wide animate-gradient">
                LEARN. UPSKILL. ELEVATE.
              </p>
            </div>
            
            {/* Social Media Links with modern styling */}
            <div className="flex justify-center sm:justify-end gap-3 order-1 sm:order-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white transition-all duration-300 shadow-md hover:shadow-primary-500/20"
                  {...getHydrationSafeProps()}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
