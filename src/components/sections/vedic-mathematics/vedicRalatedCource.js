// import React from "react";
// import card4 from "@/assets/images/vedic-mathematics/card-4.svg";
// import card5 from "@/assets/images/vedic-mathematics/card-5.svg";
// import card6 from "@/assets/images/vedic-mathematics/card-6.svg";
// import CourseCard from "../courses/CourseCard";

// const VedicRalatedCource = () => {
//   const courses = [
//     {
//       title: "Certificate in",
//       label: "Personality Development (Grade 5-6)",
//       duration: "9 Months Course",
//       image: card4,
//     },
//     {
//       title: "Advanced Certificate in",
//       label: "Digital Marketing with Data Analytics",
//       duration: "8 Months Course",
//       image: card5,
//     },
//     {
//       title: "Foundation Certificate in",
//       label: "AI & Data Science",
//       duration: "4 Months Course",
//       image: card6,
//     },
//   ];
//   return (
//     <div className="w-full bg-white  dark:bg-screen-dark h-auto pt-3 pb-10 flex justify-center items-center flex-col ">
//       <p
//         className="text-[#727695] dark:text-gray300 text-[15px] leading-6 font-medium text-center px-4  md:w-[60%] w-full
//         "
//       >
//         Uncover Vedic Mathematics efficacy with expert guidance and nurturing
//         support from our instructors, empowering your mathematical abilities to
//         new levels.
//       </p>
//       <h1 className="text-center text-[#5C6574]  text-3xl font-bold py-5 dark:text-gray-50 ">
//         Related Courses
//       </h1>
//       <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
//         {courses.map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// };
// export default VedicRalatedCource;

"use client";
import React, { useEffect, useState } from "react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "../courses/CourseCard";
import { getAllCoursesWithLimits } from "@/apis/course/course";

const VedicRalatedCource = () => {
  const { getQuery } = useGetQuery();
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Fetch related Vedic Mathematics courses from API
  const fetchRelatedCourses = () => {
    getQuery({
      url: getAllCoursesWithLimits({
        page: 1,
        limit: 10,
        course_category: "Vedic Mathematics",
        status: "Published"
      }),
      onSuccess: (data) => {
        const filtered = (data?.courses || []).slice(0, 3);
        setRelatedCourses(filtered);
      },
      onFail: (error) => {
        console.error("Error fetching related Vedic Mathematics courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchRelatedCourses();
  }, []);

  return (
    <div className="w-full h-auto flex justify-center items-center flex-col">
      <h1 className="text-center text-orange text-3xl font-bold dark:text-yellow pb-10 ">
        Related Courses
      </h1>
      {relatedCourses.length > 0 ? (
        <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-[200px]">
          <p className="text-center text-black dark:text-white text-base">
            More Vedic Mathematics courses coming soon! Stay tuned for new programs and specializations.
          </p>
        </div>
      )}
    </div>
  );
};

export default VedicRalatedCource;
