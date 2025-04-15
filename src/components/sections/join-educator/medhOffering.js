"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Star, Clock, Rocket, Award, ArrowRight, Zap } from "lucide-react";
import Girl from "@/assets/images/join-educator/baby-girl.svg";

const offerings = [
  {
    icon: <Star className="w-6 h-6 text-primary-600" />,
    title: "Transform Lives",
    description: "Create lasting impact by empowering students to achieve their academic and career aspirations.",
    gradient: "from-primary-500 to-pink-500"
  },
  {
    icon: <Clock className="w-6 h-6 text-primary-600" />,
    title: "Work-Life Balance",
    description: "Enjoy location independence with flexible scheduling that adapts to your lifestyle needs.",
    gradient: "from-pink-500 to-primary-500"
  },
  {
    icon: <Rocket className="w-6 h-6 text-primary-600" />,
    title: "Innovative Platform",
    description: "Leverage our AI-enhanced teaching tools and interactive features for engaging, effective instruction.",
    gradient: "from-primary-500 to-pink-500"
  },
  {
    icon: <Award className="w-6 h-6 text-primary-600" />,
    title: "Career Development",
    description: "Access exclusive professional development resources and a supportive mentor community.",
    gradient: "from-pink-500 to-primary-500"
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
    title: "Premium Compensation",
    description: "Earn industry-leading pay rates that truly value your expertise and teaching excellence.",
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
    <section className="relative bg-gradient-to-b from-[#FFE5F0] to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="w-full lg:w-[54%] space-y-10"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center px-4 py-2 bg-pink-50 dark:bg-pink-900/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Educator Benefits</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                Why{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-pink-600">
                  exceptional educators
                </span>{" "}
                choose Medh
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Join our vibrant community of educators and unlock these exclusive advantages designed to support your teaching journey and career growth.
              </p>
            </motion.div>

            <div className="space-y-5">
              {offerings.map((offering, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  <div className="relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100/50 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-start space-x-5">
                      <div className="flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${offering.gradient} p-0.5 transform group-hover:scale-110 transition-transform duration-300`}>
                          <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                            {offering.icon}
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                          {offering.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {offering.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative gradient line */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500/50 to-pink-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                    
                    {/* Subtle hover indicator */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-5 h-5 text-primary-500" />
                    </div>
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
            className="w-full lg:w-[42%] mt-16 lg:mt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 via-pink-500/20 to-transparent rounded-3xl transform rotate-3 blur-2xl" />
              <div className="absolute -inset-4 bg-gradient-to-bl from-pink-500/10 via-primary-500/5 to-transparent rounded-3xl transform -rotate-3 blur-xl" />
              <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-6 rounded-3xl border border-pink-100/50 dark:border-gray-700 shadow-xl">
                <Image
                  src={Girl}
                  alt="Educational Illustration"
                  className="w-full h-[450px] object-contain transform hover:scale-105 transition-all duration-700"
                  priority
                />
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border border-pink-100 dark:border-gray-700 flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" fill="#EAB308" />
                  <span className="font-semibold">Top-Rated Platform</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border border-pink-100 dark:border-gray-700 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-semibold">Community Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Offerings;
