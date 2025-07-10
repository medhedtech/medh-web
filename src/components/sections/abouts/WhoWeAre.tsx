"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Users, 
  Shield, 
  BookOpen, 
  ArrowUp,
  Heart,
  Zap
} from "lucide-react";
import { mobilePatterns } from "@/utils/designSystem";
import Explain from "@/assets/images/about/explain.png";

interface ISection {
  title: string;
  icon: React.ReactElement;
  content: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const sections: ISection[] = [
  {
    title: "Who We Are",
    icon: <Users className="w-5 h-5" />,
    content: "Tech innovators + Educators = Future-ready learning platform for all ages",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    title: "Quality First",
    icon: <Shield className="w-5 h-5" />,
    content: "Industry-standard content • Expert-crafted materials • Always current",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    title: "Lifelong Growth",
    icon: <BookOpen className="w-5 h-5" />,
    content: "Student → Professional → Expert: Your learning journey, our expertise",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  }
];

const WhoWeAre: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        <div className={`relative z-10 w-full`}>
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-1/2">
                <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
              <div className="lg:w-1/2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative w-full overflow-hidden`}>
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-4 sm:p-6 md:p-10 max-w-6xl mx-auto my-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        {/* Floating Elements - Mobile optimized */}
        <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
        <div className="absolute top-20 sm:top-40 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-20 h-20 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 w-full">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-lg md:rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              Our Story
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Transforming Education Together
            </h1>
          </motion.div>

          {/* Content Section - Full Width */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index + 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="relative"
                >
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                    <motion.div
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                        rotate: hoveredIndex === index ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 ${section.bgColor} rounded-xl flex items-center justify-center ${section.color} mx-auto mb-4`}
                    >
                      {section.icon}
                    </motion.div>
                    
                    <h2 className={`text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r ${section.gradientFrom} ${section.gradientTo} bg-clip-text text-transparent`}>
                      {section.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.content}
                    </p>
                    
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${section.gradientFrom} ${section.gradientTo} rounded-b-xl`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default memo(WhoWeAre);
