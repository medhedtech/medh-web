"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaHourglass,
  FaIndustry,
  FaBriefcase,
  FaUserTie,
  FaHandsHelping,
  FaChevronRight,
} from "react-icons/fa";

// Earning Potential Data
const earningPotentialData = [
  {
    icon: <FaHourglass className="text-5xl" />,
    title: "Job Assurance",
    description:
      "Providing learners with the confidence that their investment in skill development will yield tangible results in the form of employment opportunities.",
  },
  {
    icon: <FaIndustry className="text-5xl" />,
    title: "Industry-Relevant Skills",
    description:
      "The curriculum is designed to align with industry standards, ensuring that graduates possess the skills and knowledge sought after by employers.",
  },
  {
    icon: <FaBriefcase className="text-5xl" />,
    title: "Professional Development",
    description:
      "In addition to technical skills, our programs focus on soft skills development, enhancing communication, teamwork, and leadership abilities.",
  },
  {
    icon: <FaUserTie className="text-5xl" />,
    title: "Career Support",
    description:
      "Our career services team provides guidance, mentorship, and placement assistance to ensure that learners transition seamlessly into the workforce.",
  },
];

const PlacementBenefits = () => {
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
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose{" "}
            <span className="text-emerald-700 dark:text-emerald-400">Medh-Placement-Assurance</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Embark on an exhilarating journey of knowledge sharing, empowerment,
            and personal growth as an educator with Medh EdTech.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {earningPotentialData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7ECA9D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 w-16 h-16 rounded-lg bg-[#7ECA9D]/10 flex items-center justify-center text-[#7ECA9D] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#7ECA9D] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaChevronRight className="text-[#7ECA9D] text-xl animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Benefit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#7ECA9D]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#7ECA9D]/20">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-6">
                <FaHandsHelping className="text-[#7ECA9D] text-4xl" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Practical Experience Through Corporate Internships
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                By engaging in hands-on projects, industry simulations, and
                corporate internships, learners acquire practical experience,
                ensuring they are well-prepared for full-time corporate
                employment upon program completion.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="bg-[#7ECA9D] text-white px-8 py-3 rounded-lg hover:bg-[#66b588] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#7ECA9D]/25">
            Start Your Career Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PlacementBenefits;
