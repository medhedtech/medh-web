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
      <div className="w-full">
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
    );
  }

  return (
    <div className="w-full pt-6 pb-6">
      {/* Header Section */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs sm:text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-700 shadow">
          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
          Our Story
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Transforming Education Together
        </h1>
      </div>
      {/* Content Section - Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4 ${section.color}`}>
              {section.icon}
            </div>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r ${section.gradientFrom} ${section.gradientTo} bg-clip-text text-transparent`}>
              {section.title.replace(/[^\w\s-:]/g, "")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {section.content.replace(/[^\w\s-:.,+]/g, "")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WhoWeAre);
