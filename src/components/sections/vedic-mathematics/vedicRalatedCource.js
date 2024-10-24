import React from "react";
import card4 from "@/assets/images/vedic-mathematics/card-4.svg";
import card5 from "@/assets/images/vedic-mathematics/card-5.svg";
import card6 from "@/assets/images/vedic-mathematics/card-6.svg";
import CourseCard from "../courses/CourseCard";

const VedicRalatedCource = () => {
  const courses = [
    {
      title: "Certificate in",
      label: "Personality Development (Grade 5-6)",
      duration: "9 Months Course",
      image: card4,
    },
    {
      title: "Advanced Certificate in",
      label: "Digital Marketing with Data Analytics",
      duration: "8 Months Course",
      image: card5,
    },
    {
      title: "Foundation Certificate in",
      label: "AI & Data Science",
      duration: "4 Months Course",
      image: card6,
    },
  ];
  return (
    <div className="w-full bg-white  dark:bg-screen-dark h-auto pt-3 pb-10 flex justify-center items-center flex-col ">
      <p
        className="text-[#727695] dark:text-gray300 text-[15px] leading-6 font-medium text-center px-4  md:w-[60%] w-full 
        "
      >
        Uncover Vedic Mathematics’ efficacy with expert guidance and nurturing
        support from our instructors, empowering your mathematical abilities to
        new levels.
      </p>
      <h1 className="text-center text-[#5C6574]  text-3xl font-bold py-5 dark:text-gray-50 ">
        Related Courses
      </h1>
      <div className="w-[80%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};
export default VedicRalatedCource;
