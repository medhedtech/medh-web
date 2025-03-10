"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Globe, Users, MessageSquare } from "lucide-react";

const TechEducator = () => {
  const criteriaData = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-600" />,
      title: "Enthusiastic Educators",
      description: "with a strong passion for teaching and helping students succeed.",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-600" />,
      title: "Subject Matter Experts",
      description: "who can teach a wide range of professional courses in specialized skills.",
      gradient: "from-secondary-500 to-primary-500"
    },
    {
      icon: <Globe className="w-6 h-6 text-primary-600" />,
      title: "Committed to Excellence",
      description: "creating a positive and supportive learning environment worldwide.",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary-600" />,
      title: "Excellent Skills",
      description: "to engage and connect with students globally in Online Learning Environments.",
      gradient: "from-secondary-500 to-primary-500"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Empower minds and ignite change by joining{" "}
            <span className="text-primary-600">MEDH</span> as an influential
            educator / instructor
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Experience the freedom to innovate and teach with passion, while receiving rewarding compensation.
          </p>
          <div className="mt-6">
            <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              Become a part of MEDH&#39;s innovative learning community. We are looking for:
            </p>
          </div>
        </motion.div>

        {/* Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {criteriaData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 blur-xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/50 to-secondary-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <a
            href="#join-now"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:from-primary-700 hover:to-secondary-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            <Users className="w-5 h-5 mr-2" />
            Join Our Teaching Community
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechEducator;
