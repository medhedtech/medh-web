"use client";
import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/logo_2.png";
import useIsSecondary from "@/hooks/useIsSecondary";
import qr from "@/assets/images/footer/qr.png";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

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
    <div className="bg-gray-900 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* QR Code Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-[140px] h-[140px] bg-white p-2 rounded-lg shadow-md">
            <Image 
              src={qr} 
              alt="Scan QR code" 
              fill 
              className="object-contain rounded-md" 
            />
          </div>
          <p className="text-gray-400 text-sm mt-3">Scan to visit our mobile app</p>
        </div>
        
        {/* Social Media Links */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${link.name} page`}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 text-sm">
          {policyLinks.map((link, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleNavigation(link.path)}
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </button>
              {index < policyLinks.length - 1 && (
                <span className="text-gray-600">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Copyright Text */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            All trademarks and logos appearing on this website are the property of
            their respective owners.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-1">
            Copyright © {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <p className="text-green-500 font-medium text-sm">
            MEDH – LEARN. UPSKILL. ELEVATE.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
