"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Info, Star, Users, BookOpen } from "lucide-react";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";

function CourceBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Expert-Led Training",
      description: "Learn from industry professionals with proven expertise"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customized Programs",
      description: "Tailored solutions for your organization's unique needs"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Flexible Learning",
      description: "Choose from various learning formats that suit your team"
    }
  ];

  const courses = [
    {
      heading: "Let's collaborate and discuss your",
      headings: "training needs.",
      description: "Embark on a transformative journey towards success and unparalleled growth.",
      buttonText: "Let's Connect",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#7ECA9D",
      buttonTextColor: "white",
      icon: DotIcon,
      stats: [
        { label: "Success Rate", value: "95%" },
        { label: "Expert Trainers", value: "50+" },
        { label: "Companies Served", value: "200+" }
      ]
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-primary-500/10 rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/20 via-secondary-500/20 to-primary-500/10 rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
              Corporate Training Solutions
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
                Transform Your Team's
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                Potential
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Empower your workforce with cutting-edge skills and knowledge through our comprehensive corporate training programs.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/corporate-training/contact")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              >
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/contact")}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-primary-500 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Info size={18} className="mr-2" />
                Learn More
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {courses[0].stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl transform rotate-3"></div>
            <Image
              src={CourseBannerImg}
              alt="Corporate Training"
              className="relative rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to elevate your team's capabilities? Let's create a customized training program that meets your specific needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/corporate-training/contact")}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
          >
            Start Your Journey
            <ArrowRight size={20} className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default CourceBanner;
