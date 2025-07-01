"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ArrowUp, UserPlus, FileText, Users, Shield, Award, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildAdvancedComponent, corporatePatterns, mobilePatterns } from "@/utils/designSystem";

interface IProcessStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface IHiringProcessProps {
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

const steps: IProcessStep[] = [
  {
    title: "Company Registration",
    description:
      "Register with your requirements. We match you with pre-assessed candidates from our talent pool.",
    icon: UserPlus,
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Job Requirements",
    description:
      "Share your job specs. Our team helps refine requirements to find the perfect candidates faster.",
    icon: FileText,
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
  },
  {
    title: "Candidate Matching",
    description:
      "We shortlist qualified professionals who match your technical needs and company culture.",
    icon: Users,
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/20"
  },
  {
    title: "Skill Verification",
    description:
      "Candidates undergo technical assessment and skill validation. Only verified talent reaches you.",
    icon: Shield,
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/20"
  },
  {
    title: "Hire & Onboard",
    description:
      "Conduct final interviews with pre-screened candidates. Make confident hiring decisions quickly.",
    icon: Award,
    color: "#ec4899",
    bgColor: "bg-pink-100 dark:bg-pink-900/20"
  },
];

const HiringProcess: React.FC<IHiringProcessProps> = memo(({ className = "" }) => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${mobilePatterns.mobileSection()} overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements - optimized for mobile */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className={`relative z-10 ${mobilePatterns.mobileContainer('lg')}`}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'mobile' })}
        >
          {/* Header Section - Mobile optimized */}
          <div className="text-center mb-8 md:mb-10">
            <div className="max-w-4xl mx-auto">
              {/* Section Badge */}
              <div className={corporatePatterns.sectionBadge('violet')}>
                <Workflow className="w-3 h-3 sm:w-4 sm:h-4 text-violet-600 dark:text-violet-400 mr-2" />
                <span className="text-xs sm:text-sm">Streamlined Process</span>
              </div>
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4 leading-tight">
                <span className="text-violet-600 dark:text-violet-400">Simple</span> Hiring Process
              </h1>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-4 md:mb-6">
                  Fully managed by our support team with a 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> dedicated relationship manager</span> for you
                </p>
                
                {/* Process Highlights - Mobile friendly */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                  <div className={corporatePatterns.valueHighlight('violet')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full mr-2"></div>
                    <span className="font-medium">5 Simple Steps</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('emerald')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="font-medium">Fully Managed</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('blue')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">Quick Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Enhanced mobile layout */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 md:mb-8"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 md:mb-3 text-center">
                How It Works
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                Five simple steps to connect with verified professionals
              </p>
            </motion.div>

            {/* Process Steps - Improved mobile layout */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="space-y-3 sm:space-y-4"
            >
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group-hover:border-violet-300 dark:group-hover:border-violet-600">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Icon Container - Mobile optimized */}
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        
                        {/* Content Container - Better mobile alignment */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 mb-1 sm:mb-0 leading-tight">
                              {step.title}
                            </h4>
                            <div className="text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 sm:px-3 py-1 rounded-full w-fit">
                              Step {index + 1}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Summary Stats - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-8 md:mt-10"
            >
              <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-violet-200/50 dark:border-violet-700/50">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1 sm:mb-2">5</div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Simple Steps</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-2">100%</div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Managed Process</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">Fast</div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Quick Results</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all z-50 min-h-[44px] min-w-[44px] touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
});

HiringProcess.displayName = "HiringProcess";

export default HiringProcess;
