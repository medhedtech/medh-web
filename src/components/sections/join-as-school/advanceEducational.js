"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import EducationalFeatureCard from "./educationalFeatureCard";

const skillsList = [
  "Promotes independence",
  "Enhances creativity and encourages teamwork",
  "Develops students' social skills",
  "Improves their communication skills",
  "Makes them fast learners",
  "Ways to prepare students for the workforce of the future"
];

function AdvanceEducational() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
    <>
      <section className="py-20 w-full bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="container mx-auto px-4 max-w-5xl"
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center space-y-6 mb-12"
          >
            <div className="inline-flex items-center justify-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Future-Ready Education</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Creating future-ready students through
              <span className="text-primary-600"> advanced educational </span>
              approaches
            </h2>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Gone are the days when education was limited to the pages of a
                book and students memorised information solely to pass an
                examination. Educators are pushing the envelope and helping
                students possess skills that go beyond jobs and technology – and
                will last them a lifetime. Here are some of the reasons why
                skill-based learning has become imperative in schools/institutes:
              </p>
            </div>

            {/* Skills Grid */}
            <motion.div 
              variants={containerVariants}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {skillsList.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 group hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <EducationalFeatureCard />
    </>
  );
}

export default AdvanceEducational;
