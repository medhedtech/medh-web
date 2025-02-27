"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { SlidersVertical } from "lucide-react";

// Dynamically import components with SSR disabled
const CategoryFilter = dynamic(() => import("../courses/CategoryFilter"), {
  ssr: false,
});

const CourseCard = dynamic(() => import("../courses/CourseCard"), {
  ssr: false,
});

const Pagination = dynamic(() => import("@/components/shared/others/Pagination"), {
  ssr: false,
});

const GradeSlider = dynamic(() => import("./GradeSlider"), {
  ssr: false,
});

function PersonalityCourse() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const { getQuery } = useGetQuery();

  const [gradeSliderOpen, setGradeSliderOpen] = useState(false);

  const toggleGradeSlider = () => {
    setGradeSliderOpen(!gradeSliderOpen);
  };

  const categories = [
    "Preschool",
    "Grade 1-2",
    "Grade 3-4",
    "Grade 5-6",
    "Grade 7-8",
    "Grade 9-10",
    "Grade 11-12",
    "UG - Graduate - Professionals",
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
        "",
        "",
        "Published",
        searchTerm,
        gradeQuery,
        "Personality Development",
        // false
      ),
      onSuccess: (data) => {
        let courses = data?.courses || [];
        console.log("per dev courses: ", courses);
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
    <div
      id="courses-section"
      className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center md:py-10 py-5"
    >
      <div className="w-[96%] px-4 md:px-8 lg:px-10 md:w-[90%] max-w-[1200px]">
        <h2 className="text-[22px] md:text-3xl font-bold mb-4 text-center text-[#5C6574] dark:text-gray50 pb-10">
          Personality Development Courses (Grade Wise)
        </h2>

        {/* Search and Sort Options */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="max-md:hidden flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[25%]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none ml-2 w-full dark:bg-screen-dark dark:text-gray50"
            />
          </div>

          <GradeSlider
            toggleGradeSlider={toggleGradeSlider}
            gradeSliderOpen={gradeSliderOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
          />

          {/* Sorting Filter */}
          <div className="border border-[#CDCFD5] px-2 py-0 rounded-md w-full md:w-auto">
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
          <div className="max-md:hidden w-full md:w-1/4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedGrade}
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
      {gradeSliderOpen && (
        <div
          className="md:hidden backdrop-blur-sm bg-black bg-opacity-50 fixed top-0 left-0 w-full h-[100vh] z-[1000001]"
          onClick={() => {
            setGradeSliderOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default PersonalityCourse;
