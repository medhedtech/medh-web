"use client";
import React from 'react';
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg"

function BannerNewsCourse() {
    const courses = [
        {
          heading: "Stay connected with MEDH as we continue to pioneer advancements in EdTech and skill development.",
          description:
            "Together, we can create a brighter future through the power of education.",
          buttonText: "Let’s Connect",
          imageUrl: CourseBannerImg, 
          buttonBgColor: "#F6B335", // Dynamic background color
          icon: VerticalIcon, // Icon to display in the button
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
          buttonBgColor={course.buttonBgColor} // Pass dynamic button color
          icon={course.icon} // Pass icon for button
        />
      ))}
    </div>
  );
}

export default BannerNewsCourse;
