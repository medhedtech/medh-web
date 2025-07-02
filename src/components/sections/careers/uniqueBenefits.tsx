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

const BenefitCard: React.FC<IBenefitCardProps> = memo(({ icon, logo, title, description, color, highlights, stats, category, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const categoryStyle = categoryColors[category];

  return (
    <motion.div
      variants={cardVariants}
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        ${buildAdvancedComponent.glassCard({ variant: 'primary', hover: true })}
        ${color}
        relative overflow-hidden
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-[1.02] -translate-y-2' : ''}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:via-transparent before:to-white/5 
        before:translate-x-[-100%] before:transition-transform before:duration-1000
        ${isHovered ? 'before:translate-x-[100%]' : ''}
      `}>
        
        {/* Floating Background Elements */}
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute -top-6 -right-6 w-32 h-32 opacity-5"
        >
          <div className={`w-full h-full rounded-full bg-gradient-to-r ${categoryStyle.gradient}`} />
        </motion.div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
            bg-gradient-to-r ${categoryStyle.gradient} text-white
            shadow-lg ${categoryStyle.glow}
          `}>
            <Sparkles className="w-3 h-3" />
            {category.toUpperCase()}
          </div>
        </div>

        {/* Stats Badge */}
        {stats && (
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
              <TrendingUp className="w-3 h-3" />
              {stats}
            </div>
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            {/* Enhanced Icon */}
            <motion.div 
              className={`
                flex-shrink-0 p-3 rounded-2xl 
                bg-gradient-to-r ${categoryStyle.gradient}
                text-white shadow-lg ${categoryStyle.glow}
                transform transition-all duration-300
              `}
              animate={{ 
                rotate: isHovered ? [0, -10, 10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className={`
                text-xl sm:text-2xl font-bold mb-3
                bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 
                bg-clip-text text-transparent
                group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300
              `}>
                {title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
                {description}
              </p>

              {/* Expandable Features */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>{isExpanded ? 'Show Less' : 'Show Features'}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-3"
                  >
                    {highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{highlight}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Logo */}
          <motion.div 
            className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-all duration-500"
            animate={{
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? 15 : 5,
            }}
          >
            <Image
              src={logo}
              alt={title}
              className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl"
              width={128}
              height={128}
            />
          </motion.div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-r ${categoryStyle.gradient} blur-xl -z-10 transform scale-105
        `} />
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
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 dark:opacity-10" />
      </div>
      
      {/* Animated Floating Elements */}
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-4 h-4 bg-blue-500/20 rounded-full blur-sm"
      />
      <motion.div 
        animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-40 w-6 h-6 bg-purple-500/20 rounded-full blur-sm"
      />
      <motion.div 
        animate={{ y: [-30, 30, -30], x: [-10, 10, -10] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 left-32 w-3 h-3 bg-emerald-500/20 rounded-full blur-sm"
      />

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <WelcomeCareers />
          
          {/* Enhanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className={`${buildAdvancedComponent.glassCard({ variant: 'hero' })} p-8 sm:p-12`}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full mb-6 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
              >
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold">Join Our Elite Team</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Exceptional Benefits &
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Extraordinary Perks
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Experience a workplace where your growth, well-being, and success are our top priorities. 
                Discover comprehensive benefits designed to elevate your career and enrich your life.
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
                className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center"
              >
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Core Benefits</span>
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
                className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center"
              >
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Growth & Wellness</span>
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
              transition={{ delay: 0.8 }}
                             className={`${buildAdvancedComponent.glassCard({ variant: 'primary' })} p-8 sm:p-12 text-center`}
            >
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Additional Perks & Privileges
                  </span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Enjoy exclusive perks that make every day at work special
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {additionalPerks.map((perk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      type: "spring", 
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 10,
                      transition: { duration: 0.2 }
                    }}
                    className="group cursor-pointer"
                  >
                    <div className={`
                      p-4 sm:p-6 rounded-2xl 
                      bg-gradient-to-br ${perk.color} 
                      text-white shadow-lg
                      transform transition-all duration-300
                      hover:shadow-2xl hover:-translate-y-1
                      min-h-[120px] flex flex-col items-center justify-center
                    `}>
                      <motion.div 
                        className="mb-3"
                        animate={{ 
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.2 
                        }}
                      >
                        {perk.icon}
                      </motion.div>
                      <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                        {perk.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all z-50 min-h-[56px] min-w-[56px] touch-manipulation backdrop-blur-sm border border-white/20"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(UniqueBenefits);
