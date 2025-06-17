"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "@/assets/images/personality/coursebannerimg.jpg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

const courses = [
  {
    heading: "Ready to join our innovative team?",
    description: "Explore our current job openings and apply today.",
    buttonText: "Apply Now",
    imageUrl: CourseBannerImg,
    buttonBgColor: "#F6B335",
    icon: VerticalIcon,
  },
];

function CareerCourseBanner() {
  const router = useRouter();

  const handleEnrollClick = () => {
    // Smooth scroll to job openings section
    const jobSection = document.getElementById("enroll-section");
    if (jobSection) {
      jobSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {courses.map((course, index) => (
        <CourseBanner
          key={index}
          heading={course.heading}
          description={course.description}
          buttonText={course.buttonText}
          imageUrl={course.imageUrl}
          onButtonClick={handleEnrollClick}
          buttonBgColor={course.buttonBgColor}
          icon={course.icon}
          priority={true}
          className="transition-transform duration-300 hover:scale-105"
        />
      ))}
    </motion.div>
  );
}

export default CareerCourseBanner;
