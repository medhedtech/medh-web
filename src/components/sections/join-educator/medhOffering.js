"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Star, Clock, Rocket, Award } from "lucide-react";
import Girl from "@/assets/images/join-educator/baby-girl.svg";

const offerings = [
  {
    icon: <Star className="w-6 h-6 text-primary-600" />,
    title: "Impact lives",
    description: "Inspire and empower students to reach their full potential.",
    gradient: "from-primary-500 to-pink-500"
  },
  {
    icon: <Clock className="w-6 h-6 text-primary-600" />,
    title: "Flexibility",
    description: "Work from the comfort of your own home and set your own schedule.",
    gradient: "from-pink-500 to-primary-500"
  },
  {
    icon: <Rocket className="w-6 h-6 text-primary-600" />,
    title: "Cutting-edge technology",
    description: "Utilize our advanced online teaching platform for an immersive and interactive teaching experience.",
    gradient: "from-primary-500 to-pink-500"
  },
  {
    icon: <Award className="w-6 h-6 text-primary-600" />,
    title: "Professional growth",
    description: "Access to ongoing training and development opportunities to enhance your teaching skills.",
    gradient: "from-pink-500 to-primary-500"
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
    title: "Competitive compensation",
    description: "Be rewarded for your expertise and dedication to education.",
    gradient: "from-primary-500 to-pink-500"
  },
];

const Offerings = () => {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#FFE5F0] to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-wrap items-center justify-between">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="w-full lg:w-[54%] space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Medh Offerings
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join our community and enjoy these exclusive benefits
              </p>
            </motion.div>

            <div className="space-y-6">
              {offerings.map((offering, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100 dark:border-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          {offering.icon}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                          {offering.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {offering.description}
                        </p>
                      </div>
                    </div>
                    {/* Decorative gradient line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/50 to-pink-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={imageVariants}
            className="w-full lg:w-[42%] mt-12 lg:mt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-pink-500/10 to-transparent rounded-3xl transform group-hover:scale-105 transition-transform duration-300 blur-xl" />
              <Image
                src={Girl}
                alt="Educational Illustration"
                className="w-full h-[435px] object-contain rounded-3xl transform hover:scale-105 transition-all duration-700"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Offerings;
