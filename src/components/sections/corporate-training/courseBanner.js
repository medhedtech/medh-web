"use client";
import React from 'react'
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg"

function CourceBanner() {
    const courses = [
        {
          heading: "Let’s collaborate and discuss your",
          headings:"training needs.",
          description:
            "Embark on a transformative journey towards success and unparalleled growth.",
          buttonText: "Let’s Connect",
          imageUrl: CourseBannerImg, 
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
        />
      ))}
    </div>
  )
}

export default CourceBanner
