"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoImage from "@/assets/images/logo/medh_logo.png";

const Preloader2 = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Shorter loading time for secondary preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-[60vh] w-full transition-opacity duration-300 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Logo and loading indicator */}
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <Image
            src={logoImage}
            alt="MEDH"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
        
        {/* Loading bar */}
        <div className="relative w-36 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full animate-loading-bar-small"></div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">Loading content...</p>
      </div>
      
      <style jsx global>{`
        @keyframes loading-bar-small {
          0% { width: 0%; left: 0; }
          50% { width: 60%; left: 20% }
          100% { width: 0%; left: 100% }
        }
        
        .animate-loading-bar-small {
          animation: loading-bar-small 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader2;
