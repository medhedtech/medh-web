// import React from "react";
// import CardImg1 from "./../../../assets/images/digital-marketing/card-4.svg";
// import CardImg2 from "./../../../assets/images/digital-marketing/card-5.svg";
// import CardImg3 from "./../../../assets/images/digital-marketing/card-6.svg";
// import CourseCard from "../courses/CourseCard";

// function DigiMarketingRalatedCource() {
//   const courses = [
//     {
//       title: "Professional Edge Diploma in",
//       label: "Digital Marketing with Data Analytics",
//       duration: "18 Months Course",
//       image: CardImg1,
//     },
//     {
//       title: "Professional Edge Diploma in",
//       label: "AI & Data Science",
//       duration: "AI & Data Science",
//       duration: "18 Months Course",
//       image: CardImg2,
//     },
//     {
//       title: "Executive Diploma in",
//       label: "AI & Data Science",
//       duration: "12 Months Course",
//       image: CardImg3,
//     },
//   ];
//   return (
//     <div className="w-full bg-white dark:bg-screen-dark h-auto pt-3 pb-10 flex justify-center items-center flex-col ">
//       <p
//         className="text-[#727695] dark:text-gray300 text-[15px] leading-6 font-medium text-center px-4  md:w-[60%] w-full
//         "
//       >
//         We are thrilled to be a part of your transformative journey and to
//         assist you in unlocking your complete potential in the digital marketing
//         and data analytics industry.
//       </p>
//       <h1 className="text-center text-[#5C6574] dark:text-gray50  text-3xl font-bold py-5 ">
//         Related Courses
//       </h1>
//       <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
//         {courses.map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default DigiMarketingRalatedCource;

"use client";
import React, { useEffect, useState } from "react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "../courses/CourseCard";
import { getAllCoursesWithLimits } from "@/apis/course/course";
import { motion } from "framer-motion";

function DigiMarketingRalatedCource() {
  const { getQuery } = useGetQuery();
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Fetch related Digital Marketing courses from API
  const fetchRelatedCourses = () => {
    getQuery({
      url: getAllCoursesWithLimits(
        1,
        10,
        "",
        "",
        "",
        "Published",
        "",
        "",
        "Digital Marketing with Data Analytics",
        false
      ),
      onSuccess: (data) => {
        const filtered = (data?.courses || []).slice(0, 3);
        setRelatedCourses(filtered);
      },
      onFail: (error) => {
        console.error(
          "Error fetching related Digital Marketing courses:",
          error
        );
      },
    });
  };

  useEffect(() => {
    fetchRelatedCourses();
  }, []);

  return (
    <div className="w-full h-auto flex justify-center items-center flex-col">
      {/* Related Courses Section */}
      <h1 className="text-center text-orange text-3xl font-bold dark:text-yellow pb-10 mt-16 ">
        Related Courses
      </h1>
      {relatedCourses.length > 0 ? (
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-[200px]">
          <p className="text-center text-black dark:text-white text-base">
            More Digital Marketing with Data Analytics courses coming soon! Stay tuned for new programs and specializations.
          </p>
        </div>
      )}
    </div>
  );
}

export default DigiMarketingRalatedCource;
