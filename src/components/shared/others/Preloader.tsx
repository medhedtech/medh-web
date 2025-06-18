"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logoImage from "@/assets/images/logo/medh_logo-1.png";
import { Sparkles } from "lucide-react";

interface PreloaderProps {
  /**
   * Minimum duration to show the preloader (in ms)
   */
  minDuration?: number;
  
  /**
   * Speed of progress simulation (higher means faster progress)
   */
  progressSpeed?: number;
}

const Preloader: React.FC<PreloaderProps> = ({
  minDuration = 1500,
  progressSpeed = 15,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Simulate loading progress with deterministic increments to avoid hydration issues
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Use deterministic progress increment instead of Math.random()
        return prev + (progressSpeed * 0.7); // Use 70% of progressSpeed for consistent increments
      });
    }, 200);

    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, minDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [minDuration, progressSpeed]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col items-center justify-center z-50 transition-all duration-700 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-conic from-primary-500/30 via-purple-500/20 to-secondary-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-conic from-secondary-500/30 via-pink-500/20 to-primary-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-spin-slow-reverse"></div>
        
        {/* Grid Pattern with Gradient Mask */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center perspective-1000">
        {/* Logo Container with 3D Effect */}
        <div className="relative mb-16 group perspective">
          <div className="absolute inset-0 bg-gradient-conic from-primary-500/20 via-purple-500/20 to-secondary-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-spin-slower"></div>
          <div className="relative transform transition-all duration-700 hover:scale-110 group-hover:rotate-6 will-change-transform">
            <Image
              src={logoImage}
              alt="MEDH"
              priority
              width={200}
              height={70}
              className="h-16 w-auto object-contain aspect-[3/1] drop-shadow-2xl"
              sizes="(max-width: 768px) 160px, 200px"
            />
            {/* Sparkle Effects */}
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary-400 animate-pulse" aria-hidden="true" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-secondary-400 animate-pulse animation-delay-700" aria-hidden="true" />
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="relative w-72 perspective">
          {/* Progress Container */}
          <div className="relative w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm mb-8 transform hover:scale-105 transition-transform duration-300" 
               role="progressbar" 
               aria-valuenow={Math.round(progress)} 
               aria-valuemin={0} 
               aria-valuemax={100}>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-conic from-primary-500/20 via-purple-500/20 to-secondary-500/20 animate-spin-slow"></div>
            
            {/* Progress Indicator */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500 rounded-full transition-all duration-300 ease-out group"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Enhanced Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shine"></div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
          </div>

          {/* Enhanced Loading Text */}
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 text-lg font-semibold mb-2 tracking-wide">
              {Math.round(progress)}% Complete
            </p>
            <p className="text-gray-400 text-sm font-medium">
              <span className="inline-block animate-bounce-slow">Preparing </span>
              <span className="inline-block animate-bounce-slow animation-delay-100"> your </span>
              <span className="inline-block animate-bounce-slow animation-delay-200"> learning </span>
              <span className="inline-block animate-bounce-slow animation-delay-300"> journey </span>
              <span className="inline-block animate-pulse"> ...</span>
            </p>
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Animated Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full animate-float-particle"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-secondary-400 to-pink-400 rounded-full animate-float-particle animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-float-particle animation-delay-2000"></div>
          
          {/* Enhanced Glowing Orbs */}
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-conic from-primary-500/10 via-purple-500/5 to-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-conic from-secondary-500/10 via-pink-500/5 to-primary-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -10px) scale(1.5); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes spin-slower {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-shine {
          animation: shine 3s linear infinite;
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .perspective {
          perspective: 1000px;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
