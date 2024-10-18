import React from "react";
import CardImg1 from "./../../../assets/images/digital-marketing/card-4.svg";
import CardImg2 from "./../../../assets/images/digital-marketing/card-5.svg";
import CardImg3 from "./../../../assets/images/digital-marketing/card-6.svg";
import CourseCard from "../courses/CourseCard";

function DigiMarketingRalatedCource() {
  const courses = [
    {
      title: "Professional Edge Diploma in",
      label: "Digital Marketing with Data Analytics",
      duration: "18 Months Course",
      image: CardImg1,
    },
    {
      title: "Professional Edge Diploma in",
      label: "AI & Data Science",
      duration: "AI & Data Science",
      duration: "18 Months Course",
      image: CardImg2,
    },
    {
      title: "Executive Diploma in",
      label: "AI & Data Science",
      duration: "12 Months Course",
      image: CardImg3,
    },
  ];
  return (
    <div className="w-full bg-white h-auto pt-3 pb-10 flex justify-center items-center flex-col ">
      <p
        className="text-[#727695] text-[15px] leading-6 font-medium text-center px-4  md:w-[60%] w-full 
        "
      >
        We are thrilled to be a part of your transformative journey and to
        assist you in unlocking your complete potential in the digital marketing
        and data analytics industry.
      </p>
      <h1 className="text-center text-[#5C6574]  text-3xl font-bold py-5 ">
        Related Courses
      </h1>
      <div className="w-[80%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default DigiMarketingRalatedCource;
