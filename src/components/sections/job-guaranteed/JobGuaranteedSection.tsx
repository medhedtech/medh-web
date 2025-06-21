"use client";
import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CheckCircle, ArrowRight, Briefcase, Award, Users, TrendingUp } from "lucide-react";
import placementImage from "@/assets/images/iso/Placement.png";
import medhLogo from "@/assets/images/logo/medh 2.png";
import "@/styles/glassmorphism.css";

interface IJobGuaranteedProps {
  className?: string;
  showStats?: boolean;
}

interface IStatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

// PERFORMANCE OPTIMIZATION: Move static data outside component to prevent recreation
const STATS_CONFIG: readonly IStatItem[] = Object.freeze([
  Object.freeze({
    icon: <CheckCircle className="w-4 h-4" />,
    value: "100%",
    label: "Job Guarantee"
  }),
  Object.freeze({
    icon: <Users className="w-4 h-4" />,
    value: "5000+",
    label: "Placements"
  }),
  Object.freeze({
    icon: <Briefcase className="w-4 h-4" />,
    value: "500+",
    label: "Partner Companies"
  }),
  Object.freeze({
    icon: <TrendingUp className="w-4 h-4" />,
    value: "₹8.5L",
    label: "Avg Package"
  })
]);

// PERFORMANCE OPTIMIZATION: Memoized StatCard component
const StatCard = memo<{
  stat: IStatItem;
  index: number;
  isDark: boolean;
  isLoaded: boolean;
}>(({ stat, index, isDark, isLoaded }) => {
  const iconClasses = useMemo(() => {
    switch (index) {
      case 0: return isDark ? 'text-emerald-300' : 'text-emerald-600';
      case 1: return isDark ? 'text-blue-300' : 'text-blue-600';
      case 2: return isDark ? 'text-purple-300' : 'text-purple-600';
      case 3: return isDark ? 'text-orange-300' : 'text-orange-600';
      default: return isDark ? 'text-gray-300' : 'text-gray-600';
    }
  }, [index, isDark]);

  const cardClasses = useMemo(() => {
    return `glass-light p-4 md:p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 ${
      isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`;
  }, [isLoaded]);

  const valueClasses = useMemo(() => {
    return `text-lg sm:text-xl md:text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const labelClasses = useMemo(() => {
    return `text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  }, [isDark]);

  const iconWithClasses = useMemo(() => {
    return React.cloneElement(stat.icon as React.ReactElement, {
      className: `w-4 h-4 ${iconClasses}`
    });
  }, [stat.icon, iconClasses]);

  return (
    <div 
      className={cardClasses}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-center mb-2">
        {iconWithClasses}
      </div>
      <div className={valueClasses}>
        {stat.value}
      </div>
      <div className={labelClasses}>
        {stat.label}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.stat === nextProps.stat &&
    prevProps.index === nextProps.index &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.isLoaded === nextProps.isLoaded
  );
});

StatCard.displayName = 'StatCard';

