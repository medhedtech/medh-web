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
    title: "Who We Are?",
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    content: "We are a dedicated team of technologists, entrepreneurs and visionaries who believe that education through technology is the key to shaping a brighter future. Our diverse and talented team brings together expertise from various domains to create a dynamic learning ecosystem that caters to learners of all ages and backgrounds.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    title: "Our Commitment to Quality",
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
    content: "Quality is at the core of everything we do. We are committed to delivering content that is precise, current, and aligned with the evolving trends and needs of the educational landscape. Our team of subject matter experts ensure that the learning materials are engaging, effective, and aligned with the latest industry standards.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    title: "Empowering Lifelong Learning",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
    content: "At Medh, we believe that learning should not be limited to a specific stage of life. We are dedicated to nurturing a culture of lifelong learning, enabling individuals to continuously upskill and reskill to adapt to the ever-evolving demands of the modern world. Whether you are a student, a professional, a homemaker or someone eager to pursue your passions, our platform offers a diverse range of courses tailored to help you achieve your aspirations.",
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
      <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Image skeleton */}
              <div className="lg:w-1/2">
                <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="lg:w-1/2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                        </div>
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
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-8 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              Our Story
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-white bg-clip-text text-transparent">
              Transforming Education Together
            </h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Image Section - Enhanced with Glassmorphism */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInLeft}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="relative group">
                {/* Glass effect background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-2xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-2 sm:p-3 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30">
                  <Image
                    src={Explain}
                    alt="Who we are at Medh"
                    className="rounded-lg md:rounded-xl w-full h-auto"
                    priority
                  />
                  
                  {/* Decorative badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                  >
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      Innovation First
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Content Section - Enhanced Cards */}
            <div className="lg:w-1/2 space-y-4 md:space-y-6">
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
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 group">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Icon Container */}
                      <motion.div
                        animate={{
                          scale: hoveredIndex === index ? 1.1 : 1,
                          rotate: hoveredIndex === index ? 360 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${section.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${section.color}`}
                      >
                        {section.icon}
                      </motion.div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 bg-gradient-to-r ${section.gradientFrom} ${section.gradientTo} bg-clip-text text-transparent`}>
                          {section.title}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover effect indicator */}
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

      {/* Scroll to top button - Mobile Optimized */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full shadow-lg transition-all z-50 hover:shadow-xl"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(WhoWeAre);
