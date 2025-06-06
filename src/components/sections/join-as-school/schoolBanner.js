"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, School, Trophy, Users, BookOpen } from "lucide-react";
import Banner from "@/assets/Header-Images/Join-as-school/school.png";
import Cource from "@/assets/Header-Images/Join-as-school/academy-certification-curriculum-school-icon.jpg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

const SchoolBanner = () => {

  const features = [
    "Comprehensive Digital Learning Solutions",
    "Personalized Learning Paths",
    "Real-time Performance Analytics",
    "Expert Educational Support"
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

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  const scrollToRegistration = () => {
    const registrationSection = document.getElementById('registration-section');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden pt-12 md:pt-12">
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
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src={Iso}
                  alt="ISO Certification"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <span className="text-sm font-semibold text-primary-600">ISO CERTIFIED</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
               EMPOWER STUDENT SUCCESS COMPREHENSIVELY with <span className="text-medhgreen">MEDH</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
              Collaborative Platform to Enhance Educational Offerings and Future-Ready Skills
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-primary-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div variants={itemVariants} className="flex items-center space-x-6">
              <button 
                onClick={scrollToRegistration}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore More
              </button>
            </motion.div>
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
              src={Cource}
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

export default SchoolBanner;




