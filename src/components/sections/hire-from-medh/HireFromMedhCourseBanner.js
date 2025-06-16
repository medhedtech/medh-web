"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Users, Briefcase, Award } from "lucide-react";
import CourseBannerImg from "@/assets/images/personality/coursebannerimg.jpg";

export default function HireFromMedhCourseBanner() {
  const features = [
    { icon: <Users className="w-5 h-5" />, text: "Access Global Talent" },
    { icon: <Briefcase className="w-5 h-5" />, text: "Industry Ready" },
    { icon: <Award className="w-5 h-5" />, text: "Certified Professionals" },
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

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
              Hire Top IT Talent for Your{" "}
              <span className="text-[#F6B335]">Business Growth</span>
            </h1>

            <p className="text-xl text-gray-300">
              Access a pool of skilled IT professionals trained in cutting-edge technologies
              and ready to drive your business forward.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F6B335]/20 flex items-center justify-center text-[#F6B335]">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button className="px-8 py-4 bg-[#F6B335] text-white rounded-lg hover:bg-[#e5a730] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#F6B335]/25 flex items-center gap-2">
                Hire Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                Learn More
              </button>
            </motion.div>
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
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F6B335]/20 via-[#F6B335]/10 to-transparent"></div>
              <Image
                src={CourseBannerImg}
                alt="Hire IT Professionals"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl transform hover:scale-105 transition-all duration-700"
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
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm py-8"
      >
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 max-w-3xl mx-auto">
            We are committed to connecting businesses with exceptional IT talent,
            ensuring seamless integration and sustainable growth.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
