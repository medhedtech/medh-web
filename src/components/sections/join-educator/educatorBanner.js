"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Users, Star, BookOpen } from "lucide-react";
import EducatorHero from "@/assets/Header-Images/Educator/virtual-kindergarten-.jpg";

const EducatorBanner = () => {
  const stats = [
    { icon: <Users />, value: "500+", label: "Expert Educators" },
    { icon: <Star />, value: "4.8", label: "Educator Rating" },
    { icon: <BookOpen />, value: "100+", label: "Active Courses" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Join Our Team of Expert Educators
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Shape the future of education by becoming part of our innovative teaching platform
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Features List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {[
                "Flexible teaching schedule",
                "Competitive compensation",
                "Professional development opportunities",
                "Access to cutting-edge teaching tools"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-primary-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Join as Educator
              </button>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-pink-500/10 to-transparent rounded-3xl transform hover:scale-105 transition-transform duration-300 blur-xl" />
            <Image
              src={EducatorHero}
              alt="Educator Hero"
              className="w-full h-auto rounded-3xl transform hover:scale-105 transition-all duration-700"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EducatorBanner;




