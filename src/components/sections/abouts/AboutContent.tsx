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
  Shield
} from "lucide-react";
import Bell from "@/assets/images/about/bell.png";
import { 
  buildComponent, 
  buildAdvancedComponent, 
  layoutPatterns, 
  typography, 
  getResponsive,
  backgroundPatterns 
} from "@/utils/designSystem";

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
    icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Innovative Learning",
    description: "Cutting-edge technology and modern teaching methodologies that transform education",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30"
  },
  {
    icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Personalized Growth",
    description: "Tailored learning paths for every stage of life, from childhood to professional success",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Expert Mentorship",
    description: "Guidance from industry-leading professionals with real-world experience",
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
    <section className={`relative ${buildComponent.section()} overflow-hidden w-full`}>
      {/* Enhanced Background Pattern */}
      <div className={`absolute inset-0 ${backgroundPatterns.gridPattern}`}></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-blue-50/50 dark:from-amber-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements */}
      <div className={backgroundPatterns.floatingBlobs.blob1.replace('blue', 'amber')}></div>
      <div className={backgroundPatterns.floatingBlobs.blob2.replace('violet', 'blue')}></div>
      <div className={backgroundPatterns.floatingBlobs.blob3.replace('amber', 'emerald')}></div>

      <div className={`relative z-10 ${buildComponent.container()}`}>
        {/* Hero Section - Enhanced Header Card */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className={buildAdvancedComponent.headerCard()}
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/30 dark:to-blue-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold rounded-full mb-4 md:mb-6 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              About Medh
            </span>

            <h1 className={`${getResponsive.fluidText('heading')} font-bold mb-4 md:mb-6 leading-tight`}>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-white bg-clip-text text-transparent">
                Pioneering Skill Development
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-600 to-blue-600 dark:from-amber-400 dark:to-blue-400 bg-clip-text text-transparent">
                for every stage of life
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`${getResponsive.fluidText('body')} text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-4 md:mb-6`}
            >
              MEDH, the leading global EdTech innovator, is dedicated to delivering
              skill development courses through cutting-edge technology and bespoke
              mentorship. We empower individuals at every stage of life, from early
              childhood and adolescence to working professionals and homemakers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center gap-2 ${getResponsive.fluidText('body')} text-amber-600 dark:text-amber-400 font-semibold`}
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
              We nurture growth, foster expertise, and ignite potential
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid - Enhanced with Glassmorphism */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`${getResponsive.grid({ mobile: 1, tablet: 2, desktop: 3 })} mb-8`}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: true, padding: 'mobile' })}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center ${feature.color} mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`${typography.h3} mb-2`}>
                {feature.title}
              </h3>
              <p className={`${typography.body} leading-relaxed`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* UPD Section - Enhanced with Premium Glass Effect */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-br from-amber-50 via-blue-50/50 to-emerald-50 dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-200/50 dark:border-slate-600/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Enhanced Bell Icon Container */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-4 md:p-5 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
                  <Image
                    src={Bell}
                    alt="bell icon"
                    width={60}
                    height={60}
                    className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                  />
                </div>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-white bg-clip-text text-transparent">
                    Medh - Unique Point of Difference (UPD)
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our commitment to providing a seamless gamut of skill development
                  courses, creating tailored learning pathways that accommodate every
                  phase of a child's developmental journey, from early childhood
                  to professional readiness. This holistic approach ensures that
                  individuals are fully equipped for success at every stage of life.
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
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all z-50 hover:shadow-xl"
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
