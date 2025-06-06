'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Target, Award, Brain, Database, ChevronRight, ArrowRight } from 'lucide-react';

function HireFromMedhBanner() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    // Auto-rotate features on mobile
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  // Stats - now with animations and better styling
  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      value: "500+",
      label: "Skilled Professionals"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      value: "98%",
      label: "Placement Rate"
    },
    {
      icon: <Award className="w-5 h-5 text-blue-500" />,
      value: "100+",
      label: "Partner Companies"
    }
  ];

  // Features with enhanced icons and animations
  const features = [
    {
      icon: <Brain className="w-7 h-7 text-blue-500" />,
      title: "Global Talent Pool",
      description: "Access worldwide expertise across various domains and technologies",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Database className="w-7 h-7 text-green-500" />,
      title: "AI & Data Science",
      description: "Specialized skills in machine learning, deep learning, and analytics",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Award className="w-7 h-7 text-yellow-500" />,
      title: "Digital Marketing",
      description: "Analytics experts with proven track records in driving growth",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  // Handle scroll to registration form
  const handleScrollToRegistration = () => {
    const formElement = document.getElementById('registration-form');
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
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 animate-float animation-delay-2000"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-blue-500/20 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-indigo-500/20 animate-spin-slow animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-blue-500/20 transform rotate-45 animate-float"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full mx-auto max-w-7xl xl:max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={animations.fadeInUp}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6 lg:space-y-8 xl:pr-8"
            >
              {/* Enhanced Badge */}
              <motion.div
                variants={animations.scaleIn}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-500/15 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm md:text-base">HIRE PROFESSIONALS FROM MEDH</span>
              </motion.div>

              {/* Enhanced Title */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  <span className="block">Efficient</span>
                  <span className="block">Recruitment<span className="text-blue-500">.</span></span>
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Global Talent Pool</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                Recruit top IT professionals in areas including AI, Data Science, Digital Marketing, Analytics, Cybersecurity, and more. Save time and resources with our pre-vetted talent.
              </p>

              {/* Stats Section - Responsive & Animated */}
              {/* <motion.div
                variants={animations.fadeInUp}
                className="grid grid-cols-3 gap-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center bg-white/50 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-gray-200/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/10"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500/10">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div> */}

              {/* CTA Buttons */}
              <motion.div
                variants={animations.fadeInUp}
                className="flex flex-wrap gap-3 sm:gap-4 pt-2"
              >
                <button
                  onClick={handleScrollToRegistration}
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 font-medium text-sm sm:text-base"
                >
                  Let's Connect
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Content - Feature Cards with Gradients */}
            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={animations.fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4 sm:space-y-6 xl:pl-8"
            >
              {/* Mobile Feature Carousel */}
              <div className="block lg:hidden overflow-hidden px-2 sm:px-4">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br p-0.5 rounded-2xl overflow-hidden"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${currentFeature === 0 ? 'var(--tw-gradient-from-blue-500), var(--tw-gradient-to-indigo-500)' : currentFeature === 1 ? 'var(--tw-gradient-from-green-500), var(--tw-gradient-to-teal-500)' : 'var(--tw-gradient-from-yellow-500), var(--tw-gradient-to-orange-500)'})` }}
                >
                  <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl h-full">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full p-2 sm:p-3 bg-gradient-to-br flex-shrink-0" style={{ backgroundImage: `linear-gradient(to bottom right, ${currentFeature === 0 ? 'var(--tw-gradient-from-blue-500), var(--tw-gradient-to-indigo-500)' : currentFeature === 1 ? 'var(--tw-gradient-from-green-500), var(--tw-gradient-to-teal-500)' : 'var(--tw-gradient-from-yellow-500), var(--tw-gradient-to-orange-500)'})` }}>
                        {features[currentFeature].icon}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                          {features[currentFeature].title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {features[currentFeature].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Feature Navigation Dots */}
                <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                        index === currentFeature ? "bg-blue-500 scale-125" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                      aria-label={`Feature ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop Feature Cards */}
              <div className="hidden lg:grid grid-cols-1 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.2 }}
                    className={`bg-gradient-to-br ${feature.color} p-0.5 rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl h-full">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`rounded-full p-2 sm:p-3 bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Visual Element - 3D Isometric Block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="hidden lg:block mt-6 sm:mt-8 relative h-24 sm:h-32"
              >
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-24 sm:w-32 h-24 sm:h-32">
                  <div className="absolute w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-lg transform rotate-45 animate-float"></div>
                  <div className="absolute left-8 sm:left-12 top-8 sm:top-12 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg transform rotate-12 animate-float animation-delay-1000"></div>
                  <div className="absolute left-16 sm:left-24 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg transform -rotate-12 animate-float animation-delay-2000"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Enhanced Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`mumkinMedh text-xl sm:text-2xl md:text-3xl font-medium italic text-center lg:text-left mt-1 sm:mt-4`}
          >
<<<<<<< HEAD
            Medh Hain Toh Mumkin Hai!
=======
            Medh Hai Toh Mumkin Hai!
>>>>>>> f1430ea24f47e7db52d620ec30e11914e4a1de6e
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HireFromMedhBanner;
