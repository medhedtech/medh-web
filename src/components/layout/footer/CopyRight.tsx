"use client";
import React from "react";
import Link from "next/link";
import { useCurrentYear } from "@/utils/hydration";

const CopyRight: React.FC = () => {
  const currentYear = useCurrentYear();

  return (
    <div className="py-6 text-center">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        {/* Copyright Text */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <p>
            © {currentYear} MEDH. All rights reserved.
          </p>
          <div className="hidden md:block w-px h-4 bg-gray-600"></div>
          <p className="text-primary-400 font-medium">
            LEARN. UPSKILL. ELEVATE.
          </p>
        </div>

        {/* Additional Links */}
        <div className="flex items-center gap-4 text-xs">
          <Link 
            href="/terms-and-services" 
            className="hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link 
            href="/privacy-policy" 
            className="hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link 
            href="/cookie-policy" 
            className="hover:text-white transition-colors"
          >
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CopyRight; 