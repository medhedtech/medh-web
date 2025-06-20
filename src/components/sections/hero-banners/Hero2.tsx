"use client";
import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { VideoBackgroundContext } from "@/components/layout/main/Home2";
import medhLogo from "@/assets/images/logo/medh.png";

// Mobile-specific tagline styling - 10% bigger
const mobileTaglineStyles = `
  @media (max-width: 767px) {
    .mobile-tagline-large {
      font-size: 2.2rem !important;
    }
  }
  @media (min-width: 640px) and (max-width: 767px) {
    .mobile-tagline-large {
      font-size: 2.75rem !important;
    }
  }
`;

// Essential icons only - moved outside component for performance
import { 
  ArrowRight, GraduationCap, Users, Star, Clock, BookOpen, TrendingUp,
  Database, Calculator, Rocket, Briefcase, Target, MessageCircle, BarChart3, 
  DollarSign, Code, PenTool, Zap, Shield, Award, Laptop, Heart, Settings, 
  Globe, Scale, Smile, ShoppingCart, Leaf, CheckCircle, Camera, Music, 
  Activity, Lightbulb
} from "lucide-react";

// Complete course categories - all available courses - MOVED OUTSIDE AND FROZEN FOR PERFORMANCE
const COURSE_CATEGORIES = Object.freeze([
  // Live courses (4 items)
  { name: "AI & Data Science", icon: Database, type: "live", url: "/courses?category=AI%20and%20Data%20Science&classType=live" },
  { name: "Digital Marketing", icon: TrendingUp, type: "live", url: "/courses?category=Digital%20Marketing%20with%20Data%20Analytics&classType=live" },
  { name: "Personality Development", icon: Users, type: "live", url: "/courses?category=Personality%20Development&classType=live" },
  { name: "Vedic Mathematics", icon: Calculator, type: "live", url: "/courses?category=Vedic%20Mathematics&classType=live" },
  
  // Blended courses (16 items)
  { name: "AI For Professionals", icon: Rocket, type: "blended", url: "/courses?category=AI%20For%20Professionals" },
  { name: "Business Management", icon: Briefcase, type: "blended", url: "/courses?category=Business%20And%20Management" },
  { name: "Career Development", icon: Target, type: "blended", url: "/courses?category=Career%20Development" },
  { name: "Communication Skills", icon: MessageCircle, type: "blended", url: "/courses?category=Communication%20And%20Soft%20Skills" },
  { name: "Data Analytics", icon: BarChart3, type: "blended", url: "/courses?category=Data%20%26%20Analytics" },
  { name: "Finance & Accounts", icon: DollarSign, type: "blended", url: "/courses?category=Finance%20%26%20Accounts" },
  { name: "Technical Skills", icon: Code, type: "blended", url: "/courses?category=Technical%20Skills" },
  { name: "Sales & Marketing", icon: ShoppingCart, type: "blended", url: "/courses?category=Sales%20%26%20Marketing" },
  { name: "Creative Design", icon: PenTool, type: "blended", url: "/courses?category=Creative%20%26%20Design" },
  { name: "Entrepreneurship", icon: Zap, type: "blended", url: "/courses?category=Entrepreneurship" },
  { name: "Cybersecurity", icon: Shield, type: "blended", url: "/courses?category=Cybersecurity" },
  { name: "Web Development", icon: Laptop, type: "blended", url: "/courses?category=Web%20Development" },
  { name: "Health & Wellness", icon: Heart, type: "blended", url: "/courses?category=Health%20%26%20Wellness" },
  { name: "Personal Development", icon: Settings, type: "blended", url: "/courses?category=Personal%20Development" },
  { name: "Language Learning", icon: Globe, type: "blended", url: "/courses?category=Language%20Learning" },
  { name: "Legal Studies", icon: Scale, type: "blended", url: "/courses?category=Legal%20Studies" },
  { name: "Life Skills", icon: Smile, type: "blended", url: "/courses?category=Life%20Skills" },
  { name: "Environment & Sustainability", icon: Leaf, type: "blended", url: "/courses?category=Environment%20%26%20Sustainability" },
  { name: "Quality Assurance", icon: CheckCircle, type: "blended", url: "/courses?category=Quality%20Assurance" },
  { name: "Photography", icon: Camera, type: "blended", url: "/courses?category=Photography" },
  { name: "Music & Arts", icon: Music, type: "blended", url: "/courses?category=Music%20%26%20Arts" },
  { name: "Sports & Fitness", icon: Activity, type: "blended", url: "/courses?category=Sports%20%26%20Fitness" },
  { name: "Innovation & Research", icon: Lightbulb, type: "blended", url: "/courses?category=Innovation%20%26%20Research" }
] as const);

