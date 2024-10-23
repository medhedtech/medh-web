"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";

export default function HireFromMedhCourseBanner() {
  const courses = [
    {
      heading: "Secure Your Future in Data-Driven Online Marketing.",
      description: "Join Digital Marketing with Data Analytics Course.",
      actionText: "Take Actions for Your Brighter Future!",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg,
    },
  ];

  const handleEnrollClick = (course) => {
    alert(`You clicked to enroll in: ${course.heading}`);
  };

  return (
    <>
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
      <p className="bg-white text-center dark:bg-black dark:text-white mt-[-20px] pb-8 px-3 text-[14px] text-[#727695]">
        We are thrilled to be a part of your transformative journey and to
        assist you in unlocking your complete <br /> potential in the digital
        marketing and data analytics industry.
      </p>
    </>
  );
}
