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
import { VideoBackgroundContext } from "@/components/layout/main/Home2";

// Enhanced custom animations for the hero section with theme-aware glassmorphism
const getThemeStyles = (isDark: boolean) => `
  @keyframes animate-gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes animate-bounce-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes animate-pulse-slow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.4; }
  }
  
  @keyframes animate-pulse-slower {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.2; }
  }
  
  @keyframes scroll-infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-16.666%); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes theme-transition {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: animate-gradient-x 3s ease infinite;
  }
  
  .animate-bounce-slow {
    animation: animate-bounce-slow 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: animate-pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-pulse-slower {
    animation: animate-pulse-slower 6s ease-in-out infinite;
  }
  
  .animate-scroll-infinite {
    animation: scroll-infinite 35s linear infinite;
  }
  
  .animate-scroll-infinite:hover {
    animation-play-state: paused;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}, transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-theme-transition {
    animation: theme-transition 0.5s ease-in-out;
  }
  
  .scroll-container {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-stops));
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
  
  .glass-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-card {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.2)' 
      : 'rgba(255, 255, 255, 0.3)'};
    backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.5)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
        : '0 4px 20px rgba(0, 0, 0, 0.08)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
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
  
  .glass-stats::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.4)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
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
  
  .glass-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(59, 172, 99, 0.05), rgba(59, 172, 99, 0.01), rgba(59, 172, 99, 0.03)' 
      : 'rgba(59, 172, 99, 0.3), rgba(59, 172, 99, 0.1), rgba(59, 172, 99, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-purple {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(147, 51, 234, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(147, 51, 234, 0.08)' 
      : 'rgba(147, 51, 234, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(147, 51, 234, 0.2)' 
        : '0 4px 20px rgba(147, 51, 234, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-purple::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(147, 51, 234, 0.05), rgba(147, 51, 234, 0.01), rgba(147, 51, 234, 0.03)' 
      : 'rgba(147, 51, 234, 0.3), rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-secondary {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(34, 197, 94, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(34, 197, 94, 0.08)' 
      : 'rgba(34, 197, 94, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(34, 197, 94, 0.2)' 
        : '0 4px 20px rgba(34, 197, 94, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-secondary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.01), rgba(34, 197, 94, 0.03)' 
      : 'rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .glass-blue {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.25)' 
      : 'rgba(59, 130, 246, 0.15)'};
    backdrop-filter: blur(15px);
    border: 1px solid ${isDark 
      ? 'rgba(59, 130, 246, 0.08)' 
      : 'rgba(59, 130, 246, 0.4)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 4px 20px rgba(59, 130, 246, 0.2)' 
        : '0 4px 20px rgba(59, 130, 246, 0.15)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.7)'},
      inset 0 -1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(255, 255, 255, 0.3)'};
    position: relative;
  }
  
  .glass-blue::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, ${isDark 
      ? 'rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.01), rgba(59, 130, 246, 0.03)' 
      : 'rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)'});
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
  
  .video-overlay {
    background: ${isDark 
      ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 50%, rgba(0, 0, 0, 0.02) 100%)' 
      : 'transparent'};
  }
  
  .hero-mumkin-mobile {
    font-size: clamp(1rem, 3.5vw, 1.75rem) !important;
  }
  
  .hero-mumkin-desktop {
    font-size: clamp(1.5rem, 5vw, 3rem) !important;
  }
  
  /* Enhanced text shadows for better readability */
  .text-shadow-light {
    text-shadow: ${isDark 
      ? '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.6)' 
      : '1px 1px 3px rgba(0, 0, 0, 0.3), 0 0 6px rgba(0, 0, 0, 0.2)'};
  }
  
  .text-shadow-medium {
    text-shadow: ${isDark 
      ? '1px 1px 4px rgba(0, 0, 0, 0.7)' 
      : '1px 1px 2px rgba(0, 0, 0, 0.4)'};
  }
  
  .text-shadow-subtle {
    text-shadow: ${isDark 
      ? '1px 1px 3px rgba(0, 0, 0, 0.6)' 
      : '0.5px 0.5px 1px rgba(0, 0, 0, 0.3)'};
  }
`;

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

