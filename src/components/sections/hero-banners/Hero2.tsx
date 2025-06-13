"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import stemImg from "@/assets/images/iso/iso-STEM.jpg";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import { useTheme } from "next-themes";
import "@/assets/css/ovalAnimation.css";
import "@/styles/glassmorphism.css";
import { VideoBackgroundContext } from "@/components/layout/main/Home2";

// Optimized theme attribute update
const updateThemeAttribute = (isDark: boolean) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

// Theme-aware style injection - will be handled in component
import CourseCard from "@/components/sections/courses/CourseCard";
import { ArrowRight, ChevronRight, GraduationCap, Users, Star, Clock, Sparkles, BookOpen, Target, TrendingUp, Menu, Brain, Lightbulb, Calculator, Rocket, Play, CheckCircle, Heart, Shield, Briefcase, MessageCircle, BarChart3, DollarSign, Activity, Settings, Globe, Scale, Smile, ShoppingCart, Code, Leaf, Laptop, Camera, Music, PenTool, Zap, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader2 from "@/components/shared/others/Preloader2";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import medhLogo from "@/assets/images/logo/medh.png";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import { ICourse } from "@/types/course.types";

// Server-side video optimization is now handled in Home2.tsx - these URLs are managed globally

// Define interfaces for component props
interface IHeroMobileProps {
  isLoaded: boolean;
  featuredCourses: ICourse[];
  loading: boolean;
}



// Comprehensive course categories data for infinite scroll
const courseCategories = [
  // Live Courses
  {
    name: "AI & Data Science",
    description: "Learn cutting-edge artificial intelligence and data science techniques",
    type: "live" as const,
    icon: Brain,
    badge: "Live",
    url: "/courses?category=AI%20and%20Data%20Science&classType=live"
  },
  {
    name: "Digital Marketing",
    description: "Master digital marketing strategies and data analytics",
    type: "live" as const,
    icon: TrendingUp,
    badge: "Live",
    url: "/courses?category=Digital%20Marketing%20with%20Data%20Analytics&classType=live"
  },
  {
    name: "Personality Development",
    description: "Enhance your personal and professional skills",
    type: "live" as const,
    icon: Users,
    badge: "Live",
    url: "/courses?category=Personality%20Development&classType=live"
  },
  {
    name: "Vedic Mathematics",
    description: "Ancient mathematical techniques for modern problem-solving",
    type: "live" as const,
    icon: Calculator,
    badge: "Live",
    url: "/courses?category=Vedic%20Mathematics&classType=live"
  },
  
  // Blended Courses - 14 core categories
  {
    name: "AI For Professionals",
    description: "AI applications for working professionals",
    type: "blended" as const,
    icon: Rocket,
    badge: "Blended",
    url: "/courses?category=AI%20For%20Professionals"
  },
  {
    name: "Business And Management",
    description: "Strategic business and leadership skills",
    type: "blended" as const,
    icon: Briefcase,
    badge: "Blended",
    url: "/courses?category=Business%20And%20Management"
  },
  {
    name: "Career Development",
    description: "Advance your career with proven strategies",
    type: "blended" as const,
    icon: Target,
    badge: "Blended",
    url: "/courses?category=Career%20Development"
  },
  {
    name: "Communication & Soft Skills",
    description: "Master interpersonal and communication skills",
    type: "blended" as const,
    icon: MessageCircle,
    badge: "Blended",
    url: "/courses?category=Communication%20And%20Soft%20Skills"
  },
  {
    name: "Data & Analytics",
    description: "Advanced data analysis and visualization",
    type: "blended" as const,
    icon: BarChart3,
    badge: "Blended",
    url: "/courses?category=Data%20%26%20Analytics"
  },
  {
    name: "Finance & Accounts",
    description: "Financial management and accounting skills",
    type: "blended" as const,
    icon: DollarSign,
    badge: "Blended",
    url: "/courses?category=Finance%20%26%20Accounts"
  },
  {
    name: "Health & Wellness",
    description: "Comprehensive health and wellness programs",
    type: "blended" as const,
    icon: Heart,
    badge: "Blended",
    url: "/courses?category=Health%20%26%20Wellness"
  },
  {
    name: "Industry-Specific Skills",
    description: "Specialized skills for various industries",
    type: "blended" as const,
    icon: Settings,
    badge: "Blended",
    url: "/courses?category=Industry-Specific%20Skills"
  },
  {
    name: "Language & Linguistic",
    description: "Master new languages and communication",
    type: "blended" as const,
    icon: Globe,
    badge: "Blended",
    url: "/courses?category=Language%20%26%20Linguistic"
  },
  {
    name: "Legal & Compliance Skills",
    description: "Legal knowledge and compliance training",
    type: "blended" as const,
    icon: Scale,
    badge: "Blended",
    url: "/courses?category=Legal%20%26%20Compliance%20Skills"
  },
  {
    name: "Personal Well-Being",
    description: "Mental health and personal development",
    type: "blended" as const,
    icon: Smile,
    badge: "Blended",
    url: "/courses?category=Personal%20Well-Being"
  },
  {
    name: "Sales & Marketing",
    description: "Advanced sales techniques and marketing strategies",
    type: "blended" as const,
    icon: ShoppingCart,
    badge: "Blended",
    url: "/courses?category=Sales%20%26%20Marketing"
  },
  {
    name: "Technical Skills",
    description: "Programming, development, and technical expertise",
    type: "blended" as const,
    icon: Code,
    badge: "Blended",
    url: "/courses?category=Technical%20Skills"
  },
  {
    name: "Environmental & Sustainability",
    description: "Green skills for a sustainable future",
    type: "blended" as const,
    icon: Leaf,
    badge: "Blended",
    url: "/courses?category=Environmental%20and%20Sustainability%20Skills"
  },
  {
    name: "Creative & Design",
    description: "Unleash your creativity with design skills",
    type: "blended" as const,
    icon: PenTool,
    badge: "Blended",
    url: "/courses?category=Creative%20%26%20Design"
  },
  {
    name: "Entrepreneurship",
    description: "Build and scale your own business",
    type: "blended" as const,
    icon: Zap,
    badge: "Blended",
    url: "/courses?category=Entrepreneurship"
  },
  {
    name: "Project Management",
    description: "Master project planning and execution",
    type: "blended" as const,
    icon: CheckCircle,
    badge: "Blended",
    url: "/courses?category=Project%20Management"
  },
  {
    name: "Cybersecurity",
    description: "Protect digital assets and systems",
    type: "blended" as const,
    icon: Shield,
    badge: "Blended",
    url: "/courses?category=Cybersecurity"
  },
  {
    name: "Content Creation",
    description: "Create engaging digital content",
    type: "blended" as const,
    icon: Camera,
    badge: "Blended",
    url: "/courses?category=Content%20Creation"
  },
  {
    name: "Music & Arts",
    description: "Explore creative expression through arts",
    type: "blended" as const,
    icon: Music,
    badge: "Blended",
    url: "/courses?category=Music%20%26%20Arts"
  },
  {
    name: "Fitness & Sports",
    description: "Physical fitness and sports training",
    type: "blended" as const,
    icon: Activity,
    badge: "Blended",
    url: "/courses?category=Fitness%20%26%20Sports"
  },
  {
    name: "Web Development",
    description: "Build modern websites and applications",
    type: "blended" as const,
    icon: Laptop,
    badge: "Blended",
    url: "/courses?category=Web%20Development"
  },
  {
    name: "Quality Assurance",
    description: "Master software testing and QA processes",
    type: "blended" as const,
    icon: Award,
    badge: "Blended",
    url: "/courses?category=Quality%20Assurance"
  }
];

// Enhanced Infinite Scroller Component with Mobile Optimization and Theme Support
interface IInfiniteScrollerCardsProps {
  isDark?: boolean;
}

const InfiniteScrollerCards: React.FC<IInfiniteScrollerCardsProps> = React.memo(({ isDark = false }) => {
  const router = useRouter();
  
  // Memoized ring categories to prevent unnecessary recalculations
  const ringCategories = useMemo(() => [
    ...courseCategories, 
    ...courseCategories, 
    ...courseCategories, 
    ...courseCategories, 
    ...courseCategories, 
    ...courseCategories
  ], []);

  // Memoized category click handler
  const handleCategoryClick = useCallback((category: typeof courseCategories[0]) => {
    router.push(category.url);
  }, [router]);

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="animate-scroll-infinite scroll-container flex gap-2 md:gap-3 pl-2 md:pl-4 pr-2 md:pr-4" style={{ width: 'calc(600%)', minWidth: 'calc(600%)' }}>
        {ringCategories.map((category, index) => {
          const IconComponent = category.icon;
          const getGlassClass = (type: string) => {
            return type === 'live' ? 'glass-primary' : 'glass-stats';
          };

          const getIconColor = (type: string) => {
            return type === 'live' 
              ? (isDark ? 'text-primary-300' : 'text-primary-600')
              : (isDark ? 'text-blue-300' : 'text-blue-600');
          };

          const getGradient = (type: string) => {
            return type === 'live' 
              ? 'from-primary-500/10 to-transparent'
              : 'from-blue-500/10 to-transparent';
          };

          const getHoverColor = (type: string) => {
            return type === 'live'
              ? (isDark ? 'group-hover:text-primary-200' : 'group-hover:text-primary-500')
              : (isDark ? 'group-hover:text-blue-200' : 'group-hover:text-blue-500');
          };

          const getBadgeColor = (type: string) => {
            return type === 'live'
              ? (isDark ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-100 text-primary-700')
              : (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700');
          };

          return (
              <div
                key={`${category.name}-${index}`}
                onClick={() => handleCategoryClick(category)}
                className={`relative ${getGlassClass(category.type)} rounded-xl md:rounded-2xl p-3 md:p-4 hover:scale-105 transition-all duration-500 group cursor-pointer overflow-hidden flex-shrink-0 w-40 md:w-52 h-28 md:h-36 flex flex-col items-center justify-center`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(category.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
                
                {/* Badge */}
                <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(category.type)} opacity-90`}>
                  {category.badge}
                </div>
                
                <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                  <div className="mb-2 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className={`w-6 h-6 md:w-7 md:h-7 ${getIconColor(category.type)} drop-shadow-lg`} />
                  </div>
                  <h3 className={`font-semibold text-xs md:text-sm ${getHoverColor(category.type)} transition-colors text-center px-1 ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs mt-1 hidden md:block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium text-center px-1 line-clamp-1`}>
                    {category.description}
                  </p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
});

InfiniteScrollerCards.displayName = 'InfiniteScrollerCards';

// Enhanced Mobile version with glassmorphism and theme support - Server optimized
const HeroMobile: React.FC<IHeroMobileProps> = React.memo(({ isLoaded, featuredCourses, loading }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const videoContext = useContext(VideoBackgroundContext);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR
  
  // Optimized theme attribute update
  useEffect(() => {
    if (mounted) {
      updateThemeAttribute(isDark);
    }
  }, [mounted, isDark]);
  
  return (
    <div className="mobile-hero-wrapper h-screen max-h-[100vh] relative overflow-hidden">
      {/* No video background here - using shared video from Home2.tsx context */}

      {/* Content - Centered Layout with Glassmorphism */}
      <div className="relative z-10 px-4 py-2 flex flex-col h-full justify-center text-center">
        {/* Main Hero Card */}
        <div className={`flex-1 flex flex-col justify-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Hero Content Card with Enhanced Glassmorphism */}
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
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Unlock Your Potential Journey <em className="font-normal">with</em>{' '}
                <span className="inline-flex items-center">
                  <Image 
                    src={medhLogo} 
                    alt="Medh Logo" 
                    width={24} 
                    height={24} 
                    className="inline-block mx-1 h-6 sm:h-8 w-auto"
                    style={{ filter: 'brightness(1.1) contrast(1.2)' }}
                  />
                </span>
              </h1>
              
              {/* Description */}
              <p className={`text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>
                Join our expert-led courses and master the skills that drive industry innovation globally.
              </p>
              
              

              {/* Category Chips */}
              <div className="mt-3 mb-3">
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  {/* Children & Teens */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <BookOpen className={`w-3 h-3 ${isDark ? 'text-primary-300' : 'text-primary-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Children & Teens</span>
                    </div>
                  </div>

                  {/* Professionals */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <Users className={`w-3 h-3 ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Professionals</span>
                    </div>
                  </div>

                  {/* Homemakers */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <Star className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Homemakers</span>
                    </div>
                  </div>

                  {/* Lifelong Learners */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <TrendingUp className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Lifelong Learners</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-3 sm:mt-4">
                <Link 
                  href="/courses" 
                  className={`inline-flex items-center justify-center py-2.5 px-5 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group text-sm relative overflow-hidden ${
                    isDark 
                      ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg hover:shadow-primary-500/25 glass-stats' 
                      : 'bg-white/90 backdrop-blur-md text-gray-900 border-2 border-primary-500/30 hover:border-primary-500/60 hover:bg-white/95 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {!isDark && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                  <span className="relative z-10 font-bold">Explore Courses</span>
                  <ArrowRight size={14} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              {/* Tagline - Enhanced Size with spacing and horizontal expansion */}
              <div className="mt-6 mb-4 sm:mb-5">
                <div className={`mumkinMedh text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight ${
                  isDark 
                    ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                    : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
                }`} style={{ transform: 'scaleX(1.1)', letterSpacing: '0.05em' }}>
                  Medh Hai Toh Mumkin Hai !
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Mobile Stats Points */}
          <div className="flex justify-center px-1 mb-3 sm:mb-4">
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs">
              
              {/* Courses Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-primary-500/20 rounded-md w-fit">
                    <GraduationCap className={`w-3 h-3 ${isDark ? 'text-primary-300' : 'text-primary-700'}`} />
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>100+</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>Courses</div>
                </div>
              </div>

              {/* Age Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-purple-500/20 rounded-md w-fit">
                    <Users className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>All</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>Ages</div>
                </div>
              </div>
              
              {/* Live Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-secondary-500/20 rounded-md w-fit relative">
                    <Clock className={`w-3 h-3 ${isDark ? 'text-secondary-300' : 'text-secondary-700'}`} />
                    <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-red-600 rounded-full animate-pulse shadow-sm"></div>
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>Classes</div>
                </div>
              </div>

              {/* Global Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-blue-500/20 rounded-md w-fit">
                    <Star className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Global</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>Access</div>
                </div>
              </div>
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
});

HeroMobile.displayName = 'HeroMobile';

interface IHero1Props {
  isCompact?: boolean;
}

// Enhanced Main Hero component with server-side optimization and theme support
const Hero1: React.FC<IHero1Props> = React.memo(({ isCompact = false }) => {
  const { theme } = useTheme();
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  const videoContext = useContext(VideoBackgroundContext);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR
  
  // Use video context for loading state - server optimized
  const isLoaded = videoContext.isLoaded;

  // Mount and theme effects
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Optimized theme attribute update
  useEffect(() => {
    if (mounted) {
      updateThemeAttribute(isDark);
    }
  }, [mounted, isDark]);

  // Check for mobile view - optimized
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch featured courses
  useEffect(() => {
    const fetchFeaturedCourses = (): void => {
      getQuery({
        url: getAllCoursesWithLimits({
          page: 1,
          limit: 4,
          status: "Published"
        }),
        onSuccess: (data: { courses: ICourse[] }) => {
          const sortedCourses = (data?.courses || [])
            .sort((a: ICourse, b: ICourse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
          setFeaturedCourses(sortedCourses);
          setLoading(false);
        },
        onFail: (error: any) => {
          console.error("Error fetching courses:", error);
          setLoading(false);
        },
      });
    };

    fetchFeaturedCourses();
  }, [getQuery]);

  // Conditionally render mobile or desktop version - server optimized
  if (isMobile) {
    return (
        <HeroMobile 
          isLoaded={isLoaded} 
          featuredCourses={featuredCourses} 
          loading={loading} 
        />
    );
  }

  // Enhanced Desktop version with server-side optimization - no duplicate video
  return (
        <section className="relative min-h-screen overflow-hidden">
             {/* No video background here - using shared video from Home2.tsx context */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Main Content with Enhanced Glassmorphism */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center py-4 md:py-6 lg:py-8">
          
          {/* Hero Text Section with Glass Container */}
          <div className={`mb-2 md:mb-3 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="glass-container rounded-3xl p-8 md:p-12 mb-1" style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}>
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
               
               <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>
                 Unlock Your Potential Journey <em className="font-semibold">with</em>{' '}
                 <span className="inline-flex items-center">
                   <Image 
                     src={medhLogo} 
                     alt="Medh Logo" 
                     width={24} 
                     height={24} 
                     className="inline-block mx-2 h-6 sm:h-8 md:h-9 lg:h-12 xl:h-14 w-auto"
                     style={{ filter: 'brightness(1.1) contrast(1.2)' }}
                   />
                  </span>
                </h1>
                
               <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium`}>
                 Join our expert-led courses and master the skills that drive industry innovation globally.
                </p>


               {/* Category Chips - Desktop */}
               <div className="mt-4 mb-4 sm:mt-6 sm:mb-6">
                 <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
                   {/* Children & Teens */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-primary-300' : 'text-primary-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Children & Teens</span>
                     </div>
                   </div>

                   {/* Professionals */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-secondary-300' : 'text-secondary-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Professionals</span>
                     </div>
                   </div>

                   {/* Homemakers */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-purple-300' : 'text-purple-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Homemakers</span>
                     </div>
                   </div>

                   {/* Lifelong Learners */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center leading-tight`}>Lifelong Learners</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Enhanced CTA Button */}
               <div className="mt-4 sm:mt-6 md:mt-8">
                 <Link 
                   href="/courses" 
                   className={`inline-flex items-center justify-center px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 group text-sm sm:text-base md:text-lg relative overflow-hidden ${
                     isDark 
                       ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-primary-500/30 glass-stats' 
                       : 'bg-white/95 backdrop-blur-lg text-gray-900 border-2 border-primary-500/40 hover:border-primary-500/70 hover:bg-white shadow-2xl hover:shadow-3xl'
                   }`}
                   style={isDark ? { textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)' } : {}}
                 >
                   {!isDark && (
                     <>
                       <div className="absolute inset-0 bg-gradient-to-r from-primary-50/60 to-purple-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                       <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-purple-100/20 animate-pulse"></div>
                     </>
                   )}
                   <span className="relative z-10 font-extrabold tracking-wide">Explore Courses</span>
                   <ArrowRight size={16} className="relative z-10 ml-3 group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4 md:w-5 md:h-5" />
                   
                   {/* Shine effect for light mode */}
                   {!isDark && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   )}
                 </Link>
               </div>
               {/* Tagline - Enhanced Size with spacing and horizontal expansion */}
               <div className="pt-8 mb-2">
                 <div className={`mumkinMedh text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight ${
                   isDark 
                     ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                     : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
                 }`} style={{ transform: 'scaleX(1.1)', letterSpacing: '0.05em' }}>
                   Medh Hai Toh Mumkin Hai !
                 </div>
               </div>
             </div>
          </div>
          
           {/* Enhanced Infinite Scroller Section */}
           <div className={`w-full mb-2 sm:mb-3 md:mb-4 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
             <InfiniteScrollerCards isDark={isDark} />
                  </div>
                  
                       {/* Enhanced Stats Grid with Glassmorphism */}
            <div className={`mb-6 sm:mb-8 md:mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-5xl lg:max-w-6xl mx-auto">
                {/* Courses Card */}
                <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>100+</div>
                    <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-primary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Expert Courses</div>
                    <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>All Skill Levels</div>
                  </div>
                </div>
              
               {/* Age Groups Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                 <div className="relative z-10">
                   <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>Every</div>
                   <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-purple-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Age Group</div>
                   <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>8 to 80+ Years</div>
                 </div>
               </div>
              
               {/* Live Learning Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                 <div className="relative z-10">
                   <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>Live</div>
                   <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-secondary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>Interactive</div>
                   <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium`}>Real-time Classes</div>
                 </div>
               </div>
              
               {/* Global Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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
});

Hero1.displayName = 'Hero1';

export default Hero1; 