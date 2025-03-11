"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "@/assets/css/ovalAnimation.css";
import { ArrowRight, ChevronRight, Award, Users, Target, Book, GraduationCap, FileCheck } from "lucide-react";

export default function AboutBanner({
  bannerImage,
  logoImage,
  isoImage,
  heading,
  subheading,
  description,
  buttonText,
  isoText,
  slogan,
  buttonImage,
  headingColor = "text-blue-500",
  descriptionColor = "text-gray-300",
  isoTextColor = "text-blue-500",
  subheadingColor = "text-blue-500",
  stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500 animate-pulse" />,
      value: "5000+",
      label: "Students Enrolled"
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-500 animate-bounce" />,
      value: "99%",
      label: "Success Rate"
    },
    {
      icon: <Target className="w-5 h-5 text-green-500 animate-pulse" />,
      value: "24/7",
      label: "Support Available"
    }
  ],
  features = [
    {
      icon: <Book className="w-6 h-6 text-blue-500 transform hover:rotate-180 transition-transform duration-500" />,
      title: "Expert Curriculum",
      description: "Industry-aligned courses"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-green-500 hover:scale-110 transition-transform duration-300" />,
      title: "Certified Learning",
      description: "Recognized credentials"
    },
    {
      icon: <FileCheck className="w-6 h-6 text-yellow-500 hover:scale-110 transition-transform duration-300" />,
      title: "Job Assistance",
      description: "Career support"
    }
  ]
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleScrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Split heading into two parts if it contains a comma
  const headingParts = heading ? heading.split(',') : ['', ''];
  const mainHeading = headingParts[0] || heading;
  const subHeading = headingParts.length > 1 ? headingParts[1] : '';

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
            src={bannerImage}
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
                <span className="text-blue-500 font-semibold" style={{ color: subheadingColor }}>
                  {subheading}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white space-y-3"
              >
                {mainHeading}
                <span className="block text-blue-500" style={{ color: headingColor }}>
                  {subHeading}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300"
                style={{ color: descriptionColor }}
              >
                {description}
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

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-6">
                <Link href="#enroll-section" passHref>
                  <motion.button
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScrollToSection}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                  >
                    {buttonImage && (
                      <Image
                        src={buttonImage}
                        alt="Button Icon"
                        width={24}
                        height={24}
                        className="mr-2 inline"
                      />
                    )}
                    {buttonText}
                  </motion.button>
                </Link>
                <Link href="#courses-section" passHref>
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center hover:text-blue-400 transition-colors cursor-pointer"
                    style={{ color: isoTextColor }}
                  >
                    {isoText}
                    <ChevronRight size={18} className="ml-1" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src={logoImage}
                  alt="Featured Image"
                  fill
                  className="object-cover rounded-2xl transform hover:scale-105 transition-all duration-700"
                  priority
                />
                {/* ISO Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                  <Image
                    src={isoImage}
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
              {slogan}
            </h2>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