// Pre-computed category rings - MEMOIZED AND FROZEN FOR MAXIMUM PERFORMANCE
const CATEGORY_RINGS = Object.freeze([...COURSE_CATEGORIES, ...COURSE_CATEGORIES, ...COURSE_CATEGORIES]);

// Define category interface
interface ICourseCategory {
  name: string;
  icon: React.ForwardRefExoticComponent<any>;
  type: "live" | "blended";
  url: string;
}

// HIGHLY OPTIMIZED CategoryCard with React.memo and stable references
const CategoryCard = memo<{
  category: ICourseCategory;
  isDark: boolean;
  onClick: () => void;
}>(({ category, isDark, onClick }) => {
  const IconComponent = category.icon;
  const isLive = category.type === 'live';
  
  // Memoized class names for better performance
  const containerClasses = useMemo(() => {
    return `relative ${isLive ? 'glass-primary' : 'glass-stats'} rounded-xl p-3 md:p-4 hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden flex-shrink-0 w-40 md:w-52 h-28 md:h-36 flex flex-col items-center justify-center`;
  }, [isLive]);
  
  const badgeClasses = useMemo(() => {
    return `absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${
      isLive 
        ? (isDark ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-100 text-primary-700')
        : (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')
    } opacity-90`;
  }, [isLive, isDark]);
  
  const iconClasses = useMemo(() => {
    return `w-6 h-6 md:w-7 md:h-7 ${
      isLive 
        ? (isDark ? 'text-primary-300' : 'text-primary-600')
        : (isDark ? 'text-blue-300' : 'text-blue-600')
    } drop-shadow-lg`;
  }, [isLive, isDark]);
  
  const titleClasses = useMemo(() => {
    return `font-semibold text-xs md:text-sm transition-colors text-center px-1 ${
      isDark ? 'text-white group-hover:text-primary-200' : 'text-gray-900 group-hover:text-primary-500'
    } line-clamp-2`;
  }, [isDark]);
  
  return (
    <div onClick={onClick} className={containerClasses}>
      <div className={badgeClasses}>
        {isLive ? 'Live' : 'Blended'}
      </div>
      
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
        <div className="mb-2 group-hover:scale-110 transition-all duration-300">
          <IconComponent className={iconClasses} />
        </div>
        <h3 className={titleClasses}>
          {category.name}
        </h3>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for even better performance
  return (
    prevProps.category.name === nextProps.category.name &&
    prevProps.category.type === nextProps.category.type &&
    prevProps.isDark === nextProps.isDark
  );
});

CategoryCard.displayName = 'CategoryCard';

// HIGHLY OPTIMIZED InfiniteScrollerCards with React.memo and stable callbacks
const InfiniteScrollerCards = memo<{ isDark: boolean }>(({ isDark }) => {
  const router = useRouter();
  
  // Stable callback using useCallback to prevent unnecessary re-renders
  const handleCategoryClick = useCallback((category: ICourseCategory) => {
    router.push(category.url);
  }, [router]);

  // Use pre-computed rings for maximum performance
  const ringCategories = CATEGORY_RINGS;

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="animate-scroll-infinite flex gap-2 md:gap-3 pl-2 md:pl-4 pr-2 md:pr-4" style={{ width: '300%' }}>
        {ringCategories.map((category, index) => (
          <CategoryCard
            key={`${category.name}-${index}`}
            category={category}
            isDark={isDark}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.isDark === nextProps.isDark;
});

InfiniteScrollerCards.displayName = 'InfiniteScrollerCards';

// HIGHLY OPTIMIZED StatCard with React.memo and memoized classes
const StatCard = memo<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  isDark: boolean;
}>(({ icon, value, label, color, isDark }) => {
  const valueClasses = useMemo(() => {
    return `text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);
  
  const labelClasses = useMemo(() => {
    return `text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium`;
  }, [isDark]);
  
  const colorClasses = useMemo(() => {
    return `mb-1 p-1 ${color.replace('from-', 'bg-').replace('/10', '/20').split(' ')[0]} rounded-md w-fit`;
  }, [color]);

  return (
    <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
      <div className="relative z-10 flex flex-col items-center">
        <div className={colorClasses}>
          {icon}
        </div>
        <div className={valueClasses}>{value}</div>
        <div className={labelClasses}>{label}</div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.color === nextProps.color &&
    prevProps.isDark === nextProps.isDark
  );
});

StatCard.displayName = 'StatCard';

// IMPROVED Mobile Hero with better loading and error handling
const HeroMobile = memo<{
  isLoaded: boolean;
  isDark: boolean;
}>(({ isLoaded, isDark }) => {
  // Always show mobile content, don't wait for isLoaded
  const showContent = true;
  
  // Memoize static class names
  const containerClasses = useMemo(() => {
    return `flex-1 flex flex-col justify-center transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'}`;
  }, [showContent]);
  
  const headingClasses = useMemo(() => {
    return `text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);
  
  const descriptionClasses = useMemo(() => {
    return `text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`;
  }, [isDark]);
  
  const ctaClasses = useMemo(() => {
    return `inline-flex items-center justify-center py-2.5 px-5 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group text-sm relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg hover:shadow-primary-500/25 glass-stats' 
        : 'bg-white/90 backdrop-blur-md text-gray-900 border-2 border-primary-500/30 hover:border-primary-500/60 hover:bg-white/95 shadow-lg hover:shadow-xl'
    }`;
  }, [isDark]);
  
  const taglineClasses = useMemo(() => {
    return `mumkinMedh font-extrabold leading-tight ${
      isDark 
        ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
        : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
    }`;
  }, [isDark]);

  return (
    <div className="mobile-hero-wrapper h-screen max-h-[100vh] relative overflow-hidden">
      <style jsx>{mobileTaglineStyles}</style>
      <div className="relative z-10 px-4 py-2 flex flex-col h-full justify-center text-center">
        <div className={containerClasses}>

          {/* Main Hero Card */}
          <div className="mx-auto mb-4 glass-container rounded-2xl p-4 shadow-2xl max-w-md">
            <div className="text-center">
              {/* Certification Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                <div className={`inline-flex items-center px-2 py-1 glass-stats rounded-full text-xs font-medium opacity-95 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <Shield size={10} className="mr-1" />
                  ISO Certified
                </div>
                <div className={`inline-flex items-center px-2 py-1 glass-stats rounded-full text-xs font-medium opacity-95 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  <Award size={10} className="mr-1" />
                  STEM Certified
                </div>
              </div>
              
              {/* Main Heading */}
              <h1 className={headingClasses}>
                Unlock Your Potential Journey <em className="font-normal inline-flex items-baseline mr-1" style={{ transform: 'scale(0.9)' }}>with</em>
                <span className="inline-flex items-baseline align-baseline">
                  <Image 
                    src={medhLogo} 
                    alt="Medh Logo" 
                    width={24} 
                    height={24} 
                    priority 
                    sizes="24px" 
                    className="inline-block h-6 sm:h-8 w-auto align-baseline"
                    style={{ 
                      filter: 'brightness(1.1) contrast(1.2)',
                      transform: 'scale(0.9) translateY(2px)',
                      verticalAlign: 'baseline'
                    }}
                  />
                </span>
              </h1>
              
              {/* Description */}
              <p className={descriptionClasses}>
                Join our expert-led courses and master the skills that drive industry innovation globally.
              </p>
              
              {/* Category Chips - Simplified */}
              <div className="mt-3 mb-3">
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-center space-x-1">
                      <BookOpen className={`w-3 h-3 ${isDark ? 'text-primary-300' : 'text-primary-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Children & Teens</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className={`w-3 h-3 ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Professionals</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Homemakers</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Lifelong Learners</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-3 sm:mt-4">
                <Link href="/courses" className={ctaClasses}>
                  <span className="relative z-10 font-bold">Explore Courses</span>
                  <ArrowRight size={14} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Tagline */}
              <div className="mt-3 mb-4 sm:mb-5 w-full overflow-hidden" style={{ marginTop: 'calc(0.75rem + 2vh)' }}>
                <div className={taglineClasses} style={{ 
                  fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                  transform: 'scaleX(1.1)', 
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

          {/* Mobile Stats */}
          <div className="flex justify-center px-1 mb-3 sm:mb-4">
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs">
              <StatCard
                icon={<GraduationCap className={`w-3 h-3 ${isDark ? 'text-primary-300' : 'text-primary-700'}`} />}
                value="100+"
                label="Courses"
                color="from-primary-500/10"
                isDark={isDark}
              />
              <StatCard
                icon={<Users className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />}
                value="All"
                label="Ages"
                color="from-purple-500/10"
                isDark={isDark}
              />
              <StatCard
                icon={<Clock className={`w-3 h-3 ${isDark ? 'text-secondary-300' : 'text-secondary-700'}`} />}
                value="Live"
                label="Classes"
                color="from-secondary-500/10"
                isDark={isDark}
              />
              <StatCard
                icon={<Star className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />}
                value="Global"
                label="Access"
                color="from-blue-500/10"
                isDark={isDark}
              />
            </div>
          </div>

          {/* Infinite Scroller */}
          <div className="mb-3 sm:mb-4">
            <InfiniteScrollerCards isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isLoaded === nextProps.isLoaded &&
    prevProps.isDark === nextProps.isDark
  );
});

HeroMobile.displayName = 'HeroMobile';

// Improved mobile detection hook with better SSR handling
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      if (typeof window === 'undefined') return false;
      
      // Multiple checks for better mobile detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileUA || isMobileScreen || isTouchDevice;
    };
    
    const updateMobile = () => {
      const newIsMobile = checkMobile();
      setIsMobile(prev => prev !== newIsMobile ? newIsMobile : prev);
    };
    
    updateMobile();
    
    // Throttled resize listener
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateMobile, 100);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', updateMobile, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateMobile);
    };
  }, []);

  return { isMobile, mounted };
};

