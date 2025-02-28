"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// import Arrow from "@/assets/images/join-educator/arrow1.png";
import Logo1 from "@/assets/images/career/logo-3.svg";
import Logo2 from "@/assets/images/career/logo-4.svg";
import Logo3 from "@/assets/images/career/logo-5.svg";
import Logo4 from "@/assets/images/career/logo-6.svg";
import Logo5 from "@/assets/images/career/logo-7.svg";
import WelcomeCareers from "./welcomeCareers";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Benefits data
const advantagesData = [
  {
    id: 1,
    icon: Logo1,
    title: "Competitive Compensation",
    description:
      "We offer competitive remuneration packages and benefits to attract and retain top talent.",
  },
  {
    id: 2,
    icon: Logo2,
    title: "Professional Development",
    description:
      "Access to professional development programs, training sessions, and career growth opportunities.",
  },
  {
    id: 3,
    icon: Logo3,
    title: "Collaborative Work Culture",
    description:
      "A supportive and inclusive work environment where teamwork and collaboration are encouraged.",
  },
];

// Earning Potential Data
const advantagesPotentialData = [
  {
    id: 1,
    icon: Logo4,
    title: "Flexible Work Arrangements",
    description:
      "Options for remote work, work-from-home, flexible hours, and a healthy work-life balance.",
  },
  {
    id: 2,
    icon: Logo5,
    title: "Health and Wellness",
    description:
      "Comprehensive health and wellness programs to support your physical and mental well-being.",
  },
];

const BenefitCard = ({ icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    className="px-2 pb-3 pt-1 text-center bg-white dark:bg-screen-dark dark:border-whitegrey rounded-3xl border border-[#0000004D] shadow-card-custom w-full transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
  >
    <Image
      src={icon}
      alt={title}
      className="mx-auto h-16 mb-2"
      width={64}
      height={64}
    />
    <h3 className="text-[15px] leading-7 font-bold text-[#252525] dark:text-white font-Open">
      {title}
    </h3>
    <p className="text-[#252525] dark:text-gray300 text-[15px] leading-7 font-normal font-Open">
      {description}
    </p>
  </motion.div>
);

const UniqueBenefits = () => {
  return (
    <section className="py-14 w-full dark:bg-screen-dark bg-white flex justify-center items-center">
      <div className="w-[92%] lg:w-[80%]">
        <WelcomeCareers />
        {/* Benefits Section */}
        <div className="text-center px-3 lg:px-50 ">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#252525] text-3xl text-center font-bold pt-9 dark:text-white"
          >
            Unique Benefits and Perks
          </motion.h2>
        </div>

        {/* Render the General Benefits */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-y-8 gap-y-5"
        >
          {advantagesData.map((advantage) => (
            <BenefitCard key={advantage.id} {...advantage} />
          ))}
        </motion.div>

        {/* Earning Potential Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {advantagesPotentialData.map((advantage) => (
            <BenefitCard key={advantage.id} {...advantage} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UniqueBenefits;
