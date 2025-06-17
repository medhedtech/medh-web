"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.jpg";
// import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

export default function MembershipCourceBanner() {
  const courses = [
    {
      heading: "Get Started Now! Elevate Your Learning.",
      description: "Connect, learn, and grow with MEDH Membership.",
      buttonText: "Join Us",
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
          buttonBgColor={course.buttonBgColor}
          icon={course.icon}
        />
      ))}
    </div>
  );
}
