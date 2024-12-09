"use client";
import { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import Preloader2 from "@/components/shared/others/Preloader2";

const categories = [
  "AI and Data Science",
  "AI for Professionals",
  "Business And Management",
  "Career Development",
  "Communication And Soft Skills",
  "Data And Analytics",
  "Digital Marketing with Data Analytics",
  "Environmental and Sustainability Skills",
  "Finance And Accounts",
  "Health And Wellness",
  "Industry-Specific Skills",
  "Language And Linguistic",
  "Legal And Compliance Skills",
  "Personal Well-Being",
  "Personality Development",
  "Sales And Marketing",
  "Technical Skills",
  "Vedic Mathematics",
];

const grades = [
  "Preschool",
  "Grade 1-2",
  "Grade 3-4",
  "Grade 5-6",
  "Grade 7-8",
  "Grade 9-10",
  "Grade 11-12",
  "UG - Graduate - Professionals",
];

const CoursesFilter = ({ CustomButton, CustomText }) => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const { getQuery, loading } = useGetQuery();
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Fetch courses from API
  const fetchCourses = () => {
    const categoryQuery = selectedCategory ? selectedCategory : [];
    const gradeQuery = selectedGrade || "";

    getQuery({
      url: apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        6,
        "",
        "",
        "",
        "Published",
        searchTerm,
        // "",
        gradeQuery,
        categoryQuery
      ),
      onSuccess: (data) => {
        console.log("got data: ", data);
        setAllCourses(data?.courses || []);
        setTotalPages(data?.totalPages || 1);
      },
      onFail: (error) => {
        console.error("Error fetching courses:", error);
      },
    });
  };

  const applyFilters = () => {
    let filtered = allCourses;
    console.log(allCourses);

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          (course.course_title &&
            course.course_title
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (course.course_category &&
            course.course_category
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (course.course_duration &&
            course.course_duration
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory.length) {
      filtered = filtered.filter(
        (course) => {
          const lowercase = selectedCategory.map((c) => c.toLowerCase());

          if (course.category) {
            return lowercase.includes(course.category.toLowerCase());
          } else {
            return false;
          }
        }
        // course.category &&
        // course.category.toLowerCase() === selectedCategory.toLowerCase()
      );

      console.log("Selected Category: ", selectedCategory);
      console.log("filtered: ", filtered);
    }

    // Sorting the filtered courses based on the selected sort order
    if (sortOrder === "A-Z") {
      filtered = filtered.sort((a, b) => {
        if (a.course_title.toLowerCase() < b.course_title.toLowerCase())
          return -1;
        if (a.course_title.toLowerCase() > b.course_title.toLowerCase())
          return 1;
        return 0;
      });
    } else if (sortOrder === "Z-A") {
      filtered = filtered.sort((a, b) => {
        if (a.course_title.toLowerCase() < b.course_title.toLowerCase())
          return 1;
        if (a.course_title.toLowerCase() > b.course_title.toLowerCase())
          return -1;
        return 0;
      });
    }
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory, sortOrder, selectedGrade]);

  useEffect(() => {
    applyFilters();
  }, [allCourses, searchTerm, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategory([]);
    setSearchTerm("");
    setSortOrder("A-Z");
    setCurrentPage(1);
  };

  return (
    <section>
      <div className="min-h-screen bg-white dark:bg-screen-dark dark:text-white p-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7ECA9D] mb-4 md:mb-0">
              {/* Skill Development Courses */}
              {CustomText}
            </h1>
            <div>{CustomButton}</div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-10">
            <div className="flex items-center mt-8 border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[25%]">
              <input
                type="text"
                placeholder="Search by category ......"
                value={searchTerm}
                onChange={handleSearch}
                className="outline-none ml-2 w-full dark:bg-screen-dark dark:text-gray50"
              />
            </div>
            {/* Grade Filter as Dropdown */}
            <div className="w-full md:w-1/4">
              <select
                id="gradeFilter"
                className="w-full border border-[#CDCFD5] px-2 py-2 rounded-md outline-none dark:bg-screen-dark dark:text-gray50"
                value={selectedGrade || ""}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Select Grade</option>
                {grades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            {/* Sidebar Filter */}
            <div className="border border-[#CDCFD5] px-2 py-0 rounded-md w-full md:w-auto">
              <select
                className="w-full outline-none dark:bg-screen-dark"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="A-Z">Program Title (A-Z)</option>
                <option value="Z-A">Program Title (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-6">
            {/* Categories Section */}
            <div className="w-full md:w-[30%]">
              <span className="text-[#5C6574] dark:text-white font-bold text-xl">
                Category
              </span>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <div className="w-full mt-12 mb-8 px-4 text-[#5C6574]">
                {/* {(selectedCategory || searchTerm || sortOrder !== "A-Z") && ( */}
                {(selectedCategory.length > 0 ||
                  searchTerm ||
                  sortOrder !== "A-Z" ||
                  selectedGrade) && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center border border-[#7ECA9D] text-[#7ECA9D] px-4 py-2 rounded-md hover:bg-[#7ECA9D] hover:text-white transition duration-300"
                    >
                      <FaTimes className="mr-2" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-3/4 ">
              <div className="w-full md:w-[100%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full min-h-[70vh] text-center">
                    <Preloader2 />
                  </div>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <CourseCard
                      key={index}
                      course={course}
                      onBrochureClick={() => handleOpenModal(course)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex justify-center items-center min-h-[70vh] text-center text-[#5C6574]">
                    No courses found.
                  </div>
                )}
              </div>
              <div className="w-full mt-12 mb-8 px-4 text-[#5C6574] border rounded-md border-[#CDCFD5]">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter;
