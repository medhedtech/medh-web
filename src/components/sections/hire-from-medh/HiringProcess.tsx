"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, ChevronRight, ArrowUp, UserPlus, FileText, Users, Shield, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import HiringProcessImg from "../../../assets/images/hireformmedh/hiringprocessimg.jpeg";

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
      "Companies interested in hiring through our placement cell need to register with us and provide comprehensive details about their organization, culture, and specific job openings to ensure the best candidate match.",
    icon: UserPlus,
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Job Description",
    description:
      "After registration, companies can share detailed job descriptions, requirements, and expectations with our team. We help refine these to attract the most suitable candidates from our talent pool.",
    icon: FileText,
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
  },
  {
    title: "Candidate Shortlisting",
    description:
      "Our expert team carefully reviews and shortlists qualified candidates from our extensive pool who perfectly match the job requirements, skills, and company culture fit.",
    icon: Users,
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/20"
  },
  {
    title: "Pre-screening & Assessment",
    description:
      "The shortlisted candidates undergo comprehensive evaluation including technical assessments, behavioral interviews, and skill validation to ensure they meet the highest standards.",
    icon: Shield,
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/20"
  },
  {
    title: "Final Selection & Placement",
    description:
      "Based on comprehensive evaluation results, companies can conduct final interviews, make informed hiring decisions, and extend job offers to the most qualified candidates.",
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
    <section className={`relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full ${className}`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Enhanced Header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-8 max-w-6xl mx-auto text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            <span className="text-emerald-600 dark:text-emerald-400">Streamlined Process</span> for Hiring
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            IT Professionals through Recruit@Medh
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Our hiring process is completely managed by our Support Team and a Dedicated Relationship Manager assigned for you
          </p>
        </motion.div>

        {/* Main Content Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content Section */}
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6 md:mb-8"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Our Comprehensive Hiring Process
                </h3>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Experience a seamless recruitment journey with our structured approach that ensures quality matches and successful placements.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="space-y-4 md:space-y-6"
              >
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:shadow-md hover:transform hover:translate-x-2"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: step.color }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-2">
                          {step.title}
                        </h4>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative order-1 md:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={HiringProcessImg}
                  alt="Professional hiring process illustration"
                  className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 text-center mt-8 max-w-6xl mx-auto"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to Start Your Hiring Journey?
          </h3>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Connect with our dedicated recruitment specialists and experience our streamlined hiring process that delivers exceptional talent.
          </p>
          <button
            onClick={handleContactClick}
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm md:text-base transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 min-h-[44px] touch-manipulation"
            aria-label="Begin hiring process"
          >
            Begin Hiring Process
            <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </button>
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
