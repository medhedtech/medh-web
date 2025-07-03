"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Rocket, 
  Users, 
  Brain, 
  Heart, 
  Star, 
  Coffee, 
  Globe, 
  Sun, 
  Gift,
  ArrowUp,
  Award,
  TrendingUp,
  Zap,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Logo1 from "@/assets/images/career/logo-3.svg";
import Logo2 from "@/assets/images/career/logo-4.svg";
import Logo3 from "@/assets/images/career/logo-5.svg";
import Logo4 from "@/assets/images/career/logo-6.svg";
import Logo5 from "@/assets/images/career/logo-7.svg";
import WelcomeCareers from "./welcomeCareers";
import { 
  buildComponent, 
  buildAdvancedComponent, 
  corporatePatterns, 
  getResponsive,
  layoutPatterns,
  typography,
  mobilePatterns,
  getAnimations,
  getGlassmorphism,
  getEnhancedSemanticColor
} from "@/utils/designSystem";

interface IBenefit {
  id: number;
  icon: React.ReactElement;
  logo: any;
  title: string;
  description: string;
  color: string;
  highlights: string[];
  stats?: string;
  category: 'core' | 'growth' | 'wellness';
}

interface IPerk {
  icon: React.ReactElement;
  text: string;
  color: string;
}

interface IBenefitCardProps extends IBenefit {
  index: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.8
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9,
    rotateY: -15
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      duration: 0.6
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as const
    }
  }
};

// Enhanced benefits data with categories and stats
const advantagesData: IBenefit[] = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8" />,
    logo: Logo1,
    title: "Competitive Compensation",
    description: "Industry-leading salary packages with performance bonuses, equity options, and comprehensive benefits designed to reward excellence.",
    color: "bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent",
    highlights: ["Market-leading salaries", "Annual performance bonuses", "Stock options & equity", "Merit-based increases"],
    stats: "₹8-25 LPA",
    category: 'core'
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    logo: Logo2,
    title: "Professional Development",
    description: "Comprehensive learning programs, skill development workshops, and career advancement opportunities to accelerate your professional journey.",
    color: "bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent",
    highlights: ["₹50K annual learning budget", "Industry certifications", "Conference attendance", "Mentorship programs"],
    stats: "100+ Courses",
    category: 'growth'
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    logo: Logo3,
    title: "Collaborative Excellence",
    description: "Join a diverse, inclusive team where innovation thrives, ideas are valued, and collaborative success is celebrated.",
    color: "bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent",
    highlights: ["Cross-functional teams", "Innovation challenges", "Team building retreats", "Open communication"],
    stats: "95% Team Satisfaction",
    category: 'core'
  },
];

const advantagesPotentialData: IBenefit[] = [
  {
    id: 4,
    icon: <Rocket className="w-8 h-8" />,
    logo: Logo4,
    title: "Flexible Work Culture",
    description: "Modern work arrangements including remote options, flexible schedules, and a results-driven environment that prioritizes work-life harmony.",
    color: "bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent",
    highlights: ["Hybrid work model", "Flexible timings", "Remote work allowance", "Result-oriented approach"],
    stats: "3 Days WFH/Week",
    category: 'wellness'
  },
  {
    id: 5,
    icon: <Heart className="w-8 h-8" />,
    logo: Logo5,
    title: "Health & Wellness",
    description: "Comprehensive healthcare coverage, mental wellness support, and fitness programs to ensure your holistic well-being.",
    color: "bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-transparent",
    highlights: ["Premium health insurance", "Mental health support", "Fitness membership", "Annual health checkups"],
    stats: "100% Coverage",
    category: 'wellness'
  },
];

// Enhanced perks with colors
const additionalPerks: IPerk[] = [
  { icon: <Coffee />, text: "Premium Cafeteria", color: "from-amber-500 to-orange-500" },
  { icon: <Star />, text: "Recognition Awards", color: "from-yellow-500 to-amber-500" },
  { icon: <Globe />, text: "Travel Opportunities", color: "from-blue-500 to-cyan-500" },
  { icon: <Sun />, text: "Unlimited PTO", color: "from-green-500 to-emerald-500" },
  { icon: <Gift />, text: "Special Celebrations", color: "from-pink-500 to-rose-500" },
  { icon: <Zap />, text: "Innovation Time", color: "from-purple-500 to-violet-500" },
];

const categoryColors = {
  core: { gradient: "from-blue-600 to-cyan-600", glow: "shadow-blue-500/25" },
  growth: { gradient: "from-purple-600 to-pink-600", glow: "shadow-purple-500/25" },
  wellness: { gradient: "from-emerald-600 to-teal-600", glow: "shadow-emerald-500/25" }
};

// Add this function after the interfaces
const getSemanticColor = (category: IBenefit['category']): { bg: string; text: string; border: string } => {
  const colorMap = {
    core: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    growth: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
    wellness: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' }
  };
  return colorMap[category] || { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' };
};

// Updated benefit card with professional styling
const BenefitCard: React.FC<IBenefitCardProps> = memo(({ icon, logo, title, description, color, highlights, stats, category, index }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const colors = getSemanticColor(category);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
            {icon}
          </div>
          
          {stats && (
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
              {stats}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white leading-tight">
              {title}
            </h3>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
            {description}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>{isExpanded ? 'Show Less' : 'Show Features'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 space-y-2"
              >
                {highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <CheckCircle className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{highlight}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";

const UniqueBenefits: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, []);

  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 min-h-screen overflow-hidden w-full">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10" />
        </div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse max-w-7xl mx-auto space-y-8">
            {/* Enhanced loading skeleton */}
            <div className="text-center space-y-4">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full w-48 mx-auto" />
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl w-96 mx-auto" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full w-80 mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg w-3/4" />
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded" />
                      <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-4 sm:p-6 md:p-10 my-8">
            <WelcomeCareers />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                  Competitive Benefits Package
                </h2>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                  We invest in our team's growth, well-being, and success with comprehensive benefits designed for professionals.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {/* Core Benefits */}
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-semibold text-slate-800 dark:text-white mb-8"
                >
                  Core Benefits
                </motion.h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {advantagesData.map((advantage, index) => (
                    <BenefitCard key={advantage.id} {...advantage} index={index} />
                  ))}
                </div>
              </div>

              {/* Growth & Wellness */}
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-semibold text-slate-800 dark:text-white mb-8"
                >
                  Growth & Wellness
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {advantagesPotentialData.map((advantage, index) => (
                    <BenefitCard key={advantage.id} {...advantage} index={index + advantagesData.length} />
                  ))}
                </div>
              </div>

              {/* Enhanced Perks Showcase */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8"
              >
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
                    Additional Perks & Privileges
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Enjoy exclusive benefits that enhance your work experience
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                  {additionalPerks.map((perk, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center p-4 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
                        {perk.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                        {perk.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(UniqueBenefits);
