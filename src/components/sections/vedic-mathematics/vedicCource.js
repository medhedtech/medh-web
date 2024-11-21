// 'use client';

// import React, { useState } from 'react';
// import CategoryFilter from '../courses/CategoryFilter';
// import CourseCard from '../courses/CourseCard';
// import Card1 from './../../../assets/images/vedic-mathematics/card-1.svg';
// import Card2 from './../../../assets/images/vedic-mathematics/card-2.svg';
// import Card3 from './../../../assets/images/vedic-mathematics/card-3.svg';
// import Registration from '../registrations/Registration';

// function VedicCource() {
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const categories = [
//     'Preschool',
//     'Grade 1-2',
//     'Grade 3-4',
//     'Grade 5-6',
//     'Grade 7-8',
//     'Grade 9-10',
//     'Grade 11-12',
//     'UG - Graduate - Professionals',
//   ];

//   const courses = [
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '6 Months Course',
//       image: Card3,
//     },
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '9 Months Course',
//       image: Card3,
//     },
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '3 Months Course',
//       image: Card2,
//     },
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '6 Months Course',
//       image: Card2,
//     },
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '9 Months Course',
//       image: Card2,
//     },
//     {
//       title: 'Certificate in',
//       label: 'Personality Development',
//       grade: '(Grade 1-2)',
//       duration: '3 Months Course',
//       image: Card1,
//     },
//   ];

//   const filteredCourses = selectedCategory
//     ? courses.filter((course) => course.label === selectedCategory)
//     : courses;

//   const handleClearFilters = () => {
//     setSelectedCategory(null);
//   };
//   return (
//     <>
//       <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
//         <div className="w-[93%] md:w-[80%] max-w-[1200px]">
//           <h2 className="text-[22px] md:text-3xl font-bold mb-4 text-center text-[#5C6574] dark:text-gray50 pb-10">
//             Course Options in Vedic Mathematics (Grade Wise)
//           </h2>

//           <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 px-2">
//             <div className="flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[30%] lg:w-[22%]">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-search"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <path d="m21 21-4.3-4.3" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="outline-none ml-2 w-full dark:bg-screen-dark"
//               />
//             </div>

//             <div className="border border-[#CDCFD5] px-2 py-2 rounded-md w-full md:w-auto">
//               <select className="w-full outline-none dark:bg-screen-dark dark:text-gray300">
//                 <option>Program Title (A-Z)</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="w-full px-2 md:w-1/4">
//               <CategoryFilter
//                 categories={categories}
//                 setSelectedCategory={setSelectedCategory}
//                 heading="Grade"
//               />
//             </div>

//             <div className="w-full md:w-3/4 px-2">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredCourses.map((course) => (
//                   <CourseCard key={course.title} course={course} />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {selectedCategory && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleClearFilters}
//                 className="border border-[#7ECA9D] text-[#7ECA9D] px-4 py-2 rounded-md"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <Registration />
//     </>
//   );
// }

// export default VedicCource;

// "use client";

// import React, { useState } from "react";
// import CategoryFilter from "../courses/CategoryFilter";
// import CourseCard from "../courses/CourseCard";
// import CardImg from "./../../../assets/images/personality/cardimg.png";
// import Pagination from "@/components/shared/others/Pagination";

// function PersonalityCourse() {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const coursesPerPage = 6;

//   const categories = [
//     "Preschool",
//     "Grade 1-2",
//     "Grade 3-4",
//     "Grade 5-6",
//     "Grade 7-8",
//     "Grade 9-10",
//     "Grade 11-12",
//     "UG - Graduate - Professionals",
//   ];

//   const courses = [
//     {
//       title: "Certificate in",
//       label: "Personality Development",
//       grade: "(Grade 1-2)",
//       duration: "6 Months Course",
//       image: CardImg,
//     },
//     {
//       title: "Certificate in",
//       label: "Personality Development",
//       grade: "(Grade 1-2)",
//       duration: "9 Months Course",
//       image: CardImg,
//     },
//     {
//       title: "Certificate in",
//       label: "Personality Development",
//       grade: "(Grade 1-2)",
//       duration: "3 Months Course",
//       image: CardImg,
//     },
//     // Add more courses as needed
//   ];

//   const filteredCourses = selectedCategory
//     ? courses.filter((course) => course.label === selectedCategory)
//     : courses;

//   // Pagination logic
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
//   const paginatedCourses = filteredCourses.slice(
//     (currentPage - 1) * coursesPerPage,
//     currentPage * coursesPerPage
//   );

//   const handlePagesnation = (page) => {
//     setCurrentPage(page);
//   };

//   const handleClearFilters = () => {
//     setSelectedCategory(null);
//     setCurrentPage(1); // Reset to first page after clearing filters
//   };

//   return (
//     <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center md:py-10 py-5">
//       <div className="w-[96%] px-4 md:px-8 lg:px-10 md:w-[80%] max-w-[1200px]">
//         <h2 className="text-[22px] md:text-3xl font-bold mb-4 text-center text-[#5C6574] dark:text-gray50 pb-10">
//           Personality Development Courses (Grade Wise)
//         </h2>

//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
//           <div className="flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[40%]">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-search"
//             >
//               <circle cx="11" cy="11" r="8" />
//               <path d="m21 21-4.3-4.3" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search"
//               className="outline-none ml-2 w-full dark:bg-screen-dark dark:text-gray50"
//             />
//           </div>

//           <div className="border border-[#CDCFD5] px-2 py-2 rounded-md w-full md:w-auto">
//             <select className="w-full outline-none dark:bg-screen-dark">
//               <option>Program Title (A-Z)</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="w-full md:w-1/4">
//             <CategoryFilter
//               categories={categories}
//               setSelectedCategory={setSelectedCategory}
//               heading="Grade"
//             />
//           </div>

//           <div className="w-full md:w-3/4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {paginatedCourses.map((course) => (
//                 <CourseCard key={course.title} course={course} />
//               ))}
//             </div>
//             <div className=" w-full mt-4 mb-8  px-4 text-[#5C6574] border rounded-md border-[#CDCFD5]">
//               <Pagination
//                 pages={totalPages}
//                 currentPage={currentPage}
//                 handlePagesnation={handlePagesnation}
//               />
//             </div>
//           </div>
//         </div>

//         {selectedCategory && (
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={handleClearFilters}
//               className="border border-[#7ECA9D] text-[#7ECA9D] px-4 py-2 rounded-md"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PersonalityCourse;

"use client";

import React, { useEffect, useState } from "react";
import CategoryFilter from "../courses/CategoryFilter";
import CourseCard from "../courses/CourseCard";
import Pagination from "@/components/shared/others/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

function VedicCource() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const { getQuery } = useGetQuery();

  const categories = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
  ];

  const coursesPerPage = 3;

  // Fetch courses from API
  const fetchCourses = () => {
    const gradeQuery = selectedGrade || "";

    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        currentPage,
        coursesPerPage,
        "",
        gradeQuery,
        "",
        "",
        searchTerm || "Vedic Mathematics",
        "",
        false
      ),
      onSuccess: (data) => {
        let courses = data?.courses || [];

        // Apply sorting
        if (sortOrder === "A-Z") {
          courses = courses.sort((a, b) =>
            a.course_title.localeCompare(b.course_title)
          );
        } else if (sortOrder === "Z-A") {
          courses = courses.sort((a, b) =>
            b.course_title.localeCompare(a.course_title)
          );
        }

        setAllCourses(courses);
        setTotalPages(data?.totalPages || 1);
      },
      onFail: (error) => {
        console.error("Error fetching courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedGrade, searchTerm, sortOrder, currentPage]);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSelectedGrade(null);
    setSearchTerm("");
    setSortOrder("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center md:py-10 py-5">
      <div className="w-[96%] px-4 md:px-8 lg:px-10 md:w-[90%] max-w-[1200px]">
        <h2 className="text-[22px] md:text-3xl font-bold mb-4 text-center text-[#5C6574] dark:text-gray50 pb-10">
        Course Options in Vedic Mathematics (Grade Wise)
        </h2>

        {/* Search and Sort Options */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[25%]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none ml-2 w-full dark:bg-screen-dark dark:text-gray50"
            />
          </div>

          {/* Sorting Filter */}
          <div className="border border-[#CDCFD5] px-2 py-2 rounded-md w-full md:w-auto">
            <select
              className="w-full outline-none dark:bg-screen-dark"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="A-Z">Program Title (A-Z)</option>
              <option value="Z-A">Program Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter */}
          <div className="w-full md:w-1/4">
            <CategoryFilter
              categories={categories}
              setSelectedCategory={setSelectedGrade}
              heading="Grade"
            />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.length > 0 ? (
                allCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>
            {/* Pagination */}
            <div className="w-full mt-12 mb-8 px-4 text-[#5C6574] border rounded-md border-[#CDCFD5]">
              <Pagination
                pages={totalPages}
                currentPage={currentPage}
                handlePagesnation={handlePagination}
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedGrade || searchTerm || sortOrder) && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClearFilters}
              className="border border-[#7ECA9D] text-[#7ECA9D] px-4 py-2 rounded-md"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VedicCource;
