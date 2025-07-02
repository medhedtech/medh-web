"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ArrowUp, UserPlus, FileText, Users, Shield, Award, Workflow, Target } from "lucide-react";
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
      <section className={`relative bg-white dark:bg-slate-950 min-h-screen overflow-hidden w-full ${className}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
        
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
    <section className={`relative bg-white dark:bg-slate-950 pt-2 md:pt-4 pb-0 md:pb-0 overflow-hidden w-full ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements - optimized for mobile */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Enhanced Header Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop', hover: false })}
        >
          <div className="text-center mb-12">
            <div className="w-full mx-auto">
              {/* Section Badge */}
              <div className={corporatePatterns.sectionBadge('violet')}>
                <Target className="w-4 h-4 text-violet-600 dark:text-violet-400 mr-2" />
                <span>Streamlined Process</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight whitespace-nowrap">
                Our Hiring <span className="text-violet-600 dark:text-violet-400">Process</span>
              </h2>
              
              <div className="w-full mx-auto">
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  A structured approach to finding the 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> right talent</span> for your 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> specific needs</span>
                </p>
              </div>
            </div>
          </div>
            </motion.div>

        {/* Process Steps */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={staggerContainer}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-stretch px-0"
            >
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex-1 min-w-[220px] max-w-xs md:max-w-sm lg:max-w-xs flex flex-col items-center text-center"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-600 shadow-sm w-full h-full flex flex-col items-center">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md mb-3">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex flex-col items-center mb-2">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1">
                          {step.title}
                        </h4>
                        <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full">
                          Step {index + 1}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
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
              className="mt-4 md:mt-4"
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
