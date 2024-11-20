// "use client";
// import FilterController from "@/components/shared/courses/FilterController";
// import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
// import SectionName from "@/components/shared/section-names/SectionName";
// import FilterControllerWrapper from "@/components/shared/wrappers/FilterControllerWrapper";
// import FilterCards from "@/components/shared/courses/FilterCards";
// import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import image1 from "@/assets/images/courses/image1.png";
// import image2 from "@/assets/images/courses/image2.png";
// import image3 from "@/assets/images/courses/image3.png";
// import image4 from "@/assets/images/courses/image4.png";
// import image5 from "@/assets/images/courses/image5.png";
// import image6 from "@/assets/images/courses/image6.png";
// import CategoryFilter from "./CategoryFilter";
// import CourseCard from "./CourseCard";
// import ArrowIcon from "@/assets/images/icon/ArrowIcon";
// import Pagination from "@/components/shared/pagination/Pagination";
// import { useRouter } from "next/navigation";
// import useGetQuery from "@/hooks/getQuery.hook";
// import { apiUrls } from "@/apis";

// const categories = [
//   "AI and Data Science",
//   "AI for Professionals",
//   "Business And Management",
//   "Career Development",
//   "Communication And Soft Skills",
//   "Data And Analytics",
//   "Digital Marketing with Data Analytics",
//   "Environmental and Sustainability Skills",
//   "Finance And Accounts",
//   "Health And Wellness",
//   "Industry-Specific Skills",
//   "Language And Linguistic",
//   "Legal And Compliance Skills",
//   "Personal Well-Being",
//   "Personality Development",
//   "Sales And Marketing",
//   "Technical Skills",
//   "Vedic Mathematics",
// ];
// const CoursesFilter = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();
//   const [allCourses, setAllCourses] = useState([]);
//   const { getQuery, loading } = useGetQuery();

//   const toggleDropdown = () => {
//     setIsOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     getQuery({
//       url: apiUrls?.courses?.getAllCoursesWithLimits(
//         1,
//         6,
//         "",
//         "",
//         selectedCategory
//       ),
//       onSuccess: (data) => {
//         setAllCourses(data?.courses);
//       },
//       onFail: () => {},
//     });
//   }, [selectedCategory]);

//   return (
//     <section>
//       <div className="min-h-screen bg-white dark:bg-screen-dark  dark:text-white p-4">
//         <div className="container mx-auto">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <h1 className="text-3xl md:text-4xl font-bold text-[#7ECA9D] mb-4 md:mb-0">
//               Skill Development Courses
//             </h1>
//             <div>
//               <button
//                 onClick={() => {
//                   router.push("/courses");
//                 }}
//                 className="cursor-pointer bg-[#7ECA9D] text-white px-4 py-2 mt-2 md:mt-0 flex gap-2"
//               >
//                 <span>
//                   <ArrowIcon />
//                 </span>{" "}
//                 Explore More Courses
//               </button>
//             </div>
//           </div>

//           {/* Search and Filter Section */}
//           <div className="flex flex-col md:flex-row justify-between mt-10">
//             <div>
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="border rounded-md p-2 w-fit md:mb-0 dark:bg-[#0C0E2B] "
//               />
//             </div>
//             <div className="relative inline-block text-left pr-4 pb-6 mt-4">
//               <div>
//                 <button
//                   onClick={toggleDropdown}
//                   className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 dark:bg-[#0C0E2B]  bg-white text-sm font-medium text-[#5C6574] hover:bg-gray-50"
//                 >
//                   Program Title (a-z)
//                   <svg
//                     className="-mr-1 ml-2 h-5 w-5"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {isOpen && (
//                 <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg dark:bg-black bg-white ring-1 ring-black ring-opacity-5">
//                   <div
//                     className="py-1"
//                     role="menu"
//                     aria-orientation="vertical"
//                     aria-labelledby="options-menu"
//                   >
//                     <a
//                       href="#"
//                       className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
//                       role="menuitem"
//                     >
//                       Option 1
//                     </a>
//                     <a
//                       href="#"
//                       className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
//                       role="menuitem"
//                     >
//                       Option 2
//                     </a>
//                     <a
//                       href="#"
//                       className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
//                       role="menuitem"
//                     >
//                       Option 3
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row">
//             {/* Categories Section */}
//             <div className="w-full md:w-[30%] ">
//               <span className="text-[#5C6574] dark:text-white font-bold text-xl">
//                 Category
//               </span>
//               <CategoryFilter
//                 categories={categories}
//                 setSelectedCategory={setSelectedCategory}
//               />
//             </div>

//             {/* Courses Section */}
//             <div className="w-full md:w-[70%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
//               {allCourses?.map((course, index) => (
//                 <CourseCard key={index} course={course} />
//               ))}
//             </div>
//           </div>

//           {/* Pagination Section */}
//           <div className="flex justify-end ">
//             <div className="lg:w-[70%] w-full mt-4 mb-8  px-4 text-[#5C6574] border rounded-md border-[#5C6574]">
//               <Pagination totalPages={15} currentPage={1} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CoursesFilter;

"use client";
import { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";
import Pagination from "@/components/shared/pagination/Pagination";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";

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

const CoursesFilter = () => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const { getQuery, loading } = useGetQuery();

  // Fetch courses from API
  const fetchCourses = () => {
    const categoryQuery = selectedCategory ? selectedCategory : "";

    getQuery({
      url: apiUrls?.courses?.getAllCoursesWithLimits(
        currentPage,
        6,
        categoryQuery,
        "",
        "",
        "",
        searchTerm,
        false
      ),
      onSuccess: (data) => {
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
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.course_title &&
          course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter(
        (course) =>
          course.course_title &&
          course.course_title.toLowerCase() === selectedCategory.toLowerCase()
      );
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
  }, [currentPage, searchTerm, selectedCategory, sortOrder]);

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

  return (
    <section>
      <div className="min-h-screen bg-white dark:bg-screen-dark dark:text-white p-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7ECA9D] mb-4 md:mb-0">
              Skill Development Courses
            </h1>
            <div>
              <button
                onClick={() => {
                  router.push("/view-all-courses");
                }}
                className="cursor-pointer bg-[#7ECA9D] text-white px-4 py-2 mt-2 md:mt-0 flex gap-2"
              >
                <span>
                  <ArrowIcon />
                </span>{" "}
                Explore More Courses
              </button>
            </div>
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
            <div className="border border-[#CDCFD5] px-2 py-2 rounded-md w-full md:w-auto">
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
            </div>
            <div className="w-full md:w-3/4">
              <div className="w-full md:w-[100%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center">Loading...</div>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-[#5C6574]">
                    No courses found.
                  </div>
                )}
              </div>
              <div className="w-full mt-12 mb-8 px-4 text-[#5C6574] border rounded-md border-[#CDCFD5]">
                <Pagination
                  pages={totalPages}
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
