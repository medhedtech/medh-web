"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Shield, Award } from "lucide-react";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.jpg";

export default function PlacementCourseBanner() {
  const router = useRouter();

  const handleEnrollClick = () => {
    router.push("/contact-us");
  };

  const features = [
    { icon: <Star className="w-5 h-5" />, text: "Industry Recognition" },
    { icon: <Shield className="w-5 h-5" />, text: "100% Job Guarantee" },
    { icon: <Award className="w-5 h-5" />, text: "Certified Program" },
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Embark on the pathway to{" "}
              <span className="text-[#7ECA9D]">professional success</span>
            </h1>
            
            <p className="text-xl text-gray-300">
              Invest in your future and unlock limitless opportunities with our comprehensive placement programs.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-[#7ECA9D]/20 flex items-center justify-center text-[#7ECA9D]">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnrollClick}
              className="bg-[#7ECA9D] text-white px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-[#66b588] transition-colors shadow-lg shadow-[#7ECA9D]/25"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7ECA9D]/20 via-[#7ECA9D]/10 to-transparent"></div>
              <Image
                src={CourseBannerImg}
                alt="Course Banner"
                className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-900 py-8"
      >
        <div className="container mx-auto px-4">
          <p className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-300 text-lg">
            'Medh-Job-Assurance' is grounded in a transparent and ethical framework, 
            ensuring learners fully comprehend the program's commitments and expectations.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
