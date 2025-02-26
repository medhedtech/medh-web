"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Lightbulb, RefreshCw } from "lucide-react";
import AboutRight from "@/assets/images/about/AboutRight.png";

const AtMedh = () => {
  const beliefs = [
    {
      text: "are passionate about transforming education and empowering learners across the world."
    },
    {
      text: "believe that learning should be a fun and engaging experience through a perfect amalgamation of technology and pedagogy."
    },
    {
      text: "leverage cutting-edge technology and data-driven insights to design and deliver a wide range of educational solutions."
    }
  ];

  return (
    <section className="relative py-16 dark:bg-screen-dark overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-white mb-12 text-center"
        >
          At <span className="text-primary-500 dark:text-primary-400">Medh,</span> we
        </motion.h2>

        {/* Beliefs and Image Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          {/* Beliefs List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-3/5"
          >
            <div className="space-y-6">
              {beliefs.map((belief, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 mt-1">
                    <CheckCircle className="w-6 h-6 text-primary-500 dark:text-primary-400 transform group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {belief.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl transform rotate-3"></div>
            <Image
              src={AboutRight}
              alt="About Medh"
              className="relative rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>

        {/* Vision and Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  MEDH – VISION
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aspires to lead the EdTech industry by offering skill development
                  solutions that empower individuals at every stage of life, from
                  early childhood to career and homemaking readiness.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  MEDH – MISSION
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our mission is to empower individuals of all ages through
                  innovative and personalized skill development courses, offering
                  future-ready curriculum, interactive learning, AI-based
                  technology, industry-aligned certifications, and community
                  engagement. We prioritize excellence and innovation through
                  collaborations with seasoned educators and subject matter experts
                  from the relevant industry to foster personal and professional
                  growth.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AtMedh;
