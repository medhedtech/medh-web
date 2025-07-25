"use client";

import React, { useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ArrowRight, Shield, Award, Video } from 'lucide-react';
import { buildAdvancedComponent, getResponsive } from '@/utils/designSystem';

// TypeScript interfaces
export interface IFeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
  accentColor: string;
}

export interface ICourseHeroBannerProps {
  courseType: 'ai-data-science' | 'digital-marketing' | 'personality-development' | 'vedic-mathematics';
  title: string;
  description: string | React.ReactNode;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  enrollmentPath: string;
  badge?: string;
}

// Course-specific configurations
const COURSE_CONFIGS = {
  'ai-data-science': {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      accent: 'indigo',
      gradient: {
        from: 'from-blue-400',
        via: 'via-purple-400',
        to: 'to-indigo-400'
      },
      background: {
        from: 'from-blue-50',
        via: 'via-purple-50/80',
        to: 'to-indigo-50'
      },
      dark: {
        from: 'from-slate-900',
        via: 'via-blue-900/20',
        to: 'to-purple-900/20'
      }
    },
    badge: "New Course"
  },
  'digital-marketing': {
    colors: {
      primary: 'cyan',
      secondary: 'blue',
      accent: 'purple',
      gradient: {
        from: 'from-cyan-400',
        via: 'via-blue-400',
        to: 'to-purple-400'
      },
      background: {
        from: 'from-blue-50',
        via: 'via-cyan-50/80',
        to: 'to-indigo-50'
      },
      dark: {
        from: 'from-slate-900',
        via: 'via-blue-900/20',
        to: 'to-cyan-900/20'
      }
    },
    badge: "Trending"
  },
  'personality-development': {
    colors: {
      primary: 'emerald',
      secondary: 'green',
      accent: 'teal',
      gradient: {
        from: 'from-emerald-400',
        via: 'via-green-400',
        to: 'to-teal-400'
      },
      background: {
        from: 'from-emerald-50',
        via: 'via-green-50/80',
        to: 'to-teal-50'
      },
      dark: {
        from: 'from-slate-900',
        via: 'via-emerald-900/20',
        to: 'to-green-900/20'
      }
    },
    badge: "All Ages Welcome"
  },
  'vedic-mathematics': {
    colors: {
      primary: 'amber',
      secondary: 'orange',
      accent: 'yellow',
      gradient: {
        from: 'from-amber-400',
        via: 'via-orange-400',
        to: 'to-yellow-400'
      },
      background: {
        from: 'from-amber-50',
        via: 'via-orange-50/80',
        to: 'to-yellow-50'
      },
      dark: {
        from: 'from-slate-900',
        via: 'via-amber-900/20',
        to: 'to-orange-900/20'
      }
    },
    badge: "All Ages Welcome"
  }
};

// GPU-optimized FeatureCard component
const FeatureCard = memo<IFeatureCard>(({ icon, title, description, isDark, accentColor }) => {
  const cardClasses = useMemo(() => {
    return `relative group cursor-pointer overflow-hidden gpu-accelerated backdrop-blur-lg border rounded-xl p-4 md:p-5 hover:scale-105 transition-all duration-300 ${
      isDark 
        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
        : 'bg-white/40 border-white/30 hover:bg-white/60 hover:border-white/40 shadow-lg hover:shadow-xl'
    }`;
  }, [isDark]);

  const titleClasses = useMemo(() => {
    return `font-bold text-sm md:text-base mb-2 group-hover:text-${accentColor}-400 transition-gpu gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark, accentColor]);

  const descriptionClasses = useMemo(() => {
    return `text-xs md:text-sm gpu-accelerated ${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium leading-relaxed`;
  }, [isDark]);

  return (
    <div className={cardClasses + " text-center"}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 gpu-accelerated">
        <div className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
          isDark 
            ? `from-${accentColor}-500/10 via-${accentColor}-500/5 to-${accentColor}-500/10` 
            : `from-${accentColor}-200/30 via-${accentColor}-200/20 to-${accentColor}-200/30`
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

const CourseHeroBanner: React.FC<ICourseHeroBannerProps> = memo(({ 
  courseType, 
  title, 
  description, 
  features, 
  enrollmentPath,
  badge 
}) => {
  const { theme } = useTheme();
  
  const isDark = useMemo(() => {
    return theme === 'dark';
  }, [theme]);

  const config = COURSE_CONFIGS[courseType];
  const colors = config.colors;

  // Memoized class names with GPU acceleration
  const containerClasses = useMemo(() => {
    return `relative min-h-screen overflow-hidden gpu-accelerated ${
      isDark 
        ? `bg-gradient-to-br ${colors.dark.from} ${colors.dark.via} ${colors.dark.to}` 
        : `bg-gradient-to-br ${colors.background.from} ${colors.background.via} ${colors.background.to}`
    }`;
  }, [isDark, colors]);

  const contentClasses = useMemo(() => {
    return `relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-0 pt-8 gpu-accelerated`;
  }, []);

  const headingClasses = useMemo(() => {
    return `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-4 text-center max-w-6xl mx-auto gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 text-center max-w-4xl mx-auto gpu-accelerated ${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`;
  }, [isDark]);

  const ctaClasses = useMemo(() => {
    return `!inline-flex !items-center !justify-center !px-5 md:!px-6 !py-2.5 md:!py-3 !font-bold !rounded-xl !transition-all !duration-300 hover:!scale-105 group !text-sm md:!text-base !relative !overflow-hidden gpu-accelerated ${
      isDark 
        ? `!bg-gradient-to-r from-${colors.primary}-500 to-${colors.secondary}-500 !text-white hover:!shadow-xl hover:!shadow-${colors.primary}-500/25 !backdrop-blur-lg` 
        : `!bg-gradient-to-r from-${colors.primary}-500 to-${colors.secondary}-500 !text-white hover:!shadow-xl hover:!shadow-${colors.primary}-500/30 !backdrop-blur-lg`
    }`;
  }, [isDark, colors]);

  const taglineClasses = useMemo(() => {
    return `mumkinMedh font-extrabold leading-tight gpu-accelerated ${
      isDark 
        ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
        : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
    }`;
  }, [isDark]);

  const mainCardClasses = useMemo(() => {
    return `relative group gpu-accelerated backdrop-blur-xl border rounded-2xl py-4 md:py-8 px-0 mx-8 overflow-hidden ${
      isDark
        ? 'bg-slate-900/60 border-white/20 hover:bg-slate-900/80'
        : 'bg-white/50 border-white/40 hover:bg-white/70'
    } shadow-2xl hover:shadow-3xl`;
  }, [isDark]);

  const titleGradientClasses = useMemo(() => {
    return `gpu-accelerated block text-[1.78rem] sm:text-[2.14rem] md:text-[2.85rem] lg:text-[3.56rem] whitespace-nowrap ${
      isDark 
        ? `text-transparent bg-gradient-to-r ${colors.gradient.from} ${colors.gradient.via} ${colors.gradient.to} bg-clip-text` 
        : `text-transparent bg-gradient-to-r ${colors.gradient.from.replace('400', '600')} ${colors.gradient.via.replace('400', '600')} ${colors.gradient.to.replace('400', '600')} bg-clip-text`
    }`;
  }, [isDark, colors]);

  return (
    <section className={containerClasses}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full opacity-30 gpu-accelerated ${
          isDark 
            ? `bg-gradient-to-br from-${colors.primary}-500/5 via-transparent to-${colors.secondary}-500/5` 
            : `bg-gradient-to-br from-${colors.primary}-200/20 via-transparent to-${colors.secondary}-200/20`
        }`}></div>
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 bg-${colors.primary}-400/10 rounded-full blur-xl animate-pulse gpu-accelerated`}></div>
        <div className={`absolute top-3/4 right-1/4 w-40 h-40 bg-${colors.secondary}-400/10 rounded-full blur-xl animate-pulse gpu-accelerated`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 right-1/3 w-24 h-24 bg-${colors.accent}-400/10 rounded-full blur-xl animate-pulse gpu-accelerated`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={contentClasses}>
        
        {/* Main Content Card - Enhanced Glassmorphism */}
        <div className={mainCardClasses}>
          {/* Animated background gradient inside card */}
          <div className="absolute inset-0 opacity-40 gpu-accelerated">
            <div className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
              isDark
                ? `from-${colors.primary}-900/30 via-${colors.secondary}-900/20 to-${colors.accent}-900/30`
                : `from-${colors.primary}-200/30 via-${colors.secondary}-200/20 to-${colors.accent}-200/30`
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
                STEM Accredited
              </div>
            </div>

            {/* Custom Heading with Medh Logo */}
            <div className="text-center mb-4">
              {/* Learn Label - Plain Text (no chip) */}
              <div className="mb-0">
                <span className={`block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Learn</span>
              </div>
              {/* Main Heading - Pixel-perfect match to Hero2.tsx */}
              <h1 className={headingClasses}>
                <span className={titleGradientClasses}>{title}</span>
              </h1>
              {/* With Medh Logo - Pixel-perfect match to Hero2.tsx */}
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <span className={`-mt-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>with</span>
                <span className="inline-flex items-baseline align-baseline gpu-accelerated">
                  <Image 
                    src="/assets/images/logo/medh 2.png" 
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
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="text-center mb-4 md:mb-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 gpu-accelerated">
              <button
                className={`hero-cta-button ${ctaClasses}`}
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById('course-options-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 font-extrabold tracking-wide gpu-accelerated" style={{ letterSpacing: '0.05em' }}>Enroll Now</span>
                <ArrowRight size={16} className="relative z-10 ml-2 group-hover:translate-x-1 transition-gpu gpu-accelerated" />
              </button>

              {/* Book a Free Demo Button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('/book-demo', '_blank');
                  }
                }}
                className="!inline-flex !items-center !justify-center !px-5 md:!px-6 !py-2.5 md:!py-3 !font-bold !rounded-xl !transition-all !duration-300 hover:!scale-105 group !text-sm md:!text-base !relative !overflow-hidden gpu-accelerated !bg-[#3bac63] hover:!bg-[#339955] !text-white !border !border-[#3bac63] hover:!border-[#339955] !shadow-xl hover:!shadow-[#3bac63]/30"
              >
                <span className="relative z-10 font-extrabold tracking-wide gpu-accelerated" style={{ letterSpacing: '0.05em' }}>Book a Free Demo</span>
                <Video size={16} className="relative z-10 ml-2 group-hover:translate-x-1 transition-gpu gpu-accelerated" />
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
          <h2 className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 pt-16 gpu-accelerated ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What You'll Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto gpu-accelerated">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isDark={isDark}
                accentColor={colors.primary}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

CourseHeroBanner.displayName = 'CourseHeroBanner';

export default CourseHeroBanner; 