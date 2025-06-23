"use client";
import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import medhLogo from "@/assets/images/logo/medh.png";

// Lightweight icon components - only essential ones
import { 
  ArrowRight, GraduationCap, Users, Star, Clock, BookOpen, TrendingUp,
  Database, Calculator, Rocket, Briefcase, Target, MessageCircle, BarChart3, 
  DollarSign, Code, PenTool, Zap, Shield, Award, Laptop, Heart, Settings, 
  Globe, Scale, Smile, ShoppingCart, Leaf, CheckCircle, Camera, Music, 
  Activity, Lightbulb
} from "lucide-react";

// Optimized CSS-in-JS for critical styles only
const CRITICAL_STYLES = `
  .hero3-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    transform: translateZ(0);
    will-change: transform;
  }
  
  .glass-card-dark {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .scroll-animate {
    animation: scroll-infinite 60s linear infinite;
    will-change: transform;
  }
  
  .hover-scale {
    transition: transform 0.2s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  @keyframes scroll-infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }
  
  @media (max-width: 768px) {
    .mobile-text-large {
      font-size: 2.2rem !important;
    }
  }
`;

// Complete course categories - all available courses
const COURSES = [
  // Live courses (4 items)
  { name: "AI & Data Science", icon: Database, type: "live", url: "/courses?category=AI%20and%20Data%20Science&classType=live" },
  { name: "Digital Marketing", icon: TrendingUp, type: "live", url: "/courses?category=Digital%20Marketing%20with%20Data%20Analytics&classType=live" },
  { name: "Personality Development", icon: Users, type: "live", url: "/courses?category=Personality%20Development&classType=live" },
  { name: "Vedic Mathematics", icon: Calculator, type: "live", url: "/courses?category=Vedic%20Mathematics&classType=live" },
  
  // Blended courses (23 items)
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
] as const;

// Triple the courses for infinite scroll
const SCROLL_COURSES = [...COURSES, ...COURSES, ...COURSES];

// Lightweight mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());
    
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};

// Define course type
type CourseType = {
  name: string;
  icon: React.ForwardRefExoticComponent<any>;
  type: "live" | "blended";
  url: string;
};

