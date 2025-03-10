"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaLaptopCode,
  FaHandsHelping,
  FaBriefcase,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const WorkProcessPlacement = () => {
  const processSteps = [
    {
      title: "Enroll in a Course",
      description:
        "Select from our extensive array of job-oriented courses tailored to match your career goals and aspirations.",
      icon: <FaBookOpen className="text-4xl lg:text-5xl" />,
      arrow: true,
    },
    {
      title: "Complete the Program",
      description:
        "Participate in dynamic lessons, hands-on projects, and thorough assessments designed to build and refine your skills.",
      icon: <FaLaptopCode className="text-4xl lg:text-5xl" />,
      arrow: true,
    },
    {
      title: "Receive Career Support",
      description:
        "Leverage our dedicated career services team for assistance with job applications, interview preparation, and more.",
      icon: <FaHandsHelping className="text-4xl lg:text-5xl" />,
      arrow: true,
    },
    {
      title: "Corporate Internships",
      description:
        "Ensuring you are well-prepared for full-time employment upon completing the program.",
      icon: <FaBriefcase className="text-4xl lg:text-5xl" />,
      arrow: true,
    },
    {
      title: "Secure Your Job",
      description:
        "Successfully complete the course and benefit from our guarantee of job placement in a relevant role.",
      icon: <FaCheckCircle className="text-4xl lg:text-5xl" />,
      arrow: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#7ECA9D]/20 to-white dark:from-[#7ECA9D]/10 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow our proven pathway to success with our comprehensive program structure
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#7ECA9D] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="mb-6 w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#7ECA9D] transition-transform duration-300 group-hover:rotate-12">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection Arrow */}
                {step.arrow && (
                  <div className="hidden lg:block absolute top-20 -right-4 w-8 text-[#7ECA9D] transform translate-x-full">
                    <FaArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="bg-[#7ECA9D] text-white px-8 py-3 rounded-lg hover:bg-[#66b588] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#7ECA9D]/25">
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkProcessPlacement;
