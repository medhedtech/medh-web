"use client";
import React from "react";
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.jpg";
import Download from "@/assets/images/join-as-school/btn-logo.svg";

function SchoolCourceBanner() {
  const courses = [
    {
      heading: "To create future-ready students through upskilling.",
      buttonText: "Let’s Connect",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#F6B335",
      icon: Download,
    },
  ];

  const handleEnrollClick = (course) => {
    alert(`You clicked to enroll in: ${course.heading}`);
  };

  return (
    <div className="bg-white dark:bg-screen-dark flex justify-center items-center flex-col lg:pb-12 pb-10">
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

      <div className="lg:w-[50%] w-[95%] text-center  dark:text-gray300 text-[#727695] text-[15px] font-Poppins font-semibold leading-[27px]">
        <p>
          For this purpose, students, teachers, and skill tech need to become
          partners in this endeavor. Because in the end, students must be taught
          how to think, not what to think.
        </p>
      </div>
    </div>
  );
}

export default SchoolCourceBanner;
