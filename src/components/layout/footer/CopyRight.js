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
      icon: <Facebook size={isMobile ? 18 : 20} className="sm:w-5 sm:h-5" />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/101210304/admin/feed/posts/",
      icon: <Linkedin size={isMobile ? 18 : 20} className="sm:w-5 sm:h-5" />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/medhupskill/",
      icon: <Instagram size={isMobile ? 18 : 20} className="sm:w-5 sm:h-5" />
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw",
      icon: <Youtube size={isMobile ? 18 : 20} className="sm:w-5 sm:h-5" />
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

  // Enhanced mobile-optimized view with improved character spacing and typography
  if (isMobile) {
    return (
      <div className="relative font-body w-full">
        <div className="w-full">
          <div className="flex flex-col items-center space-y-8">
            {/* 1. Enhanced QR Code with better sizing and spacing */}
            <div className="pt-4">
              <div className="group relative w-[110px] h-[110px] bg-gradient-to-br from-primary-500/25 to-primary-600/15 p-3 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/25 transition-all duration-300 hover:border-primary-500/40 hover:shadow-primary-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 to-primary-400/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 bg-white rounded-xl overflow-hidden w-full h-full shadow-inner">
                  {qrCodeImage ? (
                    <Image 
                      src={qrCodeImage} 
                      alt="Medh QR Code" 
                      fill
                      className="object-contain p-2"
                      sizes="110px"
                      priority
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                      <QrCode className="text-gray-600" size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-primary-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/70 px-4 py-1.5 rounded-full backdrop-blur-sm border border-primary-500/25 tracking-wide">
                  Scan me
                </div>
              </div>
            </div>
            
            {/* 2. Enhanced Social Media Links with improved spacing */}
            <div className="flex justify-center gap-6 pt-3 pb-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white transition-all duration-300 shadow-xl hover:shadow-primary-500/40 border border-white/15 hover:border-primary-500/40"
                  {...getHydrationSafeProps()}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            {/* 3. Enhanced Policy Links with better character spacing */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 pb-5 w-full px-3">
              {policyLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="text-gray-300 hover:text-white transition-colors text-sm leading-relaxed tracking-wide hover:underline decoration-primary-400/60 underline-offset-3 flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/8 font-medium"
                  {...getHydrationSafeProps()}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight size={13} className="opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
            
            {/* 4. Enhanced Copyright text with improved typography and spacing */}
            <div className="text-center pt-3 pb-4">
              <p className="text-gray-400 text-sm leading-relaxed tracking-wide font-medium" {...getHydrationSafeProps()}>
                © {currentYear} MEDH.
                <br />
                All Rights Reserved.
              </p>
              <p className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent text-lg font-bold tracking-widest animate-gradient pt-3 leading-relaxed">
                LEARN. UPSKILL. ELEVATE.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed tracking-wide font-medium pt-2" {...getHydrationSafeProps()}>
                All trademarks and logos appearing on this website are the property of their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced desktop view with improved character spacing and typography
  return (
    <div className="relative font-body w-full">
      <div className="w-full flex flex-col items-center">
        {/* Enhanced QR Code Section with better sizing and character spacing */}
        <div className="flex justify-center mb-12">
          <div className="group relative w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] bg-gradient-to-br from-primary-500/25 to-primary-600/15 p-3.5 rounded-3xl shadow-3xl backdrop-blur-sm border border-white/25 transition-all duration-500 hover:shadow-primary-500/50 hover:border-primary-500/40">
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Enhanced pulsing dot decorations */}
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary-400/90 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-primary-400/90 animate-pulse delay-300"></div>
            
            <div className="relative z-10 bg-white rounded-2xl overflow-hidden w-full h-full shadow-inner">
              {qrCodeImage ? (
                <Image 
                  src={qrCodeImage} 
                  alt="Medh QR Code" 
                  fill
                  className="object-contain p-2.5"
                  sizes="(max-width: 768px) 150px, 170px"
                  priority
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                  <QrCode className="text-gray-600" size={70} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-primary-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/70 px-5 py-2 rounded-full backdrop-blur-sm border border-primary-500/25 tracking-wider">
              Scan to connect
            </div>
          </div>
        </div>

        {/* Enhanced layout with improved character spacing and typography */}
        <div className="w-full flex flex-col items-center space-y-10">
          {/* Enhanced Policy links section with better character spacing */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {policyLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(link.path)}
                className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-white/12 font-medium leading-relaxed tracking-wide"
                {...getHydrationSafeProps()}
              >
                <span>{link.name}</span>
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
              </button>
            ))}
          </div>
          
          {/* Enhanced flex container for social media and copyright */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-8">
            {/* Enhanced Copyright Text with improved character spacing */}
            <div className="text-center sm:text-left order-2 sm:order-1 mt-8 sm:mt-0">
              <p className="text-gray-300 text-sm leading-relaxed tracking-wide font-medium" {...getHydrationSafeProps()}>
                Copyright © {currentYear} MEDH. All Rights Reserved.
              </p>
              <p className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent text-lg font-bold tracking-widest animate-gradient mt-2 leading-relaxed">
                LEARN. UPSKILL. ELEVATE.
              </p>
              <p className="text-gray-300 text-xs leading-relaxed tracking-wide font-medium mt-2" {...getHydrationSafeProps()}>
                All trademarks and logos appearing on this website are the property of their respective owners.
              </p>
            </div>
            
            {/* Enhanced Social Media Links with improved spacing */}
            <div className="flex justify-center sm:justify-end gap-5 order-1 sm:order-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                  className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black hover:from-primary-600 hover:to-primary-700 text-gray-300 hover:text-white transition-all duration-300 shadow-xl hover:shadow-primary-500/40 border border-white/15 hover:border-primary-500/40"
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
