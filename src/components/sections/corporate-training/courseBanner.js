"use client";
import React from "react";
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg";

function CourceBanner() {
  const courses = [
    {
      heading: "Let’s collaborate and discuss your",
      headings: "training needs.",
      description:
        "Embark on a transformative journey towards success and unparalleled growth.",
      buttonText: "Let’s Connect",
      imageUrl: CourseBannerImg,
      buttonBgColor: "#7ECA9D", // Dynamic background color
      icon: DotIcon, // Icon to display in the button
    },
  ];

  const handleEnrollClick = (course) => {
    alert(`You clicked to enroll in: ${course.heading}`);
  };

  return (
    <div className="bg-white dark:bg-screen-dark  flex justify-center items-center flex-col lg:pb-12 pb-10">
      {courses.map((course, index) => (
        <CourseBanner
          key={index}
          heading={course.heading}
          headings={course.headings}
          description={course.description}
          buttonText={course.buttonText}
          imageUrl={course.imageUrl}
          onButtonClick={() => handleEnrollClick(course)}
          buttonBgColor={course.buttonBgColor} // Pass dynamic button color
          icon={course.icon} // Pass icon for button
        />
      ))}
      <div className="w-[95%] lg:w-full text-center font-Poppins dark:text-white text-[#727695] font-thin leading-[27px] mx-auto">
        <p className="text-[1rem] font-normal sm:text-lg md:text-xl w-[80%] sm:w-[55%] mx-auto">
          Upon enrolling in our Corporate Training Courses, you can be confident
          in making a strategic investment in your organization&#39;s future.
        </p>
        <p className="mt-6 text-sm sm:text-base font-normal md:text-lg w-[90%] sm:w-[80%] mx-auto">
          Our dedication to providing top-tier, customized training ensures that
          your team will acquire the skills needed to excel in today&#39;s
          ever-evolving business environment. We are committed to your success
          and eager to embark on this transformative journey with you.
        </p>
      </div>
    </div>
  );
}

export default CourceBanner;
