'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Banner from "@/assets/Header-Images/News-and-media/Home_Banner_2_e7389bb905 .jpg";
import Cource from "@/assets/Header-Images/News-and-media/city-committed-education.jpg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import { ArrowRight, ChevronDown, Newspaper, Globe, Sparkles, Rss, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

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

// News categories with icons
const categories = [
  {
    icon: <Newspaper className="w-6 h-6" />,
    title: "Latest Updates",
    description: "Stay informed with our most recent developments",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Success Stories",
    description: "Discover inspiring journeys of our students",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Industry Insights",
    description: "Expert perspectives on tech education",
    color: "from-purple-500 to-violet-500"
  }
];

// Featured highlights
const highlights = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Innovation Hub",
    description: "Exploring cutting-edge educational technologies"
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Community Impact",
    description: "Making a difference in tech education"
  },
  {
    icon: <Rss className="w-8 h-8" />,
    title: "Media Coverage",
    description: "Our presence in the news and media"
  }
];

export default function BannerNews() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm md:text-base">ISO CERTIFIED</span>
            </motion.div>

            {/* Title */}
            <motion.div
              variants={animations.fadeInUp}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="space-y-4"
            >
              <h2 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium tracking-wider uppercase">
                STAY UPDATED WITH MEDH
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block">STAY INFORMED</span>
                <span className="block">GROW DYNAMICALLY</span>
                <span className="text-medhgreen">with MEDH</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Become part of our mission to redefine Innovative EdTech and transform Skill Development for the future.
              </p>
            </motion.div>
          </div>
          {/* CTA Section */}
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact-us/" className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 font-medium">
                Let's Connect
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Enhanced Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-2xl sm:text-3xl md:text-4xl font-medium italic text-center"
            >
              <span className="mumkinMedh">
                Medh Hai Toh Mumkin Hai!
              </span>
            </motion.div>

          {/* Highlights Grid */}
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{highlight.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* News Categories */}
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">News Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeCategory === index ? 1 : 0.7,
                    x: 0,
                    scale: activeCategory === index ? 1 : 0.98
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-xl p-6 cursor-pointer group"
                  onClick={() => setActiveCategory(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-br ${category.color} text-white rounded-xl p-3 w-fit mb-4`}>
                      {category.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{category.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
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
              className="flex flex-col items-center mt-4 animate-bounce"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Explore Our News</span>
              <ChevronDown className="text-gray-400 w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
