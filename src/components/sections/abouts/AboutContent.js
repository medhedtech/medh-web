"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, CheckCircle, Lightbulb, Target, Users } from "lucide-react";
import Bell from "@/assets/images/about/bell.png";

const AboutContent = () => {
  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovative Learning",
      description: "Cutting-edge technology and modern teaching methodologies"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Growth",
      description: "Tailored learning paths for every stage of life"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Mentorship",
      description: "Guidance from industry-leading professionals"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-primary-500/10 rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/20 via-secondary-500/20 to-primary-500/10 rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
            About Medh
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
              Pioneering Skill Development
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
              for every stage of life
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed"
          >
            MEDH, the leading global EdTech innovator, is dedicated to delivering
            skill development courses through cutting-edge technology and bespoke
            mentorship. We empower individuals at every stage of life, from early
            childhood and adolescence to working professionals and homemakers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-primary-600 dark:text-primary-400 font-semibold text-lg"
          >
            We nurture growth, foster expertise, and ignite potential for learners
            of every background.
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* UPD Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#4EB67870] to-[#4EB67840] dark:from-gray-800 dark:to-gray-800/50 rounded-3xl p-8 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
              <Image
                src={Bell}
                alt="bell icon"
                width={90}
                height={90}
                className="relative z-10"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
                Medh - Unique Point of Difference (UPD)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our commitment to providing a seamless gamut of skill development
                courses, creating tailored learning pathways that accommodate every
                phase of a child's developmental journey, from early childhood
                to professional readiness. This holistic approach ensures that
                individuals are fully equipped for success at every stage of life.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutContent;
