"use client";
import React from 'react'
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";

import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

function CareerCourceBanner() {
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

  const handleEnrollClick = (course) => {
    alert(`You clicked to enroll in: ${course.heading}`);
  };

return (
<div>
  {courses.map((course, index) => (
    <CourseBanner
      key={index}
      heading={course.heading}
      description={course.description}
      buttonText={course.buttonText}
      imageUrl={course.imageUrl}
      onButtonClick={() => handleEnrollClick(course)}
      buttonBgColor={course.buttonBgColor} 
      icon={course.icon} 
    />
  ))}
</div>
);
}

export default CareerCourceBanner
