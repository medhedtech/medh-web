"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Award,
  Users,
  Target,
  Book,
  GraduationCap,
  Star,
  TrendingUp,
  BookOpen,
  Briefcase,
  Clock,
  Brain,
  Cpu,
  Database
} from "lucide-react";
import "@/assets/css/ovalAnimation.css";

export default function MainBanner({
  // Core Content Props
  bannerImage,
  logoImage,
  isoImage,
  heading,
  subheading,
  description,
<<<<<<< HEAD
  slogan = "Medh Hain Toh Mumkin Hai!",
=======
  slogan = "Medh Hai Toh Mumkin Hai!",
>>>>>>> f1430ea24f47e7db52d620ec30e11914e4a1de6e
  
  // Button Props
  primaryButtonText = "Let's Connect",
  primaryButtonLink = "#",
  secondaryButtonText = "View Details",
  secondaryButtonLink = "#",
  buttonImage,
  
  // Color Props
  headingColor = "text-primary-500",
  descriptionColor = "text-gray-600 dark:text-gray-300",
  subheadingColor = "text-primary-500",
  primaryButtonBg = "bg-primary-500",
  primaryButtonHoverBg = "hover:bg-primary-600",
  secondaryButtonBorderColor = "border-primary-500",

  
  // Features Props
  features = [
    {
      icon: <Target className="w-6 h-6 text-primary-500" />,
      title: "Expert Curriculum",
      description: "Industry-aligned courses"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary-500" />,
      title: "Live Learning",
      description: "Interactive Sessions"
    },
    {
      icon: <Award className="w-6 h-6 text-primary-500" />,
      title: "Certification",
      description: "Industry Recognized"
    }
  ],
  
  // Additional Props
  showFloatingCard = true,
  floatingCardImage,
  floatingCardTitle = "Next Batch Starting",
  floatingCardSubtitle = "Limited Seats Available",
  showStats = true,
  showFeatures = true,
  showSlogan = true,
  darkMode = false,

  // Image Decoration Props
  showAccentDecorations = true,
  topAccentIcon = <Award className="text-primary-500 w-6 h-6" />,
  bottomAccentIcon = <Briefcase className="text-primary-500 w-6 h-6" />,
  showTopFloatingElement = true,
  topFloatingIcon = <Users className="text-primary-500 w-5 h-5" />,
  topFloatingText = "Expert-led Training"
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Split heading into parts for highlighting
  const headingParts = heading ? heading.split(',') : ['', ''];
  const mainHeading = headingParts[0];
  const highlightedHeading = headingParts[1] || '';

  return (
    <section className={`relative min-h-[90vh] overflow-hidden ${
      darkMode 
        ? "bg-gradient-to-b from-gray-900 to-gray-800" 
        : "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt="Background"
            fill
            className="object-cover opacity-10"
            priority
          />
        )}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-primary-500/10 rounded-full p-1 pl-2 pr-4 backdrop-blur-sm"
            >
              <span className={`${primaryButtonBg} text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                {subheading}
              </span>
              {isoImage && (
                <Image
                  src={isoImage}
                  alt="Certification"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
            </motion.div>

            {/* Heading */}
            <motion.div
              variants={fadeInUp}
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {mainHeading}{" "}
                <span className={headingColor}>
                  {highlightedHeading}
                </span>
              </h1>
              <p className={`text-lg lg:text-xl leading-relaxed ${descriptionColor}`}>
                {description}
              </p>
            </motion.div>
            {/* Features Grid */}
            {showFeatures && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:bg-white/15 dark:hover:bg-gray-800/60"
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA Section */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={primaryButtonLink}
                className={`group relative inline-flex items-center px-8 py-4 ${primaryButtonBg} text-white rounded-xl shadow-lg shadow-primary-500/25 font-semibold text-lg transition-all duration-300 ${primaryButtonHoverBg} hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  {buttonImage && (
                    <Image
                      src={buttonImage}
                      alt="Button Icon"
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                  )}
                  {primaryButtonText}
                  <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                href={secondaryButtonLink}
                className={`group relative inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${secondaryButtonBorderColor} rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-primary-50 dark:hover:bg-gray-700/80`}
              >
                <span className="relative flex items-center text-primary-500">
                  {secondaryButtonText}
                  <ChevronRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Slogan */}
            {showSlogan && (
              <motion.div
                variants={fadeInUp}
                className="pt-8"
              >
                <h2 className="mumkinMedh text-2xl sm:text-3xl text-primary-500 dark:text-primary-400 font-medium italic relative inline-block">
                  {slogan}
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500/30 rounded-full"></span>
                </h2>
              </motion.div>
            )}
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-3xl mx-auto lg:mx-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-primary-500/10 to-transparent"></div>
              {logoImage && (
                <Image
                  src={logoImage}
                  alt="Featured Image"
                  fill
                  className="object-cover object-center rounded-2xl transform hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                  quality={90}
                />
              )}

              {/* Accent decorations */}
              {showAccentDecorations && (
                <>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg transform hover:scale-110 transition-transform">
                    {topAccentIcon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg transform hover:scale-110 transition-transform">
                    {bottomAccentIcon}
                  </div>
                </>
              )}

              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
            </div>

            {/* Floating Card */}
            {showFloatingCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500/10 to-primary-600/10">
                    {floatingCardImage ? (
                      <Image
                        src={floatingCardImage}
                        alt="Card Image"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500/10 flex items-center justify-center">
                        <GraduationCap className="text-primary-500 w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {floatingCardTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {floatingCardSubtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Additional Floating Element */}
            {showTopFloatingElement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2">
                  {topFloatingIcon}
                  <p className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {topFloatingText}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
