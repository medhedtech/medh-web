"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowDown, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Users, 
  ArrowUp,
  Sparkles,
  Rocket,
  Shield,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { buildAdvancedComponent, mobilePatterns } from "@/utils/designSystem";
import Bell from "@/assets/images/about/bell.png";

interface IFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const features: IFeature[] = [
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Innovative Learning",
    description: "Modern technology and teaching methods that transform education",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30"
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Personalized Growth",
    description: "Tailored learning paths for every stage of life and career",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Expert Mentorship",
    description: "Guidance from industry professionals with real-world experience",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30"
  }
];

const AboutContent: React.FC = () => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-blue-50/50 dark:from-amber-950/20 dark:via-transparent dark:to-blue-950/20"></div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Features skeleton */}
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-6">
                  <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
              ))}
            </div>
            
            {/* UPD skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-8">
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${mobilePatterns.mobileSection()} overflow-hidden`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-blue-50/50 dark:from-amber-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements - Mobile optimized */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className={`relative z-10 ${mobilePatterns.mobileContainer('lg')}`}>
        {/* Hero Section - Mobile optimized */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/30 dark:to-blue-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold rounded-full mb-4 md:mb-6 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              About Medh
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-slate-900 dark:text-slate-100">
                Pioneering Skill Development
              </span>
              <br />
              <span className="text-amber-600 dark:text-amber-400">
                for every stage of life
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6"
            >
              Leading EdTech platform delivering skill development through modern technology and expert mentorship. 
              Empowering growth from childhood to professional success.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium"
            >
              <Rocket className="w-4 h-4" />
              Nurturing growth, fostering expertise
            </motion.div>
          </div>
        </motion.div>

        {/* UPD Section - Mobile optimized */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-amber-50 via-blue-50/50 to-emerald-50 dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/50 dark:border-slate-600/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
              {/* Bell Icon Container - Mobile optimized */}
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-blue-500/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-2 sm:p-3 md:p-4 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
                  <Image
                    src={Bell}
                    alt="bell icon"
                    width={60}
                    height={60}
                    className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                  />
                </div>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Our Unique Approach
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Seamless skill development courses with tailored learning pathways 
                  for every developmental stage - from early childhood to professional 
                  readiness. Our holistic approach ensures complete preparation for 
                  success at every life stage.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button - Mobile Optimized */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all z-50 hover:shadow-xl min-h-[44px] min-w-[44px] touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(AboutContent);
