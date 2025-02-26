"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Shield, BookOpen } from "lucide-react";
import Explain from "@/assets/images/about/explain.png";

const WhoWeAre = () => {
  const sections = [
    {
      title: "Who We Are?",
      icon: <Users className="w-6 h-6" />,
      content: "We are a dedicated team of technologists, entrepreneurs and visionaries who believe that education through technology is the key to shaping a brighter future. Our diverse and talented team brings together expertise from various domains to create a dynamic learning ecosystem that caters to learners of all ages and backgrounds."
    },
    {
      title: "Our Commitment to Quality",
      icon: <Shield className="w-6 h-6" />,
      content: "Quality is at the core of everything we do. We are committed to delivering content that is precise, current, and aligned with the evolving trends and needs of the educational landscape. Our team of subject matter experts ensure that the learning materials are engaging, effective, and aligned with the latest industry standards."
    },
    {
      title: "Empowering Lifelong Learning",
      icon: <BookOpen className="w-6 h-6" />,
      content: "At Medh, we believe that learning should not be limited to a specific stage of life. We are dedicated to nurturing a culture of lifelong learning, enabling individuals to continuously upskill and reskill to adapt to the ever-evolving demands of the modern world. Whether you are a student, a professional, a homemaker or someone eager to pursue your passions, our platform offers a diverse range of courses tailored to help you achieve your aspirations."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl transform rotate-3"></div>
              <Image
                src={Explain}
                alt="Who we are at Medh"
                className="relative rounded-2xl shadow-xl"
                priority
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="lg:w-1/2 space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary-500 dark:text-primary-400">
                      {section.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default WhoWeAre;
