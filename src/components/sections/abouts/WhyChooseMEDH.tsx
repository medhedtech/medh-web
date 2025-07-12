"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowUp,
  Award,
  Star,
  Target,
  BookOpen,
  Monitor,
  Shield,
  User,
  RefreshCw,
  Briefcase,
  Zap,
  GraduationCap
} from "lucide-react";
import { mobilePatterns } from "@/utils/designSystem";
import Certified from "../why-medh/Certified";
import MEDH_LOGO from "@/assets/images/logo/medh_logo-Dark+png - Edited 2.png";

interface IFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const features: IFeature[] = [
  {
    title: "Personalized Learning",
    description: "Individual needs → Adaptive progress tracking",
    icon: User,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    title: "Industry-Relevant",
    description: "Expert collaboration → Practical value delivery",
    icon: Briefcase,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-600"
  },
  {
    title: "Skills-Focused",
    description: "Job-relevant skills → Professional competitiveness",
    icon: Zap,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600"
  },
];

const WhyChooseMEDH: React.FC = () => {
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
      <section className={`relative w-full overflow-hidden`}>
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        <div className="relative z-10 w-full">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32 mx-auto mb-4"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Features grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
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
    <section className={`relative w-full overflow-hidden`}>


      <div className="relative z-10 w-full">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 md:p-10 my-8">
          {/* Header Section - Enhanced */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg md:rounded-xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 mb-8 sm:mb-12 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-2 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-2 md:mb-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              Why Choose {" "}
              <div className="flex items-center gap-1 sm:gap-2">
                <Image
                  src={MEDH_LOGO}
                  alt="MEDH Logo"
                  width={200}
                  height={200}
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                  className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto object-contain"
                  quality={100}
                  priority
                  unoptimized
                />
              </div>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Global EdTech platform → Empowering learners → Shaping aspirations
            </p>
          </motion.div>

          {/* Features Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="relative"
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-5 md:p-7 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center relative overflow-hidden`}
                      >
                        <feature.icon 
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color} relative z-10`}
                        />
                      </div>
                      <h3 className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} bg-clip-text text-transparent`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certification Section */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Certified />
          </motion.div>


        </div>
      </div>
    </section>
  );
};

export default memo(WhyChooseMEDH);
