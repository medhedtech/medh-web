"use client";
import React from 'react'
import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";
import DotIcon from "@/assets/images/corporate-training/dot-icon.svg"

function CourceBanner() {
  const courses = [
    {
      heading: "Let’s collaborate and discuss your",
      headings: "training needs.",
      description:
        "Embark on a transformative journey towards success and unparalleled growth.",
      buttonText: "Let’s Connect",
      imageUrl: CourseBannerImg, 
      buttonBgColor: "#F2277E", // Dynamic background color
      icon: DotIcon, // Icon to display in the button
    },
  ];

  const handleEnrollClick = (course) => {
    alert(`You clicked to enroll in: ${course.heading}`);
  };

return (
<div className='bg-white flex justify-center items-center flex-col lg:pb-12 pb-10'>
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
  <div className='lg:w-[80%] w-[95%] text-center font-Poppins text-[#727695] text-[15px] font-semibold leading-[27px]'>
    <p>Upon enrolling in our Corporate Training Courses, you can be confident in making a strategic investment in your organization’s future.</p>
      <p className='mt-6'>Our dedication to providing top-tier, customized training ensures that your team will acquire the skills needed to excel in today’s ever-evolving business environment. We are committed to your success and eager to embark on this transformative journey with you.</p>
      </div>
</div>
);
}

export default CourceBanner
