"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Target, Sparkles, ChevronRight, Star, Users, Award, Presentation } from "lucide-react";
import Banner from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import DevelopmentImg from "@/assets/Header-Images/Personality-Development/multiracial-teenage-high-school-students-looking-a-2023-11-27-05-15-38-utc.jpg";

function PersonalityBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-primary-500" />,
      value: "5000+",
      label: "Transformed Lives"
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      value: "4.9/5",
      label: "Student Rating"
    },
    {
      icon: <Award className="w-5 h-5 text-primary-500" />,
      value: "12+",
      label: "Years Experience"
    }
  ];

  const features = [
    {
      icon: <UserPlus className="w-6 h-6 text-primary-500" />,
      title: "Self Development",
      description: "Build confidence & charisma"
    },
    {
      icon: <Target className="w-6 h-6 text-primary-500" />,
      title: "Goal Setting",
      description: "Achieve personal milestones"
    },
    {
      icon: <Presentation className="w-6 h-6 text-primary-500" />,
      title: "Communication",
      description: "Master public speaking"
    }
  ];

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
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
            <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full p-1 pl-2 pr-4">
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                All Ages Welcome
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Comprehensive <span className="text-blue-500">Personality Development Course</span> 
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
                Uncover Your Untapped Potential. Perfect for Students, Professionals, and Homemakers. Unleash Your Best Self.
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
                href="/enrollment/personality-development"
                className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
              >
                Enroll Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/course-details"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-500 font-medium rounded-lg border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
              >
                View Details
              </Link>
            </div>

            {/* Slogan */}
            <p className="mumkinMedh text-2xl text-blue-500 font-medium italic">
              Medh Hai Toh Mumkin Hai!
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
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
              <Image
                src={Banner}
                alt="Personality Development Course"
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
                    src={DevelopmentImg}
                    alt="Student Success"
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

export default PersonalityBanner;
