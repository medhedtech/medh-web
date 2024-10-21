"use client";
import React from 'react'
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import Download from "@/assets/images/join-as-school/btn-logo.svg"

function SchoolCourceBanner() {
  const courses = [
    {
      heading: "To create future-ready students through upskilling.",
      buttonText: "Let’s Connect",
      imageUrl: CourseBannerImg, 
      buttonBgColor: "#F2277E", 
      icon: Download, 
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

export default SchoolCourceBanner
