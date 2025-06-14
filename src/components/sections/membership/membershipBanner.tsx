"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Users, Crown, Sparkles, Trophy, Zap, BookOpen, Shield, Award } from "lucide-react";
import { useTheme } from "next-themes";
import medhLogo from "@/assets/images/logo/medh.png";

// TypeScript interfaces
interface IValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface IHighlightItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

// Enhanced custom animations for the membership banner with theme-aware glassmorphism
const getThemeStyles = (isDark: boolean): string => `
  @keyframes animate-bounce-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes animate-pulse-slow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
  
  @keyframes animate-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes theme-transition {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-bounce-slow {
    animation: animate-bounce-slow 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: animate-pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-float {
    animation: animate-float 8s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}, transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-theme-transition {
    animation: theme-transition 0.5s ease-in-out;
  }
  
  .glass-container {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.08)' 
      : 'rgba(255, 255, 255, 0.08)'};
    backdrop-filter: blur(25px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.25)'};
    border-radius: 1.5rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 16px 64px rgba(0, 0, 0, 0.08)' 
        : '0 8px 32px rgba(0, 0, 0, 0.06), 0 16px 64px rgba(0, 0, 0, 0.02)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.35)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.18)'};
    position: relative;
  }
  
  .glass-stats {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.12)' 
      : 'rgba(255, 255, 255, 0.15)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.3)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.12), 0 8px 40px rgba(0, 0, 0, 0.06)' 
        : '0 4px 20px rgba(0, 0, 0, 0.04), 0 8px 40px rgba(0, 0, 0, 0.015)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.4)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.25)'};
    position: relative;
  }
  
  .glass-primary {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(59, 172, 99, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 172, 99, 0.08)' 
      : 'rgba(59, 172, 99, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(59, 172, 99, 0.2)' 
        : '0 4px 20px rgba(59, 172, 99, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
`;

// Membership categories with icons
const categories: IValueItem[] = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Unlimited Access",
    description: "Access to all courses and learning materials",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: "Premium Resources",
    description: "Exclusive content and advanced learning paths",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Mentorship",
    description: "One-on-one guidance from industry professionals",
    color: "from-purple-500 to-indigo-500"
  }
];

// Key highlights for membership (reduced to 3 items)
const highlights: IHighlightItem[] = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Tailored Learning",
    description: "Personalized learning paths for your success",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Career Growth",
    description: "Fast-track your professional development",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Access",
    description: "Immediate access to all premium features",
    color: "from-purple-500 to-indigo-500"
  }
];

const MembershipBanner: React.FC = () => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const isDark: boolean = mounted ? theme === 'dark' : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('membership-banner-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'membership-banner-theme-styles';
    styleSheet.innerText = getThemeStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('membership-banner-theme-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleExplore = (): void => {
    const element = document.getElementById('choose-membership');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative min-h-[80vh] overflow-hidden animate-theme-transition">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-3/4 h-3/4 ${isDark ? 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-300/20 via-indigo-300/15 to-purple-300/20'} rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 animate-float`}></div>
        <div className={`absolute bottom-0 left-0 w-3/4 h-3/4 ${isDark ? 'bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-transparent' : 'bg-gradient-to-tr from-green-300/15 via-emerald-300/10 to-transparent'} rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 animate-float`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${isDark ? 'border-blue-500/20' : 'border-blue-400/30'} animate-bounce-slow`}></div>
        <div className={`absolute bottom-1/4 right-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed ${isDark ? 'border-green-500/20' : 'border-green-400/30'} animate-pulse-slow`}></div>
        <div className={`absolute top-3/4 left-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 ${isDark ? 'border-blue-500/20' : 'border-blue-400/30'} transform rotate-45 animate-float`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center py-6">
          
          <div className={`mb-2 md:mb-3 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="glass-container rounded-3xl p-4 md:p-6 lg:p-8 mb-1 transform scale-90 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
              
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 glass-stats rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <Shield size={10} className="mr-1 sm:w-3 sm:h-3" />
                  ISO Certified
                </div>
                <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 glass-stats rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  <Award size={10} className="mr-1 sm:w-3 sm:h-3" />
                  STEM Certified
                </div>
              </div>
               
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="block text-sm sm:text-base font-medium uppercase tracking-widest mb-3 opacity-80">Tailored Resources for Success</span>
                <span className="block whitespace-nowrap">Unlock Your Learning Potential</span>
                <span className="block whitespace-nowrap">
                  <em className="font-semibold inline-flex items-baseline mr-1" style={{ transform: 'scale(0.9)' }}>with</em>
                  <span className="inline-flex items-center">
                  <Image 
                     src={medhLogo} 
                     alt="Medh Logo" 
                     width={24} 
                     height={24} 
                     className="inline-block h-6 sm:h-8 md:h-9 lg:h-12 xl:h-14 w-auto align-baseline"
                     style={{ 
                         filter: 'brightness(1.1) contrast(1.2)',
                         transform: 'scale(0.9) translateY(5px)',
                         verticalAlign: 'baseline'
                       }}
                   />
                  </span>
                </span>
              </h1>
                
              <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>
                Take Your Skills to New Heights! Become a MEDH Member Today and Unlock Your Full Potential for Success.
              </p>

              <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={handleExplore}
                  className={`inline-flex items-center justify-center px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 group text-sm sm:text-base md:text-lg relative overflow-hidden ${
                    isDark 
                      ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white hover:shadow-2xl hover:shadow-primary-500/30 glass-stats' 
                      : 'bg-white/95 backdrop-blur-lg text-gray-900 border-2 border-primary-500/40 hover:border-primary-500/70 hover:bg-white shadow-2xl hover:shadow-3xl'
                  }`}
                >
                  <span className="relative z-10 font-extrabold tracking-wide">Explore More</span>
                  <ArrowRight size={16} className="relative z-10 ml-3 group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className={`mumkinMedh text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 leading-tight pt-12 ${
                isDark 
                  ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                  : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
              }`} style={{ transform: 'scaleX(1.1)', letterSpacing: '0.05em' }}>
                Medh Hai Toh Mumkin Hai !
              </div>
            </div>
          </div>

          <div className={`mb-3 md:mb-4 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl lg:max-w-6xl mx-auto">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass-stats rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className={`mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-primary-300' : 'text-primary-600'} flex justify-center`}>
                      <div className={`bg-gradient-to-br ${highlight.color} text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          {highlight.icon}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold text-sm md:text-base group-hover:text-primary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>{highlight.title}</div>
                    <div className={`text-xs md:text-sm mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>{highlight.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mb-4 md:mb-6 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="glass-stats rounded-2xl p-6 md:p-8 max-w-5xl lg:max-w-6xl mx-auto">
              <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Membership Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl p-4 md:p-6 cursor-pointer group transition-all duration-300 text-center glass-stats hover:scale-105"
                  >
                    <div className="relative z-10">
                      <div className={`bg-gradient-to-br ${category.color} text-white rounded-xl p-3 w-fit mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                        <div className="w-5 h-5 md:w-6 md:h-6">
                          {category.icon}
                        </div>
                      </div>
                      <h4 className={`text-base md:text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-600'}`}>{category.title}</h4>
                      <p className={`text-sm md:text-base transition-colors ${isDark ? 'text-white group-hover:text-primary-100' : 'text-gray-700 group-hover:text-primary-700'}`}>{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`flex flex-col items-center mt-4 md:mt-6 transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className={`text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-600'} font-medium`}>Discover Your Membership Benefits</span>
            <ChevronDown className={`w-6 h-6 animate-bounce ${isDark ? 'text-white' : 'text-gray-500'}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipBanner;




