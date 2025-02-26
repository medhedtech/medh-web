"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Newspaper, ArrowUpRight } from "lucide-react";

// Import images statically
import News1 from "@/assets/images/news-media/news-1.svg";
import News2 from "@/assets/images/news-media/news-2.svg";
import News3 from "@/assets/images/news-media/news-3.svg";
import News4 from "@/assets/images/news-media/news-4.svg";
import News5 from "@/assets/images/news-media/news-5.svg";
import NewsL1 from "@/assets/images/news-media/news-l1.svg";

// Move data outside component to prevent re-creation on each render
const latestNewsData = {
  title: "Latest News",
  newsDescription:
    "MEDH, an EdTech Platform to Offer Personalized Skill Development Learning",
  newsContent:
    "A shift in the skill development industry is created by the launch of Medh, an EdTech platform.",
  newsDate: "April 20, 2024",
  logos: [News1, News2, News3, News4, News5],
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function LatestNews() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
            News & Media
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Always making the right noise
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Welcome to MEDH, where innovation meets education, to revolutionize
            the EdTech landscape by providing personalized skill development
            courses that cater to learners of all ages.
          </p>
        </motion.div>

        {/* News Content Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - News Details */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <Newspaper className="text-red-600 dark:text-red-400" size={24} />
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {latestNewsData.title}
                </h2>
              </div>

              <div className="mb-6">
                <Image
                  src={NewsL1}
                  alt="News"
                  width={600}
                  height={400}
                  className="w-full rounded-xl shadow-md hover:shadow-xl transition-shadow"
                  priority
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {latestNewsData.newsDescription}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {latestNewsData.newsContent}
                </p>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-sm">{latestNewsData.newsDate}</span>
                  <ArrowUpRight size={16} />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Media Coverage */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                Featured In
              </h3>
              <div className="grid grid-cols-2 gap-8">
                {latestNewsData.logos.map((logo, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-center group"
                  >
                    <Image
                      src={logo}
                      alt={`Media Logo ${index + 1}`}
                      width={210}
                      height={100}
                      className="transition-transform group-hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
            We believe in the transformative power of education and are committed
            to empowering students with the skills they need to navigate and excel
            in the modern world. At MEDH, we value innovation, inclusivity, and
            excellence, and we strive to create a learning environment that is
            engaging, effective, and accessible to everyone.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