// PERFORMANCE OPTIMIZATION: Memoized BackgroundEffects component
const BackgroundEffects = memo<{ isDark: boolean }>(({ isDark }) => {
  const topRightClasses = useMemo(() => {
    return `absolute top-0 right-0 w-1/3 h-1/3 ${
      isDark 
        ? 'bg-gradient-to-br from-emerald-500/8 via-green-500/6 to-transparent' 
        : 'bg-gradient-to-br from-emerald-300/12 via-green-300/8 to-transparent'
    } rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4`;
  }, [isDark]);

  const bottomLeftClasses = useMemo(() => {
    return `absolute bottom-0 left-0 w-1/3 h-1/3 ${
      isDark 
        ? 'bg-gradient-to-tr from-blue-500/6 via-purple-500/4 to-transparent' 
        : 'bg-gradient-to-tr from-blue-300/10 via-purple-300/6 to-transparent'
    } rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4`;
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={topRightClasses}></div>
      <div className={bottomLeftClasses}></div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.isDark === nextProps.isDark;
});

BackgroundEffects.displayName = 'BackgroundEffects';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
const JobGuaranteedSection = memo<IJobGuaranteedProps>(({ 
  className = "",
  showStats = true 
}) => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // PERFORMANCE OPTIMIZATION: Memoized computed values
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);

  // PERFORMANCE OPTIMIZATION: Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized class names
  const sectionClasses = useMemo(() => {
    return `relative py-6 md:py-8 lg:py-10 overflow-hidden ${className}`;
  }, [className]);

  const containerClasses = useMemo(() => {
    return `transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`;
  }, [isLoaded]);

  const badgeClasses = useMemo(() => {
    return `inline-flex items-center px-3 py-1.5 glass-light rounded-full text-xs sm:text-sm font-bold tracking-wide ${
      isDark ? 'text-emerald-300' : 'text-emerald-700'
    }`;
  }, [isDark]);

  const placementContainerClasses = useMemo(() => {
    return `relative glass-card rounded-xl p-3 transform hover:scale-105 transition-transform duration-300 ${
      isDark ? 'border border-emerald-500/20' : 'border border-emerald-400/30'
    }`;
  }, [isDark]);

  const headingClasses = useMemo(() => {
    return `text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 md:mb-5 max-w-3xl mx-auto ${
      isDark ? 'text-white' : 'text-gray-900'
    }`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm sm:text-base md:text-lg leading-relaxed mb-5 md:mb-6 max-w-2xl mx-auto ${
      isDark ? 'text-gray-300' : 'text-gray-600'
    }`;
  }, [isDark]);

  const buttonClasses = useMemo(() => {
    return `inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 hover:scale-105 group text-sm sm:text-base ${
      isDark 
        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-xl hover:shadow-emerald-500/25' 
        : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-xl hover:shadow-emerald-500/30'
    }`;
  }, [isDark]);

  // PERFORMANCE OPTIMIZATION: Memoized logo styles
  const logoStyles = useMemo(() => ({
    filter: 'brightness(1.1) contrast(1.2)',
    verticalAlign: 'baseline'
  }), []);

  // Fast loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
      </div>
    );
  }

  return (
    <section className={sectionClasses}>
      {/* Background Effects */}
      <BackgroundEffects isDark={isDark} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={containerClasses}>
          
          {/* Main Content Card */}
          <div className="glass-container p-4 sm:p-6 md:p-8 text-center">
            
            {/* Top Badge */}
            <div className="flex justify-center mb-4 md:mb-5">
              <div className={badgeClasses}>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                100% JOB-GUARANTEED
              </div>
            </div>

            {/* Placement Logo/Badge */}
            <div className="flex justify-center mb-5 md:mb-6">
              <div className={placementContainerClasses}>
                <Image
                  src={placementImage}
                  alt="Medh Placement 100% Guarantee"
                  width={240}
                  height={160}
                  className="rounded-lg object-contain max-w-full h-auto"
                  style={{ width: 'auto' }}
                  priority
                />
              </div>
            </div>

            {/* Main Heading */}
            <h2 className={headingClasses}>
              100% Job-guaranteed Courses from{" "}
              <span className="inline-flex items-baseline align-baseline">
                <Image 
                  src={medhLogo} 
                  alt="Medh Logo" 
                  width={128} 
                  height={128} 
                  unoptimized={true}
                  className="inline-block h-6 sm:h-7 md:h-8 lg:h-10 w-auto align-baseline mx-1"
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, (max-width: 1024px) 48px, 56px"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2)',
                    verticalAlign: 'baseline',
                    width: 'auto'
                  }}
                />
              </span>.
            </h2>

            {/* Description */}
            <p className={descriptionClasses}>
              Transform your career with our industry-aligned programs and guaranteed placement support.
            </p>

            {/* CTA Button */}
            <div className="mb-5 md:mb-6">
              <Link 
                href="/placement-guaranteed-courses"
                className={buttonClasses}
              >
                <span className="relative z-10 font-extrabold tracking-wide">Explore Job-guaranteed Courses</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Section */}
            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {STATS_CONFIG.map((stat, index) => (
                  <StatCard
                    key={index}
                    stat={stat}
                    index={index}
                    isDark={isDark}
                    isLoaded={isLoaded}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.className === nextProps.className &&
    prevProps.showStats === nextProps.showStats
  );
});

JobGuaranteedSection.displayName = 'JobGuaranteedSection';

export default JobGuaranteedSection; 