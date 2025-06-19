"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, ChevronRight, ArrowUp, Users, Target, Shield, Zap, Network } from "lucide-react";
import { useRouter } from "next/navigation";
import HireSectionImg from "@/assets/images/hireformmedh/hiresectionimg.png";

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
    title: "Job Ready Candidates",
    description:
      "Our intensive courses are led by industry experts, ensuring that our candidates are job-ready upon completion, equipped with practical experience from relevant projects and real-world scenarios.",
    icon: Target,
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Diverse Talent Pool",
    description:
      "Our platform boasts a diverse talent pool across multiple domains and skill levels, allowing you to choose the perfect fit for your projects based on their expertise and experience.",
    icon: Users,
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
  },
  {
    title: "Dedicated Support",
    description:
      "Count on our dedicated relationship managers who are well-versed in understanding your specific needs, providing unwavering support throughout the entire hiring process.",
    icon: Shield,
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/20"
  },
  {
    title: "Strong Technical Skills",
    description:
      "We prioritize strong technical skills through a rigorous selection process and continuous assessment, ensuring candidates possess the necessary competencies for immediate success.",
    icon: Zap,
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/20"
  },
  {
    title: "Networking Opportunities",
    description:
      "Emphasizing the power of professional networking, we encourage potential collaborations and partnerships for joint projects and expanded access to top-tier talent.",
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
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

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
            DISCOVER EXCEPTIONAL TALENT INSTANTLY WITH{" "}
            <span className="text-emerald-600 dark:text-emerald-400">MEDH</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Pre-Vetted Professionals Ready to Accelerate Innovation across Multiple Domains
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
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative order-2 md:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={HireSectionImg}
                  alt="Hire from Medh - Professional talent recruitment"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </motion.div>

            {/* Content Section */}
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6 md:mb-8"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Why Hire from
                </h2>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  Recruit@Medh?
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="space-y-4 md:space-y-6"
              >
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:shadow-md hover:transform hover:translate-x-2"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: benefit.color }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
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

HireSection.displayName = "HireSection";

export default HireSection;
