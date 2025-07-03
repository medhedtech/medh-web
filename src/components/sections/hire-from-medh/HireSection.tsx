"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, ChevronRight, ArrowUp, Users, Target, Shield, Zap, Network, Briefcase, TrendingUp, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildAdvancedComponent, corporatePatterns, getResponsive, mobilePatterns } from "@/utils/designSystem";

interface IBenefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface IHireSectionProps {
  className?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const benefits: IBenefit[] = [
  {
    title: "Industry-Trained Talent",
    description:
      "Real project experience from structured learning. Practical skills, not just theoretical knowledge.",
    icon: Target,
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Multiple Domains",
    description:
      "Technical and non-technical skill sets across various experience levels to match your exact needs.",
    icon: Users,
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
  },
  {
    title: "Guided Hiring Process",
    description:
      "Dedicated relationship managers who understand your requirements and support you through candidate selection.",
    icon: Shield,
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/20"
  },
  {
    title: "Vetted Capabilities",
    description:
      "Rigorous assessment process ensures verified competencies before recommendation. Reduce hiring uncertainty.",
    icon: Zap,
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/20"
  },
  {
    title: "Collaborative Partnerships",
    description:
      "Long-term talent relationships and ongoing professional connections for sustained project success.",
    icon: Network,
    color: "#ec4899",
    bgColor: "bg-pink-100 dark:bg-pink-900/20"
  },
];

const HireSection: React.FC<IHireSectionProps> = memo(({ className = "" }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 300);
    
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

  const handleContactClick = useCallback(() => {
    router.push('/contact-us');
  }, [router]);

  if (isLoading) {
    return (
      <section className={`relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full ${className}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
        
        <div className="relative z-10 w-full py-8 md:py-12">
          <div className="animate-pulse space-y-8 w-full px-4 sm:px-6 md:px-8">
            {/* Header skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full ${className}`}>
      {/* Background Pattern - Optimized for mobile */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 sm:opacity-30 dark:opacity-10 sm:dark:opacity-20"></div>
      
      {/* Gradient Overlay - Enhanced for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/30 dark:from-emerald-950/10 dark:via-transparent dark:to-blue-950/10 sm:from-emerald-50/50 sm:to-blue-50/50 sm:dark:from-emerald-950/20 sm:dark:to-blue-950/20"></div>
      
      {/* Floating Elements - Mobile optimized */}
      <div className="absolute top-4 sm:top-20 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-emerald-200/10 sm:bg-emerald-200/20 dark:bg-emerald-800/10 sm:dark:bg-emerald-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-4 sm:bottom-20 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-blue-200/10 sm:bg-blue-200/20 dark:bg-blue-800/10 sm:dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full py-4 sm:py-8 md:py-12">
        {/* Enhanced Header Section - Mobile Optimized */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={`${buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'mobile' })} mx-3 sm:mx-6 md:mx-8 lg:mx-12`}
        >
          <div className="text-center mb-6 sm:mb-10">
            <div className="w-full mx-auto">
              {/* Section Badge - Mobile Optimized */}
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-4 sm:mb-6">
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 mr-1.5 sm:mr-2" />
                <span>Professional Recruitment</span>
              </div>
              
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 leading-tight px-2 sm:px-0">
                Hire Industry-Ready{" "}
                <span className="block sm:inline text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-0">
                  Professionals
                </span>
              </h1>
              
              <div className="w-full mx-auto px-3 sm:px-0">
                <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-4 sm:mb-6">
                  Access vetted candidates with 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> real project experience</span> across 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> technical and business domains</span>
                </p>
                
                {/* Value Proposition Highlights - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  {["Pre-Vetted Talent", "Industry Experience", "Rapid Deployment"].map((value, index) => (
                    <div 
                      key={value}
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-full backdrop-blur-sm"
                    >
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 ${
                        index === 0 ? "bg-emerald-500" :
                        index === 1 ? "bg-blue-500" : "bg-violet-500"
                      }`}></div>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Mobile Optimized */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center mb-6 sm:mb-10">
            {/* Image Section - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative px-3 sm:px-0"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Professional team collaboration"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Professional Badge - Mobile Optimized */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/50 dark:border-slate-600/50">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-0.5 sm:mb-1">Industry-Ready</div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Verified Professionals</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefits Section - Mobile Optimized */}
            <div className="px-3 sm:px-0">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-4 sm:mb-6"
              >
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Why Choose
                </h2>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-3 sm:mb-4">
                  Recruit@MEDH?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Transform your hiring process with comprehensive talent solutions
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="space-y-3 sm:space-y-4"
              >
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group touch-manipulation"
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group-hover:border-emerald-300 dark:group-hover:border-emerald-600">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-grow min-h-[2.5rem]">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-1 sm:mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Enhanced Call to Action - More Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="px-3 sm:px-0"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-blue-700 dark:from-emerald-700 dark:to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/5 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-30"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  Ready to Find Your Perfect Candidate?
                </h3>
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed mb-4 sm:mb-5">
                  Connect with industry-ready professionals who can drive your business forward
                </p>
                
                <button
                  onClick={handleContactClick}
                  className="w-full sm:w-auto group inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 text-sm sm:text-base touch-manipulation"
                >
                  <span>Start Hiring Now</span>
                  <ArrowUp className="ml-2 w-4 h-4 rotate-45 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Indicators - More Compact */}
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/20">
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-center gap-2 sm:gap-6 text-[11px] sm:text-xs text-emerald-100">
                    {[
                      { icon: TrendingUp, text: "Proven Track Record" },
                      { icon: Award, text: "Quality Assurance" },
                      { icon: Shield, text: "Verified Professionals" }
                    ].map(({ icon: Icon, text }, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all z-50 min-h-[44px] min-w-[44px] touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
});

HireSection.displayName = "HireSection";

export default HireSection;
