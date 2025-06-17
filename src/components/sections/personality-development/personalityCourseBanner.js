"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.jpg";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

export default function PersonalityCourseBanner() {
  const courses = [
    {
      heading: "Ready to Elevate Your Presence?",
      description:
        "Enroll in MEDH's Personality Development Course and unlock your potential for a fulfilling personal and professional life.",
      actionText: "Take Action for a Brighter Future Today!",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg, 
      buttonBgColor: "#7ECA9D", // Dynamic background color
      icon: DotIcon, // Icon to display in the button
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
          actionText={course.actionText} // Add actionText prop
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
