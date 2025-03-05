"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Rocket, Users, Brain, Heart } from "lucide-react";
import Logo1 from "@/assets/images/career/logo-3.svg";
import Logo2 from "@/assets/images/career/logo-4.svg";
import Logo3 from "@/assets/images/career/logo-5.svg";
import Logo4 from "@/assets/images/career/logo-6.svg";
import Logo5 from "@/assets/images/career/logo-7.svg";
import WelcomeCareers from "./welcomeCareers";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Benefits data with Lucide icons
const advantagesData = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8" />,
    logo: Logo1,
    title: "Competitive Compensation",
    description:
      "We offer competitive remuneration packages and benefits to attract and retain top talent.",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    logo: Logo2,
    title: "Professional Development",
    description:
      "Access to professional development programs, training sessions, and career growth opportunities.",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    logo: Logo3,
    title: "Collaborative Work Culture",
    description:
      "A supportive and inclusive work environment where teamwork and collaboration are encouraged.",
    color: "from-green-500/20 to-green-500/5"
  },
];

const advantagesPotentialData = [
  {
    id: 1,
    icon: <Rocket className="w-8 h-8" />,
    logo: Logo4,
    title: "Flexible Work Arrangements",
    description:
      "Options for remote work, work-from-home, flexible hours, and a healthy work-life balance.",
    color: "from-orange-500/20 to-orange-500/5"
  },
  {
    id: 2,
    icon: <Heart className="w-8 h-8" />,
    logo: Logo5,
    title: "Health and Wellness",
    description:
      "Comprehensive health and wellness programs to support your physical and mental well-being.",
    color: "from-red-500/20 to-red-500/5"
  },
];

const BenefitCard = ({ icon, logo, title, description, color }) => (
  <motion.div
    variants={itemVariants}
    className="relative overflow-hidden group"
  >
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/50`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-white/90 dark:bg-gray-700 rounded-xl shadow-inner">
            <div className="text-primary-500 dark:text-primary-400">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Image
          src={logo}
          alt={title}
          className="w-24 h-24 transform rotate-12"
          width={96}
          height={96}
        />
      </div>
    </div>
  </motion.div>
);

const UniqueBenefits = () => {
  return (
    <section className="py-20 w-full bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <WelcomeCareers />
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
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
            {advantagesData.map((advantage) => (
              <BenefitCard key={advantage.id} {...advantage} />
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantagesPotentialData.map((advantage) => (
              <BenefitCard key={advantage.id} {...advantage} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueBenefits;
