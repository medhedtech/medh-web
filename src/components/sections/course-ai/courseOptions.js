// "use client";
// import React from "react";
// import CardImg1 from "./../../../assets/images/personality/courseimg1.jpeg";
// import CardImg2 from "./../../../assets/images/personality/courseimg2.jpeg";
// import CardImg3 from "./../../../assets/images/personality/courseimg3.jpeg";
// import CourseCard from "../courses/CourseCard";
// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";

// function CourseOptions() {
//   const { getQuery } = useGetQuery();
//   const courses = [
//     {
//       title: "Advanced Certificate in",
//       label: "AI & Data Science",
//       //   grade: "(Grade 5-6)",
//       duration: "8 Months Course",
//       image: CardImg1,
//     },
//     {
//       title: "Executive Diploma in",
//       label: "AI & Data Science",
//       duration: "12 Months Course",
//       image: CardImg2,
//     },
//     {
//       title: "Foundation Certificate in",
//       label: "AI & Data Science",
//       duration: "4 Months Course",
//       image: CardImg3,
//     },
//   ];

//   // Fetch courses from API
//   const fetchCourses = () => {
//     getQuery({
//       url: apiUrls.courses.getAllCoursesWithLimits(
//         currentPage,
//         coursesPerPage,
//         "",
//         "",
//         "",
//         "",
//         "AI with Data Science",
//         false
//       ),
//       onSuccess: (data) => {
//         setAllCourses(courses);
//         setTotalPages(data?.totalPages || 1);
//       },
//       onFail: (error) => {
//         console.error("Error fetching courses:", error);
//       },
//     });
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   return (
//     <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col">
//       <h1 className="text-center text-[#5C6574] md:text-3xl text-2xl font-bold mb-8 dark:text-gray50">
//         Course Options in AI with Data Science
//       </h1>
//       <div className=" md:mx-auto w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CourseOptions;

"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

function CourseOptions() {
  const { getQuery } = useGetQuery();
  const [filteredCourses, setFilteredCourses] = useState([]); // State to store filtered courses

  // Fetch courses from API
  const fetchCourses = () => {
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1, // Fetch only the first page
        "", // Fetch more than 3 to filter and limit
        "",
        "",
        "",
        "",
        "AI and Data Science",
        "",
        false
      ),
      onSuccess: (data) => {
        const filtered = (data?.courses || [])
          .filter((course) => course.course_title === "AI and Data Science")
          .slice(0, 3);
        setFilteredCourses(filtered);
      },
      onFail: (error) => {
        console.error("Error fetching courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div
      id="courses-section"
      className="w-full pb-0 sm:pb-20 bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col"
    >
      <h1 className="text-center text-[#5C6574] md:text-3xl text-2xl font-bold mb-8 dark:text-gray50">
        Course Options in AI with Data Science
      </h1>
      <div className=" md:mx-auto w-[80%] h-full rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No courses found for AI with Data Science.</p>
        )}
      </div>
    </div>
  );
}

export default CourseOptions;
