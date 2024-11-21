// import React from "react";
// import CardImg1 from "./../../../assets/images/personality/courseimg1.jpeg";
// import CardImg2 from "./../../../assets/images/personality/courseimg2.jpeg";
// import CardImg3 from "./../../../assets/images/personality/courseimg3.jpeg";
// import CourseCard from "../courses/CourseCard";

// function RelatedCourses() {
//   const courses = [
//     {
//       title: "Certificate in",
//       label: "Vedic Mathematics",
//       grade: "(Grade 5-6)",
//       duration: "9 Months Course",
//       image: CardImg1,
//     },
//     {
//       title: "Foundation Certificate in",
//       label: "Digital Marketing with Data Analytics",
//       duration: "4 Months Course",
//       image: CardImg2,
//     },
//     {
//       title: "Advanced Certificate in",
//       label: "AI & Data Science",
//       duration: "8 Months Course",
//       image: CardImg3,
//     },
//   ];

//   return (
//     <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col">
//         <p className="text-[#727695] text-lg font-semibold text-center px-4 dark:text-gray-100
//         ">We look forward to welcoming you on board to acquire the essential skills and knowledge to craft your success story</p>
//       <h1 className="text-center text-[#5C6574] text-3xl font-bold py-5 dark:text-gray50 ">
//         Related Courses
//       </h1>
//       <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RelatedCourses;


"use client";
import React, { useEffect, useState } from "react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "../courses/CourseCard";

function RelatedCourses() {
  const { getQuery } = useGetQuery();
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Fetch related courses from API
  const fetchRelatedCourses = () => {
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1,
        10,
        "",
        "",
        "",
        "",
        "Personality Development",
        "",
        false
      ),
      onSuccess: (data) => {
        const filtered = (data?.courses || []).slice(0, 3);
        setRelatedCourses(filtered);
      },
      onFail: (error) => {
        console.error("Error fetching related courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchRelatedCourses();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col">
      <p className="text-[#727695] text-lg font-semibold text-center px-4 dark:text-gray-100">
        We look forward to welcoming you on board to acquire the essential skills and knowledge to craft your success story
      </p>
      <h1 className="text-center text-[#5C6574] text-3xl font-bold py-5 dark:text-gray50">
        Related Courses
      </h1>
      <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCourses.length > 0 ? (
          relatedCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No related courses found.</p>
        )}
      </div>
    </div>
  );
}

export default RelatedCourses;
