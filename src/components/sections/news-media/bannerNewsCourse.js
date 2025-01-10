"use client";
import React from "react";
import CourseBanner from "@/components/course-banner/courseBanner";
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import VerticalIcon from "@/assets/images/news-media/vertical-white.svg";

function BannerNewsCourse() {
  const courses = [
    {
      heading:
        "Stay connected with MEDH as we continue to pioneer advancements in EdTech and skill development.",
      description:
        "Together, we can create a brighter future through the power of education.",
      buttonText: "Contact us",
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

export default BannerNewsCourse;
