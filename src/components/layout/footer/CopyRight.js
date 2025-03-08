"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube, QrCode } from "lucide-react";

const CopyRight = ({ qrCodeImage, isMobile }) => {
  const router = useRouter();
  
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
    { name: "Terms", path: "/terms-and-services" },
    { name: "Privacy", path: "/privacy-policy" },
    { name: "Cookie Policy", path: "/cookie-policy" },
    { name: "Refund Policy", path: "/cancellation-and-refund-policy" }
  ];

  // Mobile-optimized view
  if (isMobile) {
    return (
      <div className="relative font-body">
        <div className="w-full">
          {/* Compact mobile layout */}
          <div className="flex flex-col space-y-3">
            {/* Social links and QR in one row */}
            <div className="flex justify-between items-center">
              {/* Social Media Links */}
              <div className="flex gap-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${link.name} page`}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
              
              {/* QR Code - smaller for mobile */}
              <div className="group relative w-[60px] h-[60px] bg-white/10 p-1.5 rounded-lg shadow-sm backdrop-blur-sm border border-white/10 transition-all duration-300">
                <div className="relative z-10 bg-white rounded-md overflow-hidden w-full h-full shadow-inner">
                  {qrCodeImage ? (
                    <Image 
                      src={qrCodeImage} 
                      alt="Medh QR Code" 
                      fill
                      className="object-contain p-1"
                      sizes="60px"
                      priority
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <QrCode className="text-gray-600" size={30} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Policy links in two rows */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
              {policyLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="text-gray-400 hover:text-primary-400 transition-colors text-[10px]"
                >
                  {link.name}
                </button>
              ))}
            </div>
            
            {/* Copyright text */}
            <div className="text-center pt-1">
              <p className="text-gray-400 text-[10px] tracking-wide">
                © {new Date().getFullYear()} MEDH. All Rights Reserved.
              </p>
              <p className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent text-xs font-semibold tracking-wide">
                LEARN. UPSKILL. ELEVATE.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view (unchanged)
  return (
    <div className="relative font-body">
      <div className="w-full">
        {/* QR Code Section */}
        <div className="flex justify-center mb-6">
          <div className="group relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] bg-white/10 p-2 rounded-xl shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-primary-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 bg-white rounded-lg overflow-hidden w-full h-full shadow-inner">
              {qrCodeImage ? (
                <Image 
                  src={qrCodeImage} 
                  alt="Medh QR Code" 
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 768px) 100px, 120px"
                  priority
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <QrCode className="text-gray-600" size={40} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Scan to connect
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout, Desktop: Row layout */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright Text */}
          <div className="text-center sm:text-left order-3 sm:order-1">
            <p className="text-gray-400 text-xs tracking-wide">
              Copyright © {new Date().getFullYear()} MEDH. All Rights Reserved.
            </p>
            <p className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent text-xs sm:text-sm font-semibold tracking-wide">
              LEARN. UPSKILL. ELEVATE.
            </p>
          </div>
          
          {/* Middle section with policy links */}
          <div className="flex flex-wrap justify-center gap-3 text-xs order-2 sm:order-2">
            {policyLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(link.path)}
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center sm:justify-end gap-3 order-1 sm:order-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${link.name} page`}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
