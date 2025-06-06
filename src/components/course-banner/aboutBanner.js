import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "@/assets/css/ovalAnimation.css";
import { ArrowRight, ChevronRight, Award, Users, Target, Book, GraduationCap, FileCheck, Building, Star, TrendingUp, BookOpen } from "lucide-react";

export default function AboutBanner({
  bannerImage,
  logoImage,
  isoImage,
  heading,
  subheading,
  description,
  buttonText = "Let's Connect",
  secondaryButtonText = "View Courses",
  isoText = "ISO Certified",
  slogan = "Medh Hai Toh Mumkin Hai!",
  buttonImage,
  headingColor = "text-primary-500",
  descriptionColor = "text-gray-600 dark:text-gray-300",
  isoTextColor = "text-primary-500",
  subheadingColor = "text-primary-500",
  stats = [
    {
      icon: <Building className="w-5 h-5 text-primary-500" />,
      value: "5000+",
      label: "Students Enrolled"
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      value: "4.8/5",
      label: "Course Rating"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
      value: "95%",
      label: "Placement Rate"
    }
  ],
  features = [
    {
      icon: <Target className="w-6 h-6 text-primary-500" />,
      title: "Expert Curriculum",
      description: "Industry-aligned courses"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-500" />,
      title: "Certified Learning",
      description: "Recognized credentials"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-500" />,
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
    <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
        {bannerImage && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={bannerImage}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-gray-800/20 to-transparent" />
          </div>
        )}
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
            <div className="inline-flex items-center gap-2 bg-primary-500/10 rounded-full p-1 pl-2 pr-4">
              <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {isoText}
              </span>
              {isoImage && (
                <Image src={isoImage} alt="ISO Certification" className="h-6 w-auto" />
              )}
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {mainHeading}{" "}
                <span className={headingColor}>
                  {subHeading}
                </span>
              </h1>
              <p className="text-lg lg:text-xl" style={{ color: descriptionColor }}>
                {description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
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

            {/* CTA Section */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="#enroll-section"
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/25"
                onClick={handleScrollToSection}
              >
                {buttonText}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#courses-section"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-primary-500 font-medium rounded-lg border-2 border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all"
              >
                {secondaryButtonText}
              </Link>
            </div>

            {/* Slogan */}
            <p className="mumkinMedh text-2xl text-primary-500 font-medium italic">
              {slogan}
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent"></div>
              {logoImage && (
                <Image
                  src={logoImage}
                  alt="Featured Image"
                  className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
                  priority
                />
              )}

              {/* Accent decorations */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Award className="text-primary-500 w-6 h-6" />
              </div>
              <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <GraduationCap className="text-primary-500 w-6 h-6" />
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-500/10 flex items-center justify-center">
                  <GraduationCap className="text-primary-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Certified Courses
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Industry Recognized
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Additional Floating Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Users className="text-primary-500 w-5 h-5" />
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  Expert-led Training
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
