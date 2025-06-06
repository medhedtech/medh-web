"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, GraduationCap, Award, Users, Clock, Target, ChevronRight } from "lucide-react";
import stemImg from "@/assets/images/herobanner/Background.png";
import family from "@/assets/images/placement/medh-placement-courses.jpg";
import bgImage from "@/assets/images/herobanner/medh-hero-banner.png";
import "@/assets/css/ovalAnimation.css";
import { usePlacementForm } from "@/context/PlacementFormContext";
import PlacementFormModal from "./placement-form-modal";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlacementGauranteedBanner: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { openForm } = usePlacementForm();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats: StatItem[] = [
    {
      icon: <Users className="w-5 h-5 text-[#7ECA9D] animate-pulse" />,
      value: "100%",
      label: "Job Placement"
    },
    {
      icon: <Clock className="w-5 h-5 text-[#7ECA9D] animate-bounce" />,
      value: "18",
      label: "Months Program"
    },
    {
      icon: <Target className="w-5 h-5 text-[#7ECA9D] animate-pulse" />,
      value: "3",
      label: "Months Internship"
    }
  ];

  const features: FeatureItem[] = [
    {
      icon: <Briefcase className="w-6 h-6 text-[#7ECA9D]" />,
      title: "Job Guarantee",
      description: "100% Placement Assured"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#7ECA9D]" />,
      title: "Live Learning",
      description: "Interactive Sessions"
    },
    {
      icon: <Award className="w-6 h-6 text-[#7ECA9D]" />,
      title: "Certification",
      description: "Industry Recognized"
    }
  ];

  return (
    <>
      <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#7ECA9D]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#7ECA9D]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
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
              <div className="inline-flex items-center gap-2 bg-[#7ECA9D]/10 backdrop-blur-sm rounded-full p-1 pl-2 pr-4">
                <span className="bg-[#7ECA9D] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  YOUR CAREER PATHWAY STARTS HERE
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  Welcome to Medh's{" "}
                  <span className="text-[#7ECA9D]">Job Guaranteed Courses</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-300">
                  Transition from Learning to Earning - Guaranteed! Invest in Yourself and
                  Secure Your Dream Job Today.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
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
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:bg-white/15"
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={openForm}
                  className="inline-flex items-center px-6 py-3 bg-[#7ECA9D] text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 hover:bg-[#66b588] shadow-lg shadow-[#7ECA9D]/25"
                >
                  Let's Connect
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <Link
                  href="#certified-section"
                  className="inline-flex items-center px-6 py-3 bg-transparent text-[#7ECA9D] font-medium rounded-lg border-2 border-[#7ECA9D] hover:bg-[#7ECA9D]/10 transition-all"
                >
                  ISO CERTIFIED
                </Link>
              </div>
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
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7ECA9D]/20 via-[#7ECA9D]/10 to-transparent"></div>
                <div className="relative w-full h-[600px]">
                  <Image
                    src={family}
                    alt="Family Image"
                    fill
                    className="object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12">
                    <Image
                      src={stemImg}
                      alt="STEM Certified"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      STEM Accredited
                    </p>
                    <p className="text-xs text-gray-300">
                      Industry Recognized Program
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Slogan */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-left mt-12"
          >
            <p className="mumkinMedh text-2xl font-medium italic text-[#7ECA9D]">
              Medh Hai Toh Mumkin Hai!
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Placement Form Modal */}
      <PlacementFormModal />
    </>
  );
};

export default PlacementGauranteedBanner;