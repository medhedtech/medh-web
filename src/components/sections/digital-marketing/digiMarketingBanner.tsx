'use client';

import React, { useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { BarChart, Globe, Target, ArrowRight, Shield, Award, TrendingUp } from 'lucide-react';
import medhLogo from '@/assets/images/logo/medh.png';

// Copyright-free Unsplash images for Digital Marketing
const DIGITAL_MARKETING_IMAGES = {
  mainBanner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80", // Digital marketing analytics dashboard
  studentImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" // Data analytics and charts
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
    return `font-bold text-sm md:text-base mb-2 group-hover:text-cyan-400 transition-gpu gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`;
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
            ? 'from-cyan-500/10 via-blue-500/5 to-purple-500/10' 
            : 'from-cyan-200/30 via-blue-200/20 to-purple-200/30'
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

const DigiMarketingBanner: React.FC = memo(() => {
  const { theme } = useTheme();
  
  const isDark = useMemo(() => {
    return theme === 'dark';
  }, [theme]);

  // Memoized class names with GPU acceleration
  const containerClasses = useMemo(() => {
    return `relative min-h-screen overflow-hidden gpu-accelerated ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-cyan-900/20' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50/80 to-indigo-50'
    }`;
  }, [isDark]);

  const contentClasses = useMemo(() => {
    return `relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-0 pt-8 gpu-accelerated`;
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
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/25 backdrop-blur-lg' 
        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/30 backdrop-blur-lg'
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
    return `relative group gpu-accelerated backdrop-blur-xl border rounded-2xl p-4 md:p-8 mb-16 overflow-hidden ${
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
            ? 'bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5' 
            : 'bg-gradient-to-br from-cyan-200/20 via-transparent to-blue-200/20'
        }`}></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse gpu-accelerated"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-xl animate-pulse gpu-accelerated" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse gpu-accelerated" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={contentClasses}>
        
        {/* Main Content Card - Enhanced Glassmorphism */}
        <div className={mainCardClasses}>
          {/* Animated background gradient inside card */}
          <div className="absolute inset-0 opacity-40 gpu-accelerated">
            <div className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
              isDark 
                ? 'from-cyan-500/10 via-blue-500/5 to-purple-500/10' 
                : 'from-cyan-200/30 via-blue-200/20 to-purple-200/30'
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

            {/* Learn Label - Plain Text (no chip) */}
            <div className="mb-0 text-center">
              <span className={`block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Learn</span>
            </div>
            {/* Main Heading - Full Title Without Truncation */}
            <h1 className={headingClasses}>
              <span className={`gpu-accelerated text-[1.78rem] sm:text-[2.14rem] md:text-[2.85rem] lg:text-[3.56rem] whitespace-nowrap ${isDark ? 'text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text' : 'text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text'}`}>
                Digital Marketing with Data Analytics
              </span>
            </h1>
            {/* With Medh Logo - Pixel-perfect match to other banners */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>with</span>
              <span className="inline-flex items-baseline align-baseline gpu-accelerated">
                <Image
                  src={medhLogo}
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

            {/* Description */}
            <p className={descriptionClasses + " mt-10"}>
              Master data-driven marketing strategies and transform your digital presence with expert-led training and hands-on experience.
            </p>

            {/* CTA Button */}
            <div className="text-center mb-4 md:mb-6 gpu-accelerated">
              <button
                className={ctaClasses}
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById('course-options-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 font-extrabold tracking-wide gpu-accelerated">Enroll Now</span>
                <ArrowRight size={16} className="relative z-10 ml-2 group-hover:translate-x-1 transition-gpu gpu-accelerated" />
              </button>
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
              icon={<Globe className="w-7 h-7 text-cyan-500 gpu-accelerated" />}
              title="Digital Strategy"
              description="Comprehensive marketing plans that drive growth across all digital channels"
              isDark={isDark}
            />
            <FeatureCard
              icon={<BarChart className="w-7 h-7 text-cyan-500 gpu-accelerated" />}
              title="Data Analytics"
              description="Performance tracking & insights to optimize campaigns and maximize ROI"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Target className="w-7 h-7 text-cyan-500 gpu-accelerated" />}
              title="Campaign Management"
              description="Multi-channel optimization for Facebook, Google, LinkedIn and more"
              isDark={isDark}
            />
          </div>
        </div>

        {/* Images Section - Enhanced Glass Effect */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto gpu-accelerated">
          {/* Remove the two image cards for mainBanner and studentImage */}
          {/* (No image cards here) */}
        </div>
      </div>
    </section>
  );
});

DigiMarketingBanner.displayName = 'DigiMarketingBanner';

export default DigiMarketingBanner;
