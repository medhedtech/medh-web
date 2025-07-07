"use client";

import React, { useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Database, Brain, Rocket, ArrowRight, Shield, Award, BarChart3, Code, Cpu } from 'lucide-react';

// Copyright-free Unsplash images for AI & Data Science
const AI_DATA_SCIENCE_IMAGES = {
  mainBanner: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80", // AI and machine learning visualization
  studentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" // Data science and coding
};

// TypeScript interfaces
interface IFeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}

// GPU-optimized FeatureCard component
const FeatureCard = memo<IFeatureCard>(({ icon, title, description, isDark }) => {
  const cardClasses = useMemo(() => {
    return `relative group cursor-pointer overflow-hidden gpu-accelerated backdrop-blur-lg border rounded-xl p-4 md:p-5 hover:scale-105 transition-all duration-300 ${
      isDark 
        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
        : 'bg-white/40 border-white/30 hover:bg-white/60 hover:border-white/40 shadow-lg hover:shadow-xl'
    }`;
  }, [isDark]);

  const titleClasses = useMemo(() => {
    return `font-bold text-sm md:text-base mb-2 group-hover:text-blue-400 transition-gpu gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-xs md:text-sm gpu-accelerated ${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium leading-relaxed`;
  }, [isDark]);

  return (
    <div className={cardClasses + " text-center"}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 gpu-accelerated">
        <div className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
          isDark 
            ? 'from-blue-500/10 via-purple-500/5 to-indigo-500/10' 
            : 'from-blue-200/30 via-purple-200/20 to-indigo-200/30'
        }`}></div>
      </div>
      
      <div className="relative z-10 gpu-accelerated">
        <div className="mb-3 group-hover:scale-110 transition-gpu gpu-accelerated flex justify-center">
          {icon}
        </div>
        <h3 className={titleClasses + " text-center"}>{title}</h3>
        <p className={descriptionClasses + " text-center"}>{description}</p>
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const CourseAiCourseBanner: React.FC = memo(() => {
  const { theme } = useTheme();
  
  const isDark = useMemo(() => {
    return theme === 'dark';
  }, [theme]);

  // Memoized class names with GPU acceleration
  const containerClasses = useMemo(() => {
    return `relative min-h-screen overflow-hidden gpu-accelerated ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50/80 to-indigo-50'
    }`;
  }, [isDark]);

  const contentClasses = useMemo(() => {
    return `relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-0 gpu-accelerated`;
  }, []);

  const headingClasses = useMemo(() => {
    return `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4 text-center max-w-5xl mx-auto gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 text-center max-w-2xl mx-auto gpu-accelerated ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`;
  }, [isDark]);

  const ctaClasses = useMemo(() => {
    return `inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 font-bold rounded-xl transition-all duration-300 hover:scale-105 group text-sm md:text-base relative overflow-hidden gpu-accelerated ${
      isDark 
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:shadow-blue-500/25 backdrop-blur-lg' 
        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:shadow-blue-500/30 backdrop-blur-lg'
    }`;
  }, [isDark]);

  const taglineClasses = useMemo(() => {
    return `mumkinMedh font-extrabold leading-tight gpu-accelerated ${
      isDark 
        ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
        : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
    }`;
  }, [isDark]);

  const mainCardClasses = useMemo(() => {
    return `relative group gpu-accelerated backdrop-blur-xl border rounded-2xl p-4 md:p-8 mb-6 md:mb-8 max-w-4xl mx-auto overflow-hidden ${
      isDark 
        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
        : 'bg-white/50 border-white/40 hover:bg-white/70 shadow-2xl hover:shadow-3xl'
    }`;
  }, [isDark]);

  return (
    <section className={containerClasses}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full opacity-30 gpu-accelerated ${
          isDark 
            ? 'bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5' 
            : 'bg-gradient-to-br from-blue-200/20 via-transparent to-purple-200/20'
        }`}></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse gpu-accelerated"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-xl animate-pulse gpu-accelerated" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-pulse gpu-accelerated" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={contentClasses} style={{ paddingTop: 'calc(80px + 1rem)' }}>
        
        {/* Main Content Card - Enhanced Glassmorphism */}
        <div className={mainCardClasses}>
          {/* Animated background gradient inside card */}
          <div className="absolute inset-0 opacity-40 gpu-accelerated">
            <div className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
              isDark 
                ? 'from-blue-500/10 via-purple-500/5 to-indigo-500/10' 
                : 'from-blue-200/30 via-purple-200/20 to-indigo-200/30'
            }`}></div>
          </div>
          
          <div className="relative z-10">
            {/* Certification Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-6 gpu-accelerated">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium opacity-95 gpu-accelerated backdrop-blur-md border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-blue-300 hover:bg-white/20' 
                  : 'bg-white/60 border-white/40 text-blue-700 hover:bg-white/80'
              }`}>
                <Shield size={12} className="mr-1.5 gpu-accelerated" />
                ISO Certified
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium opacity-95 gpu-accelerated backdrop-blur-md border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-purple-300 hover:bg-white/20' 
                  : 'bg-white/60 border-white/40 text-purple-700 hover:bg-white/80'
              }`}>
                <Award size={12} className="mr-1.5 gpu-accelerated" />
                STEM Certified
              </div>
            </div>

            {/* Custom Heading with Medh Logo */}
            <div className="text-center mb-6 md:mb-8">
              {/* Learn Label - Plain Text (no chip) */}
              <div className="mb-0">
                <span className={`block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide ${isDark ? 'text-white' : 'text-gray-700'}`}>Learn</span>
              </div>
              {/* Main Heading - Pixel-perfect match to Hero2.tsx */}
              <h1 className={headingClasses}>
                <span className={`gpu-accelerated block ${isDark ? 'text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text' : 'text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text'}`}>AI & Data Science</span>
              </h1>
              {/* With Medh Logo - Pixel-perfect match to Hero2.tsx */}
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>with</span>
                <span className="inline-flex items-baseline align-baseline gpu-accelerated">
                  <Image 
                    src={require('@/assets/images/logo/medh 2.png')} 
                    alt="Medh Logo" 
                    width={96} 
                    height={96} 
                    className="inline-block h-6 sm:h-7 md:h-8 lg:h-9 w-auto align-baseline gpu-accelerated"
                    style={{
                      verticalAlign: 'baseline',
                      transform: 'translateY(-4px)',
                      objectFit: 'contain',
                      imageRendering: '-webkit-optimize-contrast',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}
                  />
                </span>
              </div>
            </div>

            {/* Description */}
            <p className={descriptionClasses}>
              Supercharge your career. Master machine learning, data analysis, and AI technologies.
            </p>

            {/* CTA Button */}
            <div className="text-center mb-4 md:mb-6 gpu-accelerated">
              <Link href="/enrollment/ai-and-data-science/" className={ctaClasses}>
                <span className="relative z-10 font-extrabold tracking-wide gpu-accelerated">Enroll Now</span>
                <ArrowRight size={16} className="relative z-10 ml-2 group-hover:translate-x-1 transition-gpu gpu-accelerated" />
              </Link>
            </div>

            {/* Tagline - Medh Hai Toh Mumkin Hai */}
            <div className="w-full overflow-hidden gpu-accelerated">
              <div className={taglineClasses} style={{ 
                fontSize: 'clamp(1.2rem, 5vw, 2.5rem)',
                transform: 'scaleX(1.1) translate3d(0,0,0)', 
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%'
              }}>
                Medh Hai Toh Mumkin Hai !
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Enhanced Glass Effect */}
        <div className="mb-6 md:mb-8 gpu-accelerated">
          <h2 className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What You'll Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto gpu-accelerated">
            <FeatureCard
              icon={<Database className="w-7 h-7 text-blue-500 gpu-accelerated" />}
              title="Data Science"
              description="Master data analysis, visualization, and statistical modeling with Python, R, and advanced analytics tools"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7 text-blue-500 gpu-accelerated" />}
              title="Machine Learning"
              description="Build intelligent systems using ML algorithms, neural networks, and deep learning frameworks"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Rocket className="w-7 h-7 text-blue-500 gpu-accelerated" />}
              title="AI Applications"
              description="Develop real-world AI solutions for computer vision, NLP, and automation technologies"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

CourseAiCourseBanner.displayName = 'CourseAiCourseBanner';

export default CourseAiCourseBanner;
