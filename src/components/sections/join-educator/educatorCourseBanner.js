"use client";
import React from 'react';
import { motion } from "framer-motion";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "@/assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";

function EducatorCourseBanner() {
  const bannerData = {
    heading: "Become An Educator in our cutting-edge Edtech Company",
    subHeading: "and be a part of the future of education!",
    description: "Join our innovative platform and shape the future of learning",
    buttonText: "Let's Connect",
    imageUrl: CourseBannerImg,
    buttonBgColor: "#F6B335",
    icon: DotIcon,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <CourseBanner {...bannerData} />
      </motion.div>
    </section>
  );
}

export default EducatorCourseBanner;
