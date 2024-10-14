"use client";

import CourseBanner from "@/components/course-banner/courseBanner"; // Ensure this path is correct
import CourseBannerImg from "../../../assets/images/personality/coursebannerimg.png";

export default function CourseAiCourseBanner() {
  const courses = [
    {
      heading: "Ready to supercharge your career?",
      description:
        "Enroll in our AI and Data Science Course today and transform your future!",
      actionText: "Take Actions for Your Brighter Future!",
      buttonText: "Enroll Now",
      imageUrl: CourseBannerImg, 
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
