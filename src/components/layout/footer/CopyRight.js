"use client";
import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/logo_2.png";
import useIsSecondary from "@/hooks/useIsSecondary";
import qr from "@/assets/images/footer/qr.png";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube, ExternalLink, QrCode } from "lucide-react";

const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  const router = useRouter();
  
  const handleNavigation = (path) => {
    router.push(path);
  };
  
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/medhupskill/",
      icon: <Facebook size={18} />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/101210304/admin/feed/posts/",
      icon: <Linkedin size={18} />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/medhupskill/",
      icon: <Instagram size={18} />
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw",
      icon: <Youtube size={18} />
    }
  ];
  
  const policyLinks = [
    { name: "Terms of Service", path: "/terms-and-services" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Reschedule Policy", path: "/reschedule-policy" },
    { name: "Cancellation & Refund Policy", path: "/cancellation-and-refund-policy" }
  ];

  return (
    <div className="relative overflow-hidden py-10 px-4 font-body">
      <div className="max-w-6xl mx-auto">
        {/* QR Code Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="group relative w-[140px] h-[140px] bg-white/10 p-3 rounded-2xl shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-primary-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 bg-white rounded-xl overflow-hidden w-full h-full shadow-inner">
              <Image 
                src={qr} 
                alt="Scan QR code" 
                fill 
                className="object-contain p-1.5" 
              />
            </div>
          </div>
          <div className="flex items-center mt-4 text-gray-300">
            <QrCode size={14} className="mr-2 text-primary-400" />
            <p className="text-sm font-medium tracking-wide">Scan to visit our mobile app</p>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${link.name} page`}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-primary-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary-500/30"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8 text-sm">
          {policyLinks.map((link, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleNavigation(link.path)}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer font-medium"
              >
                {link.name}
              </button>
              {index < policyLinks.length - 1 && (
                <span className="text-gray-700 hidden md:inline">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Copyright Text */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3 max-w-2xl mx-auto font-light">
            All trademarks and logos appearing on this website are the property of
            their respective owners.
          </p>
          <p className="text-gray-400 text-sm mb-2 tracking-wide">
            Copyright © {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <p className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent font-semibold tracking-wide">
            MEDH – LEARN. UPSKILL. ELEVATE.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
