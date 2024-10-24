import React from "react";
import CardImg1 from "./../../../assets/images/courseai/courseaicardimg1.jpeg";
import CardImg2 from "./../../../assets/images/courseai/courseaicardimg2.jpeg";
import CardImg3 from "./../../../assets/images/courseai/courseaicardimg3.jpeg";
import CourseCard from "../courses/CourseCard";

function CourseAiRelatedCourses() {
  const courses = [
    {
      title: "Professional Edge Diploma in",
      label: "Digital Marketing with Data Analytics",
      duration: "18 Months Course",
      image: CardImg1,
    },
    {
      title: "Executive Diploma in",
      label: "Digital Marketing with Data Analytics",
      duration: "12 Months Course",
      image: CardImg2,
    },
    {
      title: "Professional Edge Diploma in",
      label: "AI & Data Science",
      duration: "18 Months Course",
      image: CardImg3,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-screen-dark h-auto pb-6 flex justify-center items-center flex-col pt-10">
      <p
        className="text-[#727695] text-md  text-center px-4 dark:text-gray300
        "
      >
        By enrolling in MEDH’s AI and Data Science course, you will gain a
        comprehensive understanding of
        <br /> these
        <br /> dynamic fields, preparing you to excel in an ever-evolving
        industry.
      </p>
      <h1 className="text-center text-[#5C6574] text-3xl font-bold py-5 dark:text-gray50 ">
        Related Courses
      </h1>
      <div className="w-[80%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseAiRelatedCourses;
