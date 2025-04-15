"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Globe, Users, MessageSquare, ArrowRight, Star } from "lucide-react";

const TechEducator = () => {
  const criteriaData = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-600" />,
      title: "Passionate Educators",
      description: "With a genuine enthusiasm for transforming knowledge into impactful learning experiences.",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-600" />,
      title: "Domain Specialists",
      description: "Who bring industry expertise to deliver cutting-edge professional skills training.",
      gradient: "from-secondary-500 to-primary-500"
    },
    {
      icon: <Globe className="w-6 h-6 text-primary-600" />,
      title: "Global Mindset",
      description: "Dedicated to fostering inclusive and culturally responsive educational environments.",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary-600" />,
      title: "Digital Fluency",
      description: "Mastery of online teaching tools with exceptional student engagement capabilities.",
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
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-6">
            <Star className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Join Our Faculty</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            Empower minds & ignite potential with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">MEDH</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Share your expertise on a cutting-edge platform that values educational innovation and rewards exceptional teaching. Transform lives while advancing your career.
          </p>
          
          <div className="mt-8">
            <p className="text-xl font-semibold text-primary-600 dark:text-primary-400 tracking-wide">
              We're looking for exceptional individuals who embody:
            </p>
          </div>
        </motion.div>

        {/* Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {criteriaData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl transform group-hover:scale-105 transition-transform duration-300 blur-xl opacity-20`} />
              <div className="relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5 transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {item.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500/50 to-secondary-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <a
            href="#registration-section"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300 text-lg group"
          >
            <Users className="w-5 h-5 mr-3" />
            Join Our Teaching Community
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Take the first step toward sharing your expertise with eager learners from around the world.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechEducator;
