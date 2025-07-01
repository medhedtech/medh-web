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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements - optimized for mobile */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full py-8 md:py-12">
        {/* Enhanced Header Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={`${buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'desktop' })} mx-4 sm:mx-6 md:mx-8 lg:mx-12`}
        >
          <div className="text-center mb-10">
            <div className="w-full mx-auto">
              {/* Section Badge */}
              <div className={corporatePatterns.sectionBadge('emerald')}>
                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                <span>Professional Recruitment</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight whitespace-nowrap">
                Hire Industry-Ready <span className="text-emerald-600 dark:text-emerald-400">Professionals</span>
              </h1>
              
              <div className="w-full mx-auto">
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Access vetted candidates with 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> real project experience</span> across 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> technical and business domains</span>
                </p>
                
                {/* Value Proposition Highlights */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className={corporatePatterns.valueHighlight('emerald')}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="font-medium">Pre-Vetted Talent</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('blue')}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">Industry Experience</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('violet')}>
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-2"></div>
                    <span className="font-medium">Rapid Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-10">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Professional team collaboration and talent recruitment"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Professional Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/50 dark:border-slate-600/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">Industry-Ready</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Verified Professionals</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-6"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Why Choose
                </h2>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                  Recruit@MEDH?
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Transform your hiring process with comprehensive talent solutions
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="space-y-4"
              >
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group-hover:border-emerald-300 dark:group-hover:border-emerald-600">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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

          {/* Enhanced Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="bg-gradient-to-r from-emerald-600 to-blue-700 dark:from-emerald-700 dark:to-blue-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/5 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-30"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Find Your Perfect Candidate?
                </h3>
                <p className="text-lg text-emerald-100 leading-relaxed mb-8">
                  Connect with industry-ready professionals who can drive your business forward
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleContactClick}
                    className="group inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                  >
                    <span>Start Hiring Now</span>
                    <ArrowUp className="ml-3 w-5 h-5 rotate-45 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-emerald-100">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Proven Track Record</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Quality Assurance</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Verified Professionals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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

HireSection.displayName = "HireSection";

export default HireSection;
