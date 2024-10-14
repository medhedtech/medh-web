"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";

export default function PersonalityCourseBanner() {
  const courses = [
    {
      heading: "Ready to Elevate Your Presence?",
      description:
        "Enroll in MEDH's Personality Development Course and unlock your potential for a fulfilling personal and professional life.",
      actionText: "Take Actions for Your Brighter Future!",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg, // Correct image path from the public folder
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
          actionText={course.actionText}
          buttonText={course.buttonText}
          imageUrl={course.imageUrl}
          onButtonClick={() => handleEnrollClick(course)}
        />
      ))}
    </div>
  );
}
