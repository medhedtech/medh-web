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
  Award
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
  getAnimations
} from "@/utils/designSystem";

interface IBenefit {
  id: number;
  icon: React.ReactElement;
  logo: any;
  title: string;
  description: string;
  color: string;
  highlights: string[];
}

interface IPerk {
  icon: React.ReactElement;
  text: string;
}

interface IBenefitCardProps extends IBenefit {
  index: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 1
    }
  }
};

// Enhanced benefits data with more details and icons
const advantagesData: IBenefit[] = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8" />,
    logo: Logo1,
    title: "Competitive Compensation",
    description:
      "We offer competitive remuneration packages and benefits to attract and retain top talent. This includes performance bonuses and equity options.",
    color: "from-blue-500/20 to-blue-500/5",
    highlights: ["Competitive salary", "Performance bonuses", "Equity options"]
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    logo: Logo2,
    title: "Professional Development",
    description:
      "Access to professional development programs, training sessions, and career growth opportunities. We invest in your growth and success.",
    color: "from-purple-500/20 to-purple-500/5",
    highlights: ["Training programs", "Mentorship", "Conference allowance"]
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    logo: Logo3,
    title: "Collaborative Work Culture",
    description:
      "A supportive and inclusive work environment where teamwork and collaboration are encouraged. Join a diverse team of passionate professionals.",
    color: "from-green-500/20 to-green-500/5",
    highlights: ["Inclusive environment", "Team events", "Knowledge sharing"]
  },
];

const advantagesPotentialData: IBenefit[] = [
  {
    id: 4,
    icon: <Rocket className="w-8 h-8" />,
    logo: Logo4,
    title: "Flexible Work Arrangements",
    description:
      "Options for remote work, work-from-home, flexible hours, and a healthy work-life balance. We trust you to work in ways that suit you best.",
    color: "from-orange-500/20 to-orange-500/5",
    highlights: ["Remote work options", "Flexible hours", "Work-life balance"]
  },
  {
    id: 5,
    icon: <Heart className="w-8 h-8" />,
    logo: Logo5,
    title: "Health and Wellness",
    description:
      "Comprehensive health and wellness programs to support your physical and mental well-being. Your health is our priority.",
    color: "from-red-500/20 to-red-500/5",
    highlights: ["Health insurance", "Mental wellness support", "Fitness allowance"]
  },
];

// Additional perks with icons
const additionalPerks: IPerk[] = [
  { icon: <Coffee />, text: "Free snacks & beverages" },
  { icon: <Star />, text: "Recognition programs" },
  { icon: <Globe />, text: "Travel opportunities" },
  { icon: <Sun />, text: "Paid time off" },
  { icon: <Gift />, text: "Birthday celebrations" },
];

const BenefitCard: React.FC<IBenefitCardProps> = memo(({ icon, logo, title, description, color, highlights, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${corporatePatterns.featureCard('premium')} bg-gradient-to-br ${color}`}>
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={buildComponent.card('minimal', 'mobile')}
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-blue-600 dark:text-blue-400">
                {icon}
              </div>
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${typography.h3} mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${getAnimations.transition()}`}>
              {title}
            </h3>
            <p className={`${typography.body} leading-relaxed mb-4`}>
              {description}
            </p>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`${corporatePatterns.valueHighlight('blue')} text-xs sm:text-sm`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shadow-sm" />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div 
          className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 opacity-10 transition-all duration-500"
          animate={{
            opacity: isHovered ? 0.2 : 0.1,
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 15 : 12
          }}
        >
          <Image
            src={logo}
            alt={title}
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
            width={96}
            height={96}
          />
        </motion.div>
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
      <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse max-w-7xl mx-auto">
            {/* WelcomeCareers skeleton */}
            <div className="mb-20">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-6"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Benefits grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional benefits skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                      </div>
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
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <WelcomeCareers />
          
          {/* Enhanced Header */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-8 text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              Join Our Team
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 md:mb-6">
              Unique Benefits and <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Perks</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Join our team and enjoy a comprehensive package of benefits designed to support your growth and well-being.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-12"
          >
            {/* Primary Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {advantagesData.map((advantage, index) => (
                <BenefitCard key={advantage.id} {...advantage} index={index} />
              ))}
            </div>

            {/* Additional Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {advantagesPotentialData.map((advantage, index) => (
                <BenefitCard key={advantage.id} {...advantage} index={index + advantagesData.length} />
              ))}
            </div>

            {/* Additional Perks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">
                Additional Perks
              </h3>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                {additionalPerks.map((perk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 bg-white dark:bg-slate-700 px-3 sm:px-4 py-2 rounded-full
                      border border-slate-100 dark:border-slate-600
                      shadow-sm hover:shadow-md transition-all duration-300
                      min-h-[44px] touch-manipulation"
                  >
                    <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                      {perk.icon}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">{perk.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to top button - Mobile Optimized */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full shadow-lg transition-all z-50 hover:shadow-xl min-h-[44px] min-w-[44px] touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(UniqueBenefits);