// IMPROVED Main Hero component with better mobile handling and error boundaries
const Hero2: React.FC<{ isCompact?: boolean }> = memo(({ isCompact = false }) => {
  const { theme } = useTheme();
  const { isMobile, mounted } = useMobileDetection();
  const videoContext = useContext(VideoBackgroundContext);
  
  // Improved state management with fallbacks
  const [contextReady, setContextReady] = useState(false);
  
  // Check if context is ready
  useEffect(() => {
    if (videoContext) {
      setContextReady(true);
    }
  }, [videoContext]);
  
  // Memoize computed values with fallbacks
  const isDark = useMemo(() => {
    if (!mounted) return true; // Default to dark during SSR
    return theme === 'dark';
  }, [mounted, theme]);
  
  // Provide fallback for video context
  const isLoaded = useMemo(() => {
    if (!contextReady) return true; // Show content immediately if no context
    return videoContext?.isLoaded ?? true;
  }, [contextReady, videoContext?.isLoaded]);

  // Memoized class names for desktop version
  const desktopContainerClasses = useMemo(() => {
    return `flex-1 flex flex-col justify-center transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`;
  }, [isLoaded]);
  
  const desktopHeadingClasses = useMemo(() => {
    return `text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);
  
  const desktopDescriptionClasses = useMemo(() => {
    return `text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`;
  }, [isDark]);
  
  const desktopCtaClasses = useMemo(() => {
    return `inline-flex items-center justify-center px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 group text-sm sm:text-base md:text-lg relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-primary-500/30 glass-stats' 
        : 'bg-white/95 backdrop-blur-lg text-gray-900 border-2 border-primary-500/40 hover:border-primary-500/70 hover:bg-white shadow-2xl hover:shadow-3xl'
    }`;
  }, [isDark]);
  
  const desktopTaglineClasses = useMemo(() => {
    return `mumkinMedh font-extrabold leading-tight ${
      isDark 
        ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
        : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
    }`;
  }, [isDark]);

  // Simplified loading state - show basic content immediately
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile version with improved error handling
  if (isMobile) {
    return (
      <div className="min-h-screen">
        <HeroMobile isLoaded={isLoaded} isDark={isDark} />
      </div>
    );
  }

  // Desktop version - improved with better fallbacks
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center py-4 md:py-6 lg:py-8">
          
          {/* Hero Text Section */}
          <div className={`mb-2 md:mb-3 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
            <div className="glass-container rounded-3xl p-8 md:p-12 mb-1" style={{ transform: 'scale(0.9)' }}>
              <div className="flex flex-wrap justify-center gap-3 mb-3 sm:mb-4">
                <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 glass-stats rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  <Shield size={10} className="mr-1 sm:w-3 sm:h-3" />
                  ISO Certified
                </div>
                <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 glass-stats rounded-full text-xs sm:text-sm font-medium opacity-95 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  <Award size={10} className="mr-1 sm:w-3 sm:h-3" />
                  STEM Certified
                </div>
              </div>
               
              <h1 className={desktopHeadingClasses}>
                Unlock Your Potential Journey <em className="font-semibold inline-flex items-baseline mr-1" style={{ transform: 'scale(0.9)' }}>with</em>
                <span className="inline-flex items-baseline align-baseline">
                  <Image 
                    src={medhLogo} 
                    alt="Medh Logo" 
                    width={24} 
                    height={24} 
                    priority 
                    sizes="24px" 
                    className="inline-block h-6 sm:h-8 md:h-9 lg:h-12 xl:h-14 w-auto align-baseline"
                    style={{ 
                      filter: 'brightness(1.1) contrast(1.2)',
                      transform: 'scale(0.9) translateY(2px)',
                      verticalAlign: 'baseline'
                    }}
                  />
                </span>
              </h1>
                
              <p className={desktopDescriptionClasses}>
                Join our expert-led courses and master the skills that drive industry innovation globally.
              </p>

              {/* Category Chips - Desktop - Simplified */}
              <div className="mt-4 mb-4 sm:mt-6 sm:mb-6">
                <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
                  <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-2">
                      <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-primary-300' : 'text-primary-600'} group-hover:scale-110 transition-transform`} />
                      <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Children & Teens</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-secondary-300' : 'text-secondary-600'} group-hover:scale-110 transition-transform`} />
                      <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Professionals</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-2">
                      <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-purple-300' : 'text-purple-600'} group-hover:scale-110 transition-transform`} />
                      <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Homemakers</span>
                    </div>
                  </div>

                  <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-2">
                      <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-transform`} />
                      <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Lifelong Learners</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-4 sm:mt-6 md:mt-8">
                <Link href="/courses" className={desktopCtaClasses}>
                  <span className="relative z-10 font-extrabold tracking-wide">Explore Courses</span>
                  <ArrowRight size={16} className="relative z-10 ml-3 group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Link>
              </div>

              {/* Tagline */}
              <div className="pt-4 mb-2 w-full overflow-hidden" style={{ paddingTop: 'calc(1rem + 2vh)' }}>
                <div className={desktopTaglineClasses} style={{ 
                  fontSize: 'clamp(2rem, 8vw, 5rem)',
                  transform: 'scaleX(1.1)', 
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
          
          {/* Infinite Scroller Section */}
          <div className={`w-full mb-2 sm:mb-3 md:mb-4 transition-all duration-500 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
            <InfiniteScrollerCards isDark={isDark} />
          </div>
                  
          {/* Enhanced Stats Grid */}
          <div className={`mb-6 sm:mb-8 md:mb-12 transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-5xl lg:max-w-6xl mx-auto">
              <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>100+</div>
                  <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-primary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Expert Courses</div>
                  <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>All Skill Levels</div>
                </div>
              </div>
              
              <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>Every</div>
                  <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-purple-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Age Group</div>
                  <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>8 to 80+ Years</div>
                </div>
              </div>
              
              <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>Live</div>
                  <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-secondary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Interactive</div>
                  <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>Real-time Classes</div>
                </div>
              </div>
              
              <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>Global</div>
                  <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Learning</div>
                  <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>Worldwide Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  return prevProps.isCompact === nextProps.isCompact;
});

Hero2.displayName = 'Hero2';

export default Hero2; 