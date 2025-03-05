"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Users, Rocket, GraduationCap } from "lucide-react";

// Import SVG logos instead of images for better performance
import Logo1 from "@/assets/images/career/logo-1.svg";
import Logo2 from "@/assets/images/career/logo-2.svg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const WelcomeCard = ({ icon: Icon, title, description }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-primary-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-primary-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="mt-4 text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </motion.div>
);

const InfoCard = ({ image, title, description, className = "" }) => (
  <motion.div
    variants={fadeInUp}
    className={`w-full px-6 py-8 bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 mb-6 relative">
        <Image
          src={image}
          alt={title}
          width={96}
          height={96}
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

const WelcomeCareers = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "We're redefining education through cutting-edge technology and innovative approaches."
    },
    {
      icon: Users,
      title: "Inclusive Culture",
      description: "Foster a diverse and collaborative environment where every voice matters."
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description: "Opportunities for professional development and skill enhancement."
    }
  ];

  return (
    <div className="mb-20">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-6 mb-16"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center bg-primary-500/10 rounded-full px-4 py-2">
          <Rocket className="w-5 h-5 text-primary-500 mr-2" />
          <span className="text-primary-500 font-medium">Join Our Mission</span>
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          Welcome to <span className="text-primary-500">MEDH</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Where we are redefining the future of education through innovation and technology. As a leading EdTech company, we are committed to providing cutting-edge skill development courses that empower learners of all ages.
        </motion.p>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        <InfoCard
          image={Logo1}
          title="Rewarding Work Environment"
          description="We believe in fostering a rewarding and fulfilling work environment that nurtures professional growth and job satisfaction. Our team is our greatest asset, and we are dedicated to creating a culture of collaboration, inclusivity, and excellence."
        />
        <InfoCard
          image={Logo2}
          title="Diverse Opportunities"
          description="We offer a diverse range of career opportunities that cater to various skill sets and professional backgrounds. Whether you are a seasoned professional or just starting your career, we have a role for you. Join us and be a part of a dynamic team."
        />
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <WelcomeCard key={index} {...feature} />
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeCareers;
