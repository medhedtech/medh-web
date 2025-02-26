"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import About1 from "@/assets/images/about/about1.png";
import About2 from "@/assets/images/about/about2.png";
import About3 from "@/assets/images/about/about3.png";
import About4 from "@/assets/images/about/about4.png";
import About5 from "@/assets/images/about/about5.png";
import About6 from "@/assets/images/about/about6.png";
import About7 from "@/assets/images/about/about7.png";
import About8 from "@/assets/images/about/about8.png";
import About9 from "@/assets/images/about/about9.png";
import Certified from "../why-medh/Certified";
import JoinUs from "@/assets/images/about/join-us.png";

const WhyChooseMEDH = () => {
  const features = [
    {
      title: "Educational Goals Alignment",
      description:
        "We align with your educational goals and objectives, providing 360-degree coverage for immersive online learning.",
      icon: About1,
    },
    {
      title: "Quality Learning Materials",
      description:
        "We assess content quality and effectiveness, ensuring up-to-date, well-structured materials that drive learning outcomes.",
      icon: About2,
    },
    {
      title: "User-Friendly Platform",
      description:
        "We have a user-friendly platform for both educators and learners, ensuring ease of use and compatibility with different devices.",
      icon: About3,
    },
    {
      title: "Data Privacy & Security",
      description:
        "Our stringent measures ensure data privacy and security, safeguarding sensitive information from unauthorized access or breaches.",
      icon: About4,
    },
    {
      title: "Personalized Learning",
      description:
        "We offer personalized learning experiences that cater to individual students' needs and adapt to their progress.",
      icon: About5,
    },
    {
      title: "Continuously Updated",
      description:
        "Continuously updating to meet evolving educational needs, we ensure learners receive the best and most relevant experiences.",
      icon: About6,
    },
    {
      title: "Industry-Relevant Courses",
      description:
        "Our courses, developed with industry experts, stay relevant and practical, guaranteeing valuable content delivery.",
      icon: About7,
    },
    {
      title: "Practical Skills Focus",
      description:
        "Our courses emphasize practical, job-relevant skills designed to boost your professional competitiveness.",
      icon: About8,
    },
    {
      title: "Certification Upon Completion",
      description:
        "Upon course completion, we provide certifications to enhance your resume and validate newly acquired skills.",
      icon: About9,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-primary-500/10 via-secondary-500/10 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Why Choose <span className="text-primary-500 dark:text-primary-400">MEDH</span>?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Empowering learners with the freedom to explore and excel in
            fundamental concepts, we strive to provide a global EdTech platform
            to shape aspirations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certification Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Certified />
        </motion.div>

        {/* Join Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#4EB67870] to-[#4EB67840] rounded-3xl p-8 mt-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-shrink-0">
              <Image
                src={JoinUs}
                alt="Join us"
                width={160}
                height={180}
                className="transform hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Join us at Medh to craft a brighter future.
              </h3>
              <p className="text-gray-700 dark:text-gray-200 text-lg mb-6">
                Contact us to learn more or explore our platform to experience the
                power of transformative education firsthand.
              </p>
            </div>

            <Link href="/contact-us">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#F6B335] hover:bg-[#e5a52f] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
              >
                <span className="font-bold">Let's Connect</span>
                <ArrowDown className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg max-w-3xl mx-auto">
            Join us in our mission to redefine education and create a brighter
            future for learners worldwide. Together, we can unlock the limitless
            potential that lies within each of us.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseMEDH;
