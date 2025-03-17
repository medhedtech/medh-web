"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Shield, Rocket, Users, Brain, Heart, Star, Coffee, Globe, Sun, Gift } from "lucide-react";
import Logo1 from "@/assets/images/career/logo-3.svg";
import Logo2 from "@/assets/images/career/logo-4.svg";
import Logo3 from "@/assets/images/career/logo-5.svg";
import Logo4 from "@/assets/images/career/logo-6.svg";
import Logo5 from "@/assets/images/career/logo-7.svg";
import WelcomeCareers from "./welcomeCareers";

// Animation variants with improved timing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 1
    }
  }
};

// Enhanced benefits data with more details and icons
const advantagesData = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8" />,
    logo: Logo1,
    title: "Competitive Compensation",
    description:
      "We offer competitive remuneration packages and benefits to attract and retain top talent. This includes performance bonuses and equity options.",
    color: "from-blue-500/20 to-blue-500/5",
    highlights: ["Competitive salary", "Performance bonuses", "Equity options"]
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    logo: Logo2,
    title: "Professional Development",
    description:
      "Access to professional development programs, training sessions, and career growth opportunities. We invest in your growth and success.",
    color: "from-purple-500/20 to-purple-500/5",
    highlights: ["Training programs", "Mentorship", "Conference allowance"]
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    logo: Logo3,
    title: "Collaborative Work Culture",
    description:
      "A supportive and inclusive work environment where teamwork and collaboration are encouraged. Join a diverse team of passionate professionals.",
    color: "from-green-500/20 to-green-500/5",
    highlights: ["Inclusive environment", "Team events", "Knowledge sharing"]
  },
];

const advantagesPotentialData = [
  {
    id: 1,
    icon: <Rocket className="w-8 h-8" />,
    logo: Logo4,
    title: "Flexible Work Arrangements",
    description:
      "Options for remote work, work-from-home, flexible hours, and a healthy work-life balance. We trust you to work in ways that suit you best.",
    color: "from-orange-500/20 to-orange-500/5",
    highlights: ["Remote work options", "Flexible hours", "Work-life balance"]
  },
  {
    id: 2,
    icon: <Heart className="w-8 h-8" />,
    logo: Logo5,
    title: "Health and Wellness",
    description:
      "Comprehensive health and wellness programs to support your physical and mental well-being. Your health is our priority.",
    color: "from-red-500/20 to-red-500/5",
    highlights: ["Health insurance", "Mental wellness support", "Fitness allowance"]
  },
];

// Additional perks with icons
const additionalPerks = [
  { icon: <Coffee />, text: "Free snacks & beverages" },
  { icon: <Star />, text: "Recognition programs" },
  { icon: <Globe />, text: "Travel opportunities" },
  { icon: <Sun />, text: "Paid time off" },
  { icon: <Gift />, text: "Birthday celebrations" },
];

const BenefitCard = ({ icon, logo, title, description, color, highlights, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} backdrop-blur-sm 
        border border-white/20 dark:border-white/10
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)]
        transition-all duration-500 ease-in-out
        ${isHovered ? 'transform -translate-y-1' : ''}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <motion.div 
              className="p-3 bg-white/95 dark:bg-gray-700 rounded-xl 
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                border border-gray-100/80 dark:border-gray-600/30"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-primary-500 dark:text-primary-400">
                {icon}
              </div>
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 
              group-hover:text-primary-500 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {description}
            </p>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 
                        shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_rgba(255,255,255,0.1)]" />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div 
          className="absolute -right-8 -bottom-8 opacity-10 transition-all duration-500"
          animate={{
            opacity: isHovered ? 0.2 : 0.1,
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 15 : 12
          }}
        >
          <Image
            src={logo}
            alt={title}
            className="w-24 h-24 drop-shadow-xl"
            width={96}
            height={96}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const UniqueBenefits = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 w-full bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <WelcomeCareers />
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full 
                  shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">Join Our Team</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full 
                  shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300
              drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
              Unique Benefits and <span className="text-primary-500">Perks</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our team and enjoy a comprehensive package of benefits designed to support your growth and well-being.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Primary Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantagesData.map((advantage, index) => (
              <BenefitCard key={advantage.id} {...advantage} index={index} />
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantagesPotentialData.map((advantage, index) => (
              <BenefitCard key={advantage.id} {...advantage} index={index + advantagesData.length} />
            ))}
          </div>

          {/* Additional Perks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8
              drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
              Additional Perks
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {additionalPerks.map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full
                    border border-gray-100 dark:border-gray-700
                    shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]
                    hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]
                    transition-all duration-300"
                >
                  <div className="text-primary-500 dark:text-primary-400 drop-shadow-sm">
                    {perk.icon}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{perk.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueBenefits;
