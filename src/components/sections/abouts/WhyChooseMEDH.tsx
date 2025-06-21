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
import Certified from "../why-medh/Certified";

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
    title: "Educational Goals Alignment",
    description:
      "We align with your educational goals and objectives, providing 360-degree coverage for immersive online learning.",
    icon: Target,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    title: "Quality Learning Materials",
    description:
      "We assess content quality and effectiveness, ensuring up-to-date, well-structured materials that drive learning outcomes.",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    title: "User-Friendly Platform",
    description:
      "We have a user-friendly platform for both educators and learners, ensuring ease of use and compatibility with different devices.",
    icon: Monitor,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  },
  {
    title: "Data Privacy & Security",
    description:
      "Our stringent measures ensure data privacy and security, safeguarding sensitive information from unauthorized access or breaches.",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600"
  },
  {
    title: "Personalized Learning",
    description:
      "We offer personalized learning experiences that cater to individual students' needs and adapt to their progress.",
    icon: User,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    title: "Continuously Updated",
    description:
      "Continuously updating to meet evolving educational needs, we ensure learners receive the best and most relevant experiences.",
    icon: RefreshCw,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-sky-600"
  },
  {
    title: "Industry-Relevant Courses",
    description:
      "Our courses, developed with industry experts, stay relevant and practical, guaranteeing valuable content delivery.",
    icon: Briefcase,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-600"
  },
  {
    title: "Practical Skills Focus",
    description:
      "Our courses emphasize practical, job-relevant skills designed to boost your professional competitiveness.",
    icon: Zap,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600"
  },
  {
    title: "Certification Upon Completion",
    description:
      "Upon course completion, we provide certifications to enhance your resume and validate newly acquired skills.",
    icon: GraduationCap,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    gradientFrom: "from-purple-600",
    gradientTo: "to-violet-600"
  },
];

const WhyChooseMEDH: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

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
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-32 mx-auto mb-4"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Features grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
          {/* Header Section - Enhanced */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-12 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              Why Choose{" "}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-600 dark:text-slate-400">
                  with
                </span>
                <Image
                  src="/images/medhlogo.svg"
                  alt="MEDH Logo"
                  width={120}
                  height={120}
                  unoptimized={true}
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, (max-width: 1024px) 48px, 56px"
                  className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
                  priority
                />
              </div>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Empowering learners with the freedom to explore and excel in
              fundamental concepts, we strive to provide a global EdTech platform
              to shape aspirations.
            </p>
          </motion.div>

          {/* Features Grid - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(idx)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative"
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={{
                        scale: hoveredFeature === idx ? 1.1 : 1,
                        rotate: hoveredFeature === idx ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 ${feature.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm relative overflow-hidden`}
                    >
                      {/* Background glow effect */}
                      <motion.div
                        animate={{
                          opacity: hoveredFeature === idx ? 0.6 : 0,
                          scale: hoveredFeature === idx ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} opacity-0 blur-md`}
                      />
                      <feature.icon 
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.color} relative z-10 transition-all duration-300`}
                      />
                    </motion.div>
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 md:mb-3 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} bg-clip-text text-transparent`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredFeature === idx ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-full flex items-center justify-center`}
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
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

export default memo(WhyChooseMEDH);
