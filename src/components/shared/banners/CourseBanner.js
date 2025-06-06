'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Animation variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideIn: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  }
};

function CourseBanner({
  badge,
  title,
  titleHighlight,
  description,
  features,
  mainImage,
  studentImage,
  enrollmentPath = '/enrollment',
  onEnrollClick,
  themeClasses = {
    badge: "bg-blue-500",
    badgeContainer: "bg-blue-500/10",
    title: "text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
    secondaryButton: "text-blue-500 border-blue-500 hover:bg-blue-50",
    gradientFrom: "from-blue-500/20",
    gradientVia: "via-indigo-500/10",
    gradientTo: "to-transparent",
    backgroundPrimary: "bg-blue-500/10",
    backgroundSecondary: "bg-indigo-500/10"
  }
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="
      relative 
      h-screen max-h-screen 
      bg-gradient-to-b from-gray-50 via-gray-50/80 to-white 
      dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800 
      overflow-hidden
    ">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.04] animate-pulse-slow bg-[length:30px_30px]" />
        <div className={`absolute -top-1/4 right-1/2 w-[120%] aspect-square ${themeClasses.backgroundPrimary} rounded-full blur-3xl transform translate-x-1/2 opacity-30 dark:opacity-20 animate-float mix-blend-multiply dark:mix-blend-soft-light`} />
        <div className={`absolute top-1/4 left-1/2 w-[120%] aspect-square ${themeClasses.backgroundSecondary} rounded-full blur-3xl transform -translate-x-1/2 opacity-30 dark:opacity-20 animate-float animation-delay-1000 mix-blend-multiply dark:mix-blend-soft-light`} />
      </div>

      {/* Content Container */}
      <div className="
        container-responsive 
        relative z-10 
        h-full
        flex items-center
        py-4 pt-0 md:pt-4 safe-top safe-bottom
      ">
        <div className="
          grid grid-cols-1 lg:grid-cols-2 
          gap-6 lg:gap-12 
          items-center 
          w-full
          h-full max-h-[calc(100dvh-4rem)]
        ">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={animations.fadeInUp}
            transition={{ duration: 0.6 }}
            className="
              space-y-6 md:space-y-8
              text-center lg:text-left
              flex flex-col justify-center
            "
          >
            {/* Title and Description */}
            <div className="space-y-2 sm:space-y-3 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto lg:mx-0">
              <h1 className="
                font-bold text-gray-900 dark:text-white 
                tracking-tight leading-[1.1]
                text-1xl xs:text-2xl sm:text-3xl lg:text-4xl 3xl:text-5xl
                bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200
              ">
                {title}{" "}
                <span className={`${themeClasses.title} inline-block transform hover:scale-105 transition-all duration-300`}>
                  {titleHighlight}
                </span>
              </h1>
              <div className="
                text-lg sm:text-xl md:text-l
                text-gray-600 dark:text-gray-300 
                max-w-l 
                mx-auto lg:mx-0 
                leading-relaxed
              ">
                {description}
              </div>
            </div>

            {/* Mobile Feature Carousel */}
            <div className="block lg:hidden">
              <motion.div
                key={currentFeature}
                initial="hidden"
                animate="visible"
                variants={animations.slideIn}
                transition={{ duration: 0.5 }}
                className="
                  bg-white/90 dark:bg-gray-800/90 
                  rounded-xl p-5
                  shadow-lg hover:shadow-xl 
                  backdrop-blur-sm 
                  mx-auto max-w-sm
                "
              >
                <div className="flex items-start gap-4">
                  <div className="text-primary-500 text-2xl flex-shrink-0">
                    {features[currentFeature].icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {features[currentFeature].title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {features[currentFeature].description}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Feature Navigation Dots */}
              <div className="flex justify-center gap-3 mt-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentFeature 
                        ? `${themeClasses.badge} scale-125` 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Features Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={animations.fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 shadow-lg hover:shadow-xl backdrop-blur-sm group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-primary-500 text-2xl transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
              {onEnrollClick ? (
                <button
                  onClick={onEnrollClick}
                  className={`
                    w-full sm:w-auto 
                    inline-flex items-center justify-center 
                    px-8 py-4
                    ${themeClasses.button} 
                    text-white font-medium 
                    rounded-xl
                    transition-all duration-300 
                    transform hover:-translate-y-1 hover:scale-105
                    shadow-lg hover:shadow-xl 
                    text-lg
                  `}
                >
                  <span className="mr-2">Enroll Now</span>
                  <ChevronRight className="h-5 w-5 animate-bounce" />
                </button>
              ) : (
                <Link
                  href={enrollmentPath}
                  className={`
                    w-full sm:w-auto 
                    inline-flex items-center justify-center 
                    px-8 py-4
                    ${themeClasses.button} 
                    text-white font-medium 
                    rounded-xl
                    transition-all duration-300 
                    transform hover:-translate-y-1 hover:scale-105
                    shadow-lg hover:shadow-xl 
                    text-lg
                  `}
                >
                  <span className="mr-2">Enroll Now</span>
                  <ChevronRight className="h-5 w-5 animate-bounce" />
                </Link>
              )}
            </div>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`mumkinMedh text-2xl md:text-3xl font-medium italic ${themeClasses.title} text-center lg:text-left mt-4`}
            >
              Medh Hain Toh Mumkin Hai!
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={animations.fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-full hidden lg:flex items-center" 
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl group aspect-[4/3] lg:aspect-auto">
              <div className={`absolute inset-0 bg-gradient-to-tr ${themeClasses.gradientFrom} ${themeClasses.gradientVia} ${themeClasses.gradientTo} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
              <Image
                src={mainImage}
                alt="Course Banner"
                className="w-full h-full object-cover transform transition-transform duration-700 filter saturate-[1.1]"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />

              {/* Floating Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="
                  absolute -bottom-3 -left-3 
                  bg-white/90 dark:bg-gray-800/90 
                  p-4 md:p-5
                  rounded-xl
                  shadow-xl 
                  backdrop-blur-sm 
                  group
                  transform hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-primary-500 group-hover:ring-4 transition-all duration-300">
                    <Image
                      src={studentImage}
                      alt="Student"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 48px, 56px"
                    />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
                      Next Batch Starting
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Limited Seats Available
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CourseBanner;