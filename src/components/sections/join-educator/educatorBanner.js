"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Users, Star, BookOpen } from "lucide-react";
import EducatorHero from "@/assets/Header-Images/Educator/virtual-kindergarten-.jpg";

const EducatorBanner = () => {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              SHAPE LEARNING FUTURES INNOVATIVELY with <span className="text-medhgreen">MEDH</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
              Join our dynamic team of educators and shape the future of education.
              </p>
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
              <button 
                onClick={scrollToRegistration}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Join as Educator
              </button>
            </motion.div>
            {/* Enhanced Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`mumkinMedh text-xl sm:text-2xl md:text-3xl font-medium italic text-center lg:text-left mt-1 sm:mt-4`}
          >
            Medh Hain Toh Mumkin Hai!
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




