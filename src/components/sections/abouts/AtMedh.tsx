"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  CheckCircle, 
  Lightbulb, 
  RefreshCw, 
  ArrowUp,
  Target,
  Heart,
  Sparkles
} from "lucide-react";
import { mobilePatterns } from "@/utils/designSystem";

interface IBelief {
  text: string;
  icon?: React.ReactElement;
}

interface ICard {
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

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const beliefs: IBelief[] = [
  {
    text: "🌍 Passionate about transforming education globally"
  },
  {
    text: "🎯 Fun learning through technology + pedagogy fusion"
  },
  {
    text: "⚡ Data-driven insights for innovative solutions"
  }
];

const cards: ICard[] = [
  {
    title: "VISION",
    icon: <Lightbulb className="w-5 h-5" />,
    content: "🚀 Lead EdTech → Empower individuals → Every life stage (childhood to career)",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600"
  },
  {
    title: "MISSION",
    icon: <RefreshCw className="w-5 h-5" />,
    content: "💡 AI-powered learning • Industry certifications • Expert collaborations = Professional growth",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  }
];

const AtMedh: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
      <section className={`relative ${mobilePatterns.mobileSection()} overflow-hidden`}>
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-blue-50/50 dark:from-amber-950/20 dark:via-transparent dark:to-blue-950/20"></div>
        
        <div className={`relative z-10 ${mobilePatterns.mobileContainer('lg')}`}>
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-2/3 mx-auto mb-12"></div>
            
            {/* Content and Image skeleton */}
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
              <div className="lg:w-3/5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:w-2/5">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
            
            {/* Cards skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                      </div>
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
    <section className="relative bg-slate-50 dark:bg-slate-900 overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-blue-50/50 dark:from-amber-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full py-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-4 sm:p-6 md:p-10 my-8">
            {/* Main Heading - Enhanced */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/30 dark:to-blue-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold rounded-full mb-6 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">
                At <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Medh,</span> we
              </h2>
            </motion.div>

            {/* Beliefs Section - Full Width */}
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInLeft}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-6 md:p-8 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {beliefs.map((belief, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index + 0.3 }}
                        className="text-center group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center shadow-sm mx-auto mb-3"
                        >
                          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {belief.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Vision and Mission Cards - Enhanced */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative"
                >
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-6 md:p-8 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 hover:shadow-2xl transition-all duration-300 h-full">
                    {/* Animated background gradient */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 ${hoveredCard === index ? 'scale-125' : 'scale-100'} transition-transform duration-500`}></div>
                    
                    <div className="relative flex items-start gap-4 md:gap-6">
                      {/* Icon Container */}
                      <motion.div
                        animate={{
                          scale: hoveredCard === index ? 1.1 : 1,
                          rotate: hoveredCard === index ? 360 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 sm:w-14 sm:h-14 ${card.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${card.color} shadow-sm`}
                      >
                        {card.icon}
                      </motion.div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`text-xl sm:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r ${card.gradientFrom} ${card.gradientTo} bg-clip-text text-transparent`}>
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {card.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative corner element */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-10 rounded-tl-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional decorative element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-6 md:mt-8"
            >
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-sm sm:text-base italic">Transforming Education, Empowering Lives</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AtMedh);