// Ultra-lightweight category card
const CategoryCard = memo<{
  course: CourseType;
  isDark: boolean;
  onClick: () => void;
}>(({ course, isDark, onClick }) => {
  const Icon = course.icon;
  const isLive = course.type === 'live';
  
  return (
    <div 
      onClick={onClick}
      className={`
        ${isDark ? 'glass-card-dark' : 'glass-card'} 
        hover-scale cursor-pointer p-4 w-48 h-32 flex flex-col items-center justify-center
        relative overflow-hidden flex-shrink-0
      `}
    >
      <div className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
        ${isLive 
          ? (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
          : (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')
        }
      `}>
        {isLive ? 'Live' : 'Blended'}
      </div>
      
      <Icon className={`
        w-7 h-7 mb-2
        ${isLive 
          ? (isDark ? 'text-green-300' : 'text-green-600')
          : (isDark ? 'text-blue-300' : 'text-blue-600')
        }
      `} />
      
      <h3 className={`
        font-semibold text-sm text-center px-2 line-clamp-2
        ${isDark ? 'text-white' : 'text-gray-900'}
      `}>
        {course.name}
      </h3>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

// Lightweight infinite scroller
const InfiniteScroller = memo<{ isDark: boolean }>(({ isDark }) => {
  const router = useRouter();
  
  const handleClick = useCallback((course: CourseType) => {
    router.push(course.url);
  }, [router]);

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="scroll-animate flex gap-4 pl-4" style={{ width: '300%' }}>
        {SCROLL_COURSES.map((course, index) => (
          <CategoryCard
            key={`${course.name}-${index}`}
            course={course}
            isDark={isDark}
            onClick={() => handleClick(course)}
          />
        ))}
      </div>
    </div>
  );
});

InfiniteScroller.displayName = 'InfiniteScroller';

// Lightweight stat card
const StatCard = memo<{
  value: string;
  label: string;
  sublabel: string;
  isDark: boolean;
}>(({ value, label, sublabel, isDark }) => (
  <div className={`${isDark ? 'glass-card-dark' : 'glass-card'} hover-scale p-4 text-center`}>
    <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </div>
    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {label}
    </div>
    <div className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      {sublabel}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// Lightweight category chip
const CategoryChip = memo<{
  icon: React.ElementType;
  label: string;
  color: string;
  isDark: boolean;
}>(({ icon: Icon, label, color, isDark }) => (
  <div className={`${isDark ? 'glass-card-dark' : 'glass-card'} hover-scale p-3 text-center`}>
    <div className="flex flex-col items-center space-y-2">
      <Icon className={`w-6 h-6 ${color}`} />
      <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </span>
    </div>
  </div>
));

CategoryChip.displayName = 'CategoryChip';

// Mobile hero component
const MobileHero = memo<{ isDark: boolean }>(({ isDark }) => (
  <div className="hero3-container px-4 py-8">
    <style jsx>{CRITICAL_STYLES}</style>
    
    <div className="w-full max-w-md mx-auto">
      <div className={`${isDark ? 'glass-card-dark' : 'glass-card'} p-6 text-center`}>
        {/* Badges */}
        <div className="flex justify-center gap-2 mb-4">
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
          `}>
            <Shield size={10} className="mr-1" />
            ISO Certified
          </div>
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
          `}>
            <Award size={10} className="mr-1" />
            STEM Certified
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className={`text-2xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Unlock Your Potential Journey{' '}
          <em className="font-normal">with</em>
          <span className="inline-flex items-baseline ml-1">
            <Image 
              src={medhLogo} 
              alt="Medh Logo" 
              width={64} 
              height={64} 
              priority 
              className="inline-block h-6 w-auto align-baseline"
              style={{ transform: 'translateY(2px)' }}
            />
          </span>
        </h1>
        
        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Join our expert-led courses and master the skills that drive industry innovation globally.
        </p>
        
        {/* Category chips */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <CategoryChip 
            icon={BookOpen} 
            label="Children & Teens" 
            color={isDark ? 'text-green-300' : 'text-green-600'} 
            isDark={isDark} 
          />
          <CategoryChip 
            icon={Users} 
            label="Professionals" 
            color={isDark ? 'text-blue-300' : 'text-blue-600'} 
            isDark={isDark} 
          />
          <CategoryChip 
            icon={Star} 
            label="Homemakers" 
            color={isDark ? 'text-purple-300' : 'text-purple-600'} 
            isDark={isDark} 
          />
          <CategoryChip 
            icon={TrendingUp} 
            label="Lifelong Learners" 
            color={isDark ? 'text-orange-300' : 'text-orange-600'} 
            isDark={isDark} 
          />
        </div>
        
        {/* CTA Button */}
        <Link href="/courses" className={`
          inline-flex items-center justify-center py-3 px-6 font-bold rounded-xl 
          hover-scale transition-colors text-sm relative overflow-hidden
          ${isDark 
            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
            : 'bg-white text-gray-900 border-2 border-green-500/50 hover:border-green-500'
          }
        `}>
          <span>Explore Courses</span>
          <ArrowRight size={16} className="ml-2" />
        </Link>
        
        {/* Tagline */}
        <div className="mt-6">
          <div className={`
            mobile-text-large font-extrabold leading-tight
            ${isDark 
              ? 'text-transparent bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text' 
              : 'text-transparent bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text'
            }
          `} style={{ whiteSpace: 'nowrap' }}>
            Medh Hai Toh Mumkin Hai !
          </div>
        </div>
      </div>
      
      {/* Mobile stats */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <StatCard value="100+" label="Courses" sublabel="All Levels" isDark={isDark} />
        <StatCard value="All" label="Ages" sublabel="8-80+ Years" isDark={isDark} />
        <StatCard value="Live" label="Classes" sublabel="Interactive" isDark={isDark} />
        <StatCard value="Global" label="Access" sublabel="Worldwide" isDark={isDark} />
      </div>
      
      {/* Infinite scroller */}
      <div className="mt-6">
        <InfiniteScroller isDark={isDark} />
      </div>
    </div>
  </div>
));

MobileHero.displayName = 'MobileHero';

// Desktop hero component
const DesktopHero = memo<{ isDark: boolean }>(({ isDark }) => (
  <div className="hero3-container">
    <style jsx>{CRITICAL_STYLES}</style>
    
    <div className="max-w-7xl mx-auto px-8">
      <div className="text-center">
        {/* Main hero card */}
        <div className={`${isDark ? 'glass-card-dark' : 'glass-card'} p-12 mb-8 max-w-5xl mx-auto`}>
          {/* Badges */}
          <div className="flex justify-center gap-4 mb-6">
            <div className={`
              inline-flex items-center px-3 py-2 rounded-full text-sm font-medium
              ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
            `}>
              <Shield size={14} className="mr-2" />
              ISO Certified
            </div>
            <div className={`
              inline-flex items-center px-3 py-2 rounded-full text-sm font-medium
              ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
            `}>
              <Award size={14} className="mr-2" />
              STEM Certified
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className={`text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Unlock Your Potential Journey{' '}
            <em className="font-semibold">with</em>
            <span className="inline-flex items-baseline ml-2">
              <Image 
                src={medhLogo} 
                alt="Medh Logo" 
                width={96} 
                height={96} 
                priority 
                className="inline-block h-12 w-auto align-baseline"
                style={{ transform: 'translateY(4px)' }}
              />
            </span>
          </h1>
          
          {/* Description */}
          <p className={`text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Join our expert-led courses and master the skills that drive industry innovation globally.
          </p>
          
          {/* Category chips */}
          <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <CategoryChip 
              icon={BookOpen} 
              label="Children & Teens" 
              color={isDark ? 'text-green-300' : 'text-green-600'} 
              isDark={isDark} 
            />
            <CategoryChip 
              icon={Users} 
              label="Professionals" 
              color={isDark ? 'text-blue-300' : 'text-blue-600'} 
              isDark={isDark} 
            />
            <CategoryChip 
              icon={Star} 
              label="Homemakers" 
              color={isDark ? 'text-purple-300' : 'text-purple-600'} 
              isDark={isDark} 
            />
            <CategoryChip 
              icon={TrendingUp} 
              label="Lifelong Learners" 
              color={isDark ? 'text-orange-300' : 'text-orange-600'} 
              isDark={isDark} 
            />
          </div>
          
          {/* CTA Button */}
          <Link href="/courses" className={`
            inline-flex items-center justify-center py-4 px-8 font-bold rounded-xl 
            hover-scale transition-colors text-lg relative overflow-hidden
            ${isDark 
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-2xl' 
              : 'bg-white text-gray-900 border-2 border-green-500/50 hover:border-green-500 shadow-2xl'
            }
          `}>
            <span>Explore Courses</span>
            <ArrowRight size={20} className="ml-3" />
          </Link>
          
          {/* Tagline */}
          <div className="mt-8">
            <div className={`
              text-5xl font-extrabold leading-tight
              ${isDark 
                ? 'text-transparent bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text' 
                : 'text-transparent bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text'
              }
            `} style={{ whiteSpace: 'nowrap' }}>
              Medh Hai Toh Mumkin Hai !
            </div>
          </div>
        </div>
        
        {/* Infinite scroller */}
        <div className="mb-8">
          <InfiniteScroller isDark={isDark} />
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-6 max-w-5xl mx-auto">
          <StatCard value="100+" label="Expert Courses" sublabel="All Skill Levels" isDark={isDark} />
          <StatCard value="Every" label="Age Group" sublabel="8 to 80+ Years" isDark={isDark} />
          <StatCard value="Live" label="Interactive" sublabel="Real-time Classes" isDark={isDark} />
          <StatCard value="Global" label="Learning" sublabel="Worldwide Access" isDark={isDark} />
        </div>
      </div>
    </div>
  </div>
));

DesktopHero.displayName = 'DesktopHero';

// Main Hero3 component
const Hero3: React.FC<{ isCompact?: boolean }> = memo(({ isCompact = false }) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = useMemo(() => {
    if (!mounted) return true;
    return theme === 'dark';
  }, [mounted, theme]);

  if (!mounted) {
    return (
      <div className="hero3-container bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {isMobile ? <MobileHero isDark={isDark} /> : <DesktopHero isDark={isDark} />}
    </section>
  );
});

Hero3.displayName = 'Hero3';

export default Hero3; 