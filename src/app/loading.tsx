'use client';

import { useState, useEffect } from 'react';
import { Loader2, Zap, Sparkles, Code, Cpu } from 'lucide-react';

export default function Loading() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Initializing awesome experience...",
    "Loading your personalized content...",
    "Preparing something amazing...",
    "Almost ready to blow your mind...",
    "Finalizing the magic..."
  ];

  useEffect(() => {
    setMounted(true);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Tech Icons */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Code className="w-6 h-6" />
            ) : i % 4 === 1 ? (
              <Zap className="w-6 h-6" />
            ) : i % 4 === 2 ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <Cpu className="w-6 h-6" />
            )}
          </div>
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        {/* Main Loader */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-t-pink-400 border-l-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-fade-in-up">
            Loading
          </h2>
          
          {/* Animated Message */}
          <div className="h-8 flex items-center justify-center">
            <p className="text-lg text-gray-300 animate-fade-in-up delay-200 transition-all duration-500">
              {loadingMessages[currentMessage]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in-up delay-400">
          <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm border border-white/20">
            <div 
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">
              {Math.round(Math.min(progress, 100))}%
            </span>
            <span className="text-sm text-gray-400">
              Please wait...
            </span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 animate-fade-in-up delay-600">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Fun Fact */}
        <div className="mt-8 animate-fade-in-up delay-800">
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-sm text-gray-300">
              💡 <strong>Did you know?</strong> We're optimizing everything for the best experience possible!
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
}