// Simple video optimization for better performance
const OPTIMIZED_VIDEO_URLS = {
  DARK_THEME: "https://d2cxn2x1vtrou8.cloudfront.net/Website/1659171_Trapcode_Particles_3840x2160.mp4",
  LIGHT_THEME: "https://d2cxn2x1vtrou8.cloudfront.net/Website/0_Technology_Abstract_4096x2304.mp4"
};

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
                  <h3 className={`font-semibold text-xs md:text-sm ${getHoverColor(category.type)} transition-colors text-center px-1 ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-medium line-clamp-2`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs mt-1 hidden md:block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium text-shadow-subtle text-center px-1 line-clamp-1`}>
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

// Enhanced Mobile version with glassmorphism and theme support
const HeroMobile: React.FC<IHeroMobileProps> = React.memo(({ isLoaded, featuredCourses, loading }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const videoContext = useContext(VideoBackgroundContext);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR
  
  // Inject theme-aware styles
  useEffect(() => {
    if (!mounted) return;
    
    // Debug log for theme changes
    console.log('Hero Mobile theme changed:', isDark ? 'dark' : 'light');
    
    const existingStyle = document.getElementById('hero-mobile-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'hero-mobile-theme-styles';
    styleSheet.innerText = getThemeStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('hero-mobile-theme-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);
  
  return (
    <div className="mobile-hero-wrapper h-screen max-h-[100vh] relative overflow-hidden animate-theme-transition">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          key={`mobile-video-${isDark ? 'dark' : 'light'}`}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-2000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ filter: isDark ? 'brightness(0.6) contrast(1.2) saturate(0.9) hue-rotate(10deg)' : 'brightness(0.9) contrast(1.0) saturate(1.0)' }}
        >
          <source src={isDark ? "https://d2cxn2x1vtrou8.cloudfront.net/Website/1659171_Trapcode_Particles_3840x2160.mp4" : "https://d2cxn2x1vtrou8.cloudfront.net/Website/0_Technology_Abstract_4096x2304.mp4"} type="video/mp4" />
        </video>
        
        {/* Video overlay for better text readability - theme aware */}
        <div className={`absolute inset-0 ${isDark ? 'video-overlay' : ''}`}></div>
      </div>

      {/* Content - Centered Layout with Glassmorphism */}
      <div className="relative z-10 px-4 py-2 flex flex-col h-full justify-center text-center">
        {/* Main Hero Card */}
        <div className={`flex-1 flex flex-col justify-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Hero Content Card with Enhanced Glassmorphism */}
          <div className="mx-auto mb-4 glass-container rounded-2xl p-4 shadow-2xl max-w-md">
            <div className="text-center">
              {/* Badge */}
              <div className={`inline-flex items-center px-2 py-1 glass-stats rounded-full text-xs font-medium mb-2 opacity-95 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                <Sparkles size={10} className="mr-1" />
                Expert-Led Learning Platform
              </div>
              
              {/* Main Heading */}
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Unlock Your Potential Journey With{' '}
                <span className="relative font-extrabold" style={{ color: '#3bac63' }}>
                  Medh
                </span>
              </h1>
              
              {/* Description */}
              <p className={`text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-medium`}>
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
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle`}>Children & Teens</span>
                    </div>
                  </div>

                  {/* Professionals */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <Users className={`w-3 h-3 ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle`}>Professionals</span>
                    </div>
                  </div>

                  {/* Homemakers */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <Star className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle`}>Homemakers</span>
                    </div>
                  </div>

                  {/* Lifelong Learners */}
                  <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <TrendingUp className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle`}>Lifelong Learners</span>
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
              {/* Tagline - Enhanced Size */}
              <div className={`mumkinMedh text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight ${
                isDark 
                  ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                  : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
              }`}>
                Medh Hai Toh Mumkin Hai!
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
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-medium`}>100+</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-subtle`}>Courses</div>
                </div>
              </div>

              {/* Age Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-purple-500/20 rounded-md w-fit">
                    <Users className={`w-3 h-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-medium`}>All</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-subtle`}>Ages</div>
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
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-medium`}>Live</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-subtle`}>Classes</div>
                </div>
              </div>

              {/* Global Point */}
              <div className="glass-stats rounded-lg p-2 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden min-h-[60px] flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-1 p-1 bg-blue-500/20 rounded-md w-fit">
                    <Star className={`w-3 h-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-medium`}>Global</div>
                  <div className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-subtle`}>Access</div>
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

// Enhanced Main Hero component with professional video background and theme support
const Hero1: React.FC<IHero1Props> = React.memo(({ isCompact = false }) => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [featuredCourses, setFeaturedCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { getQuery } = useGetQuery();
  const videoContext = useContext(VideoBackgroundContext);
  
  const isDark = mounted ? theme === 'dark' : true; // Default to dark during SSR

  // Mount and theme effects
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Inject theme-aware styles
  useEffect(() => {
    if (!mounted) return;
    
    // Debug log for theme changes
    console.log('Hero Desktop theme changed:', isDark ? 'dark' : 'light');
    
    const existingStyle = document.getElementById('hero-desktop-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'hero-desktop-theme-styles';
    styleSheet.innerText = getThemeStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('hero-desktop-theme-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);

  // Add scroll management on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.style.overflow = 'auto';
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
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

  // Conditionally render mobile or desktop version
  if (isMobile) {
    return (
        <HeroMobile 
          isLoaded={isLoaded} 
          featuredCourses={featuredCourses} 
          loading={loading} 
        />
    );
  }

  // Enhanced Desktop version with professional video background and theme support
  return (
        <section className="relative min-h-screen overflow-hidden animate-theme-transition">
             {/* Video Background */}
       <div className="absolute inset-0 overflow-hidden">
         <video
           key={`desktop-video-${isDark ? 'dark' : 'light'}`}
           autoPlay
           muted
           loop
           playsInline
           className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-2000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
           style={{ filter: isDark ? 'brightness(0.65) contrast(1.2) saturate(0.9) hue-rotate(10deg)' : 'brightness(0.95) contrast(1.0) saturate(1.0)' }}
         >
           <source src={isDark ? "https://d2cxn2x1vtrou8.cloudfront.net/Website/1659171_Trapcode_Particles_3840x2160.mp4" : "https://d2cxn2x1vtrou8.cloudfront.net/Website/0_Technology_Abstract_4096x2304.mp4"} type="video/mp4" />
         </video>
         
         {/* Enhanced overlay for professional look - theme aware */}
         <div className={`absolute inset-0 ${isDark ? 'video-overlay' : ''}`}></div>
       </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Main Content with Enhanced Glassmorphism */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center py-4 md:py-6 lg:py-8">
          
          {/* Hero Text Section with Glass Container */}
          <div className={`mb-2 md:mb-3 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="glass-container rounded-3xl p-8 md:p-12 mb-1 transform scale-90">
              <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 glass-stats rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 opacity-95 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                <Sparkles size={10} className="mr-1 sm:w-3 sm:h-3" />
                Expert-Led Learning Platform
              </div>
               
               <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>
                 Unlock Your Potential Journey With{' '}
                 <span className="relative font-extrabold" style={{ color: '#3bac63' }}>
                   Medh
                  </span>
                </h1>
                
               <p className={`text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'} font-medium text-shadow-medium`}>
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
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle text-center leading-tight`}>Children & Teens</span>
                     </div>
                   </div>

                   {/* Professionals */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-secondary-300' : 'text-secondary-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle text-center leading-tight`}>Professionals</span>
                     </div>
                   </div>

                   {/* Homemakers */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-purple-300' : 'text-purple-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle text-center leading-tight`}>Homemakers</span>
                     </div>
                   </div>

                   {/* Lifelong Learners */}
                   <div className="glass-stats rounded-xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                     <div className="relative z-10 flex flex-col items-center space-y-2">
                       <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-blue-300' : 'text-blue-600'} group-hover:scale-110 transition-transform`} />
                       <span className={`text-sm md:text-base lg:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-subtle text-center leading-tight`}>Lifelong Learners</span>
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
               {/* Tagline - Enhanced Size */}
               <div className={`mumkinMedh text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-2 leading-tight pt-5 ${
                 isDark 
                   ? 'text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text' 
                   : 'text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text'
               }`}>
                 Medh Hai Toh Mumkin Hai!
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
                    <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-light`}>100+</div>
                    <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-primary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'} text-shadow-medium`}>Expert Courses</div>
                    <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium text-shadow-subtle`}>All Skill Levels</div>
                  </div>
                </div>
              
               {/* Age Groups Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                 <div className="relative z-10">
                   <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-light`}>Every</div>
                   <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-purple-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'} text-shadow-medium`}>Age Group</div>
                   <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium text-shadow-subtle`}>8 to 80+ Years</div>
                 </div>
               </div>
              
               {/* Live Learning Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                 <div className="relative z-10">
                   <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-light`}>Live</div>
                   <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-secondary-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'} text-shadow-medium`}>Interactive</div>
                   <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium text-shadow-subtle`}>Real-time Classes</div>
                 </div>
               </div>
              
               {/* Global Card */}
               <div className="glass-stats rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 text-center hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                 <div className="relative z-10">
                   <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-gray-900'} text-shadow-light`}>Global</div>
                   <div className={`font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-300 transition-colors ${isDark ? 'text-white' : 'text-gray-800'} text-shadow-medium`}>Learning</div>
                   <div className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-white' : 'text-gray-700'} font-medium text-shadow-subtle`}>Worldwide Access</div>
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