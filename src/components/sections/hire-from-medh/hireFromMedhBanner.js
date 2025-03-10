'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Target, Award, Briefcase, Brain, Database } from 'lucide-react';
import Banner from "@/assets/Header-Images/Hire-From-Medh/medh.png";
import Cource from "@/assets/Header-Images/Hire-From-Medh/group-three-modern-architects.jpg";
import Iso from "@/assets/images/hireformmedh/iso.svg";

function HireFromMedhBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500 animate-pulse" />,
      value: "500+",
      label: "Skilled Professionals"
    },
    {
      icon: <Target className="w-5 h-5 text-green-500 animate-bounce" />,
      value: "98%",
      label: "Placement Rate"
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-500 animate-pulse" />,
      value: "100+",
      label: "Partner Companies"
    }
  ];

  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-blue-500 transform hover:rotate-180 transition-transform duration-500" />,
      title: "Global Talent Pool",
      description: "Access worldwide expertise"
    },
    {
      icon: <Brain className="w-6 h-6 text-green-500 hover:scale-110 transition-transform duration-300" />,
      title: "AI & Data Science",
      description: "Specialized skills"
    },
    {
      icon: <Database className="w-6 h-6 text-yellow-500 hover:scale-110 transition-transform duration-300" />,
      title: "Digital Marketing",
      description: "Analytics experts"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-950/50 dark:to-gray-900/50"
    >
      <section className="relative min-h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={Banner}
            alt="Background"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
              >
                <span className="text-blue-500 font-semibold">EXPLORE YOUR IDEAL TALENT MATCHES!</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white space-y-3"
              >
                Efficient Recruitment,
                <span className="block text-blue-500">Access to Global Talent Pool</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300"
              >
                Recruit top IT professionals in areas including AI, Data Science, Digital Marketing, Analytics, Cybersecurity, and more.
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Features */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6"
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-3">{feature.icon}</div>
                    <h3 className="text-center text-gray-900 dark:text-white font-semibold">{feature.title}</h3>
                    <p className="text-center text-gray-500 text-sm">{feature.description}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.button
                variants={fadeInUp}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25"
              >
                Let's Connect
              </motion.button>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src={Cource}
                  alt="Hire From Medh"
                  fill
                  className="object-cover rounded-2xl transform hover:scale-105 transition-all duration-700"
                />
                {/* ISO Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                  <Image
                    src={Iso}
                    alt="ISO Certified"
                    width={60}
                    height={60}
                    className="w-12 h-12"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Slogan */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <h2 className="mumkinMedh text-2xl text-blue-500 dark:text-blue-400 font-medium italic">
              Medh Hain Toh Mumkin Hain!
            </h2>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default HireFromMedhBanner;
