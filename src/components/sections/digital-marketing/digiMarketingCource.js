"use client";
import React from 'react'
import CardImg1 from "./../../../assets/images/digital-marketing/card-1.svg";
import CardImg2 from "./../../../assets/images/personality/courseimg2.jpeg";
import CardImg3 from "./../../../assets/images/digital-marketing/card-3.svg";
import CourseCard from "../courses/CourseCard";
import Registration from "../registrations/Registration";


function DigiMarketingCource() {
   
    const courses = [
        {
          title: "Advanced Certificate in",
          label: "Digital Marketing with Data Analytics",
          duration: "8 Months Course",
          image: CardImg1,
        },
        {
            title: "Foundation Certificate in",
            label: "Digital Marketing with Data Analytics",
            duration: "4 Months Course",
          image: CardImg2,
        },
        {
          title: "Executive Diploma in",
          label: "Digital Marketing with Data Analytics",
          duration: "12 Months Course",
          image: CardImg3,
        },
      ];
  return (
    <>
       <div className="w-full bg-white dark:bg-[#050622] h-auto py-6 flex justify-center items-center flex-col pb-14">
      <h1 className="text-center text-[#5C6574] text-3xl font-bold py-5 dark:text-gray-50 ">
      Course Options in Digital Marketing with Data Analytics
      </h1>
      <div className="w-[80%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  text-[#5C6574]">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
      <Registration/>
    </>
  )
}



export default DigiMarketingCource
