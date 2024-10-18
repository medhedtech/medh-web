"use client";
import React from 'react'
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg"

function EducatorCourceBanner() {
  const courses = [
    {
      heading: "Become An Educator in our cutting-edge Edtech Company and be a part of the future of education!",
      headings: "training needs.",
      buttonText: "Let’s Connect",
      imageUrl: CourseBannerImg, 
      buttonBgColor: "#F2277E", 
      icon: DotIcon, 
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
      headings={course.headings}
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

export default EducatorCourceBanner
