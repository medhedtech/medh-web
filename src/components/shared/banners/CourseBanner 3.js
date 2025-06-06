'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

function CourseBanner({
  badge,
  title,
  titleHighlight,
  description,
  stats,
  features,
  mainImage,
  studentImage,
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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${themeClasses.backgroundPrimary} rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${themeClasses.backgroundSecondary} rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4`}></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 ${themeClasses.badgeContainer} rounded-full p-1 pl-2 pr-4`}>
              <span className={`${themeClasses.badge} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                {badge}
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {title} <span className={themeClasses.title}>{titleHighlight}</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-2"
                >
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-2">{feature.icon}</div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/enroll"
                className={`inline-flex items-center px-5 py-2.5 ${themeClasses.button} text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg`}
              >
                Enroll Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/course-details"
                className={`inline-flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 ${themeClasses.secondaryButton} font-medium rounded-lg border-2 transition-all`}
              >
                View Details
              </Link>
            </div>

            {/* Slogan */}
            <p className={`mumkinMedh text-xl lg:text-2xl font-medium italic ${themeClasses.title}`}>
              Medh Hai Toh Mumkin Hai!
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-6 lg:mt-0"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-tr ${themeClasses.gradientFrom} ${themeClasses.gradientVia} ${themeClasses.gradientTo}`}></div>
              <Image
                src={mainImage}
                alt="Course Banner"
                className="w-full h-auto rounded-xl transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={studentImage}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Next Batch Starting
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Limited Seats Available
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CourseBanner; 