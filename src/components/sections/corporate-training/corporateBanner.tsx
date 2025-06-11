"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Building, Target, Users, BookOpen, Star, TrendingUp, Shield, Award, Zap, Globe, Heart, Sparkles } from "lucide-react";
import Iso from "@/assets/images/courseai/iso.png";

// Animation variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }
};

// Values data for corporate training
const values = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Results-Driven Approach",
    description: "Focused on measurable outcomes and business impact",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Industry Expertise",
    description: "Deep knowledge across various business domains",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Innovation Focus",
    description: "Cutting-edge training methodologies and technologies",
    color: "from-purple-500 to-violet-500"
  }
];



// Key highlights for corporate training
const highlights = [
  {
    icon: <Building className="w-8 h-8" />,
    title: "Enterprise Ready",
    description: "Scalable solutions for organizations of all sizes"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Quality Assured",
    description: "Structured programs with measurable outcomes"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Growth Focused",
    description: "Designed to accelerate professional development"
  }
];

interface CorporateBannerProps {
  onLearnMoreClick?: () => void;
}

const CorporateBanner: React.FC<CorporateBannerProps> = ({ onLearnMoreClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollToForm = (): void => {
    const formElement = document.getElementById('enroll-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-white dark:bg-gray-900 overflow-hidden py-8 sm:py-12 md:py-16 flex items-center justify-center">
      {/* Modern background with geometric shapes and gradients */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>

        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 animate-float animation-delay-2000"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-blue-500/20 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-green-500/20 animate-spin-slow animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-blue-500/20 transform rotate-45 animate-float"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full mx-auto max-w-7xl xl:max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* ISO Badge */}
            <motion.div
              variants={animations.scaleIn}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-500/15 transition-colors duration-300 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={Iso}
                alt="ISO Certification"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm md:text-base">ISO 9001:2015 CERTIFIED</span>
            </motion.div>

            {/* Title */}
            <motion.div
              variants={animations.fadeInUp}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="space-y-4"
            >
              <h2 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium tracking-wider uppercase">
                CORPORATE TRAINING EXCELLENCE
              </h2>
              <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block">ELEVATE YOUR</span>
                <span className="block">WORKFORCE SKILLS</span>
                <span className="text-medhgreen">with MEDH</span>
              </h1>
                           <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto px-4 sm:px-6 md:px-8 mb-8 pb-8">
               Transform your team's potential into performance with our customized corporate training programs designed to drive business growth and innovation.
             </p>
           </motion.div>

           {/* CTA Section */}
           <motion.div
             variants={animations.fadeInUp}
             initial="hidden"
             animate={isLoaded ? "visible" : "hidden"}
             transition={{ delay: 0.6 }}
             className="flex flex-col items-center gap-8 mb-16 px-4 sm:px-6"
           >
             <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
               <button 
                 onClick={onLearnMoreClick || handleScrollToForm}
                 className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 font-medium text-base sm:text-lg"
               >
                 Get Started
                 <ArrowRight className="ml-2 h-5 w-5" />
               </button>
               <button 
                 onClick={() => window.location.href = "/contact-us"} 
                 className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 font-medium text-base sm:text-lg"
               >
                 Contact Us
               </button>
             </div>

             {/* Enhanced Slogan */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7 }}
               className="mumkinMedh text-2xl sm:text-3xl md:text-4xl font-medium italic text-center"
             >
               Medh Hai Toh Mumkin Hai!
             </motion.div>
           </motion.div>
         </div>

         {/* Key Highlights Section */}
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="text-blue-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {highlight.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{highlight.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>



          {/* Values Section */}
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Training Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeValue === index ? 1 : 0.7,
                    x: 0,
                    scale: activeValue === index ? 1 : 0.98
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-xl p-6 cursor-pointer group"
                  onClick={() => setActiveValue(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-br ${value.color} text-white rounded-xl p-3 w-fit mb-4`}>
                      {value.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
                     </motion.div>

           {/* Scroll Indicator */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="flex flex-col items-center mt-8 animate-bounce"
           >
             <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Explore Our Programs</span>
             <ChevronDown className="text-gray-400 w-6 h-6" />
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CorporateBanner; 