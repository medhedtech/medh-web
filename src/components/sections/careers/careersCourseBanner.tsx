"use client";


import React, { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  Target,
  Send,
  ChevronRight,
  Star,
  Briefcase
} from "lucide-react";
import { useTheme } from "next-themes";
import { 
  buildComponent, 
  buildAdvancedComponent, 
  corporatePatterns, 
  getResponsive,
  getAnimations,
  backgroundPatterns
} from "@/utils/designSystem";

// Import assets
import CourseBannerImg from "@/assets/images/personality/coursebannerimg.jpg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

interface ICourseData {
  heading: string;
  description: string;
  buttonText: string;
  imageUrl: any;
  buttonBgColor: string;
  icon: any;
}

interface IFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const CareerCourseBanner: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDark = mounted ? theme === 'dark' : true;

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Enhanced course data
  const courseData: ICourseData = {
    heading: "Ready to join our innovative team?",
    description: "Explore our current job openings and apply today. Be part of a dynamic team that's transforming education through cutting-edge technology and innovative approaches.",
    buttonText: "Apply Now",
    imageUrl: CourseBannerImg,
    buttonBgColor: "#3b82f6", // Blue-500
    icon: VerticalIcon,
  };

  // Features highlighting why to join
  const features: IFeature[] = [
    {
      icon: Sparkles,
      title: "Innovation-Driven",
      description: "Work with cutting-edge EdTech solutions",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Join a diverse and inclusive team",
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: Target,
      title: "Career Growth",
      description: "Opportunities for professional development",
      color: "text-violet-600 dark:text-violet-400"
    }
  ];

  const handleApplyClick = () => {
    // Enhanced scroll functionality
    const targetSelectors = [
      '#job-openings',
      '#current-openings', 
      '[data-section="job-positions"]',
      '[class*="JobPositions"]',
      '[class*="job-positions"]'
    ];

    let targetSection: HTMLElement | null = null;

    // Try each selector
    for (const selector of targetSelectors) {
      targetSection = document.querySelector(selector) as HTMLElement;
      if (targetSection) break;
    }

    // Try finding by text content if no ID found
    if (!targetSection) {
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      for (const heading of headings) {
        if (heading.textContent?.toLowerCase().includes('current openings') ||
            heading.textContent?.toLowerCase().includes('job positions') ||
            heading.textContent?.toLowerCase().includes('openings')) {
          targetSection = heading as HTMLElement;
          break;
        }
      }
    }

    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Fallback: navigate to careers page with anchor
      router.push('/careers#job-openings');
    }
  };

  if (!mounted) {
    return (
      <section className="relative bg-slate-50 dark:bg-slate-900 py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-violet-950/20 py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-violet-200/30 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Content Section */}
          <motion.div 
            variants={fadeInUp}
            className="text-center lg:text-left space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Join Our Team
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 dark:text-white"
            >
              {courseData.heading}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl lg:max-w-none"
            >
              {courseData.description}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/50 dark:border-slate-600/50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 rounded-lg flex items-center justify-center">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={fadeInUp}
              className="pt-4"
            >
              <motion.button
                onClick={handleApplyClick}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                {/* Button Background Glow */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-xl blur-lg opacity-0"
                />
                
                {/* Button Content */}
                <div className="relative flex items-center gap-3">
                  <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="text-lg">{courseData.buttonText}</span>
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Success indicator */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Additional Info */}
              <motion.p
                variants={fadeInUp}
                className="mt-4 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Join 500+ professionals already transforming education
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={fadeInUp}
            variants={scaleOnHover}
            initial="initial"
            whileHover="hover"
            className="relative"
          >
            <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/20 z-10"></div>
              
              {/* Main Image */}
              <Image
                src={courseData.imageUrl}
                alt="Join our innovative team at Medh"
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />

              {/* Floating Elements on Image */}
              <div className="absolute top-6 right-6 z-20">
                <div className="w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src={courseData.icon}
                    alt="Medh Icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Bottom Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        Active Openings
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Multiple positions available
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Hiring Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-60 animate-bounce animation-delay-1000"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-violet-500 rounded-full opacity-60 animate-bounce animation-delay-2000"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(CareerCourseBanner);
