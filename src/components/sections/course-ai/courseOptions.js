import React from "react";
import CardImg1 from "./../../../assets/images/personality/courseimg1.jpeg";
import CardImg2 from "./../../../assets/images/personality/courseimg2.jpeg";
import CardImg3 from "./../../../assets/images/personality/courseimg3.jpeg";
import CourseCard from "../courses/CourseCard";

function CourseOptions() {
  const courses = [
    {
      title: "Advanced Certificate in",
      label: "AI & Data Science",
      //   grade: "(Grade 5-6)",
      duration: "8 Months Course",
      image: CardImg1,
    },
    {
      title: "Executive Diploma in",
      label: "AI & Data Science",
      duration: "12 Months Course",
      image: CardImg2,
    },
    {
      title: "Foundation Certificate in",
      label: "AI & Data Science",
      duration: "4 Months Course",
      image: CardImg3,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col">
      <h1 className="text-center text-[#5C6574] md:text-3xl text-2xl font-bold mb-8 dark:text-gray50">
        Course Options in AI with Data Science
      </h1>
      <div className=" md:mx-auto w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseOptions;
