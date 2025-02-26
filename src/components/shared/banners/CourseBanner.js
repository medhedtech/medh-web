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
    <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${themeClasses.backgroundPrimary} rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${themeClasses.backgroundSecondary} rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4`}></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 ${themeClasses.badgeContainer} rounded-full p-1 pl-2 pr-4`}>
              <span className={`${themeClasses.badge} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                {badge}
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {title} <span className={themeClasses.title}>{titleHighlight}</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/enroll"
                className={`inline-flex items-center px-6 py-3 ${themeClasses.button} text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg`}
              >
                Enroll Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/course-details"
                className={`inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 ${themeClasses.secondaryButton} font-medium rounded-lg border-2 transition-all`}
              >
                View Details
              </Link>
            </div>

            {/* Slogan */}
            <p className={`text-2xl font-medium italic ${themeClasses.title}`}>
              Medh Hain Toh Mumkin Hain!
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className={`absolute inset-0 bg-gradient-to-tr ${themeClasses.gradientFrom} ${themeClasses.gradientVia} ${themeClasses.gradientTo}`}></div>
              <Image
                src={mainImage}
                alt="Course Banner"
                className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={studentImage}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
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