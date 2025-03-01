"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoImage from "@/assets/images/logo/medh_logo.png";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-b from-[#0C0E2B] to-[#070818] flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative mb-8">
        <Image
          src={logoImage}
          alt="MEDH"
          priority
          width={150}
          height={50}
          className="h-12 w-auto object-contain aspect-[3/1]"
          sizes="(max-width: 768px) 120px, 150px"
        />
      </div>
      
      <div className="relative w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-loading-bar"></div>
      </div>
      
      <p className="text-gray-400 text-sm mt-4 animate-pulse">Loading amazing courses...</p>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-green-500/5 animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-green-500/5 animate-float"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-green-500/5 animate-float-reverse"></div>
      
      <style jsx global>{`
        @keyframes loading-bar {
          0% { width: 0%; left: 0; }
          50% { width: 70%; left: 30% }
          100% { width: 0%; left: 100% }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
