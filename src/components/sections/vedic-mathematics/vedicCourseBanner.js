"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

export default function VedicCourceBanner() {
  const courses = [
    {
      heading: "Join us in unlocking the magic of Vedic Mathematics.",
      description: "Embark on a journey of mathematical discovery and empowerment.",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#5F2DED", // Dynamic background color
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
