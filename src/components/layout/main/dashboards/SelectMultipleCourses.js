import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CouseDummyImages from "@/assets/images/courses/image4.png";

const SelectMultipleCourses = ({
  handleCourse,
  errors,
  selectedCourses,
  setSelectedCourses,
  field
}) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  console.log("Selected Courses: ", field);

  const dropdownRef = useRef(null);
  const { getQuery } = useGetQuery();

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const filteredCourses = courses?.filter((course) =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //   const handleCheckboxChange = (course) => {
  //     const updatedSelected = selectedCourses.includes(course)
  //       ? selectedCourses.filter((c) => c !== course) // Remove if already selectedCourses
  //       : [...selectedCourses, course]; // Add if not selectedCourses

  //     console.log("selected Courses:", updatedSelected);
  //     setSelectedCourses(updatedSelected);
  //     handleCourse(updatedSelected);
  //   };

  const handleCheckboxChange = (courseId) => {
    // const updatedSelected = selectedCourses.includes(courseId)
    //   ? selectedCourses.filter((id) => id !== courseId)
    //   : [...selectedCourses, courseId];

    const updatedSelected = selectedCourses.includes(courseId)
      ? selectedCourses.filter((id) => id !== courseId)
      : [...selectedCourses, courseId];

    console.log("Selected Course IDs:", updatedSelected);
    setSelectedCourses(updatedSelected);
    handleCourse(updatedSelected);
    // field.onChange(updatedSelected);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchAllCourses();
    if(selectedCourses.length > 0) {
      handleCourse(selectedCourses);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAllCourses = () => {
    try {
      getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (res) => {
          console.log("API Response: ", res);
          setCourses(res || []);
        },
        onFail: (err) => {
          console.error("Failed to fetch courses: ", err);
        },
      });
    } catch (err) {
      console.error("Error fetching courses: ", err);
    }
  };

  console.log("Courses: ", courses);
  console.log("Filtered Courses: ", filteredCourses);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-normal mb-1">
        Related Courses <span className="text-red-500">*</span>
      </label>
      <div className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600">
        {/* Chips Section */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCourses.length > 0 ? (
            selectedCourses.map((id) => {
              const course = courses.find((c) => c._id === id);

              if (!course) return null;

              return (
                <div
                  key={id}
                  className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full shadow-md text-sm hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  <span className="truncate">{course.course_title}</span>
                  <button
                    className="pl-2 text-yellow hover:text-black focus:outline-none"
                    onClick={() => handleCheckboxChange(id)}
                    title="Remove Course"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          ) : (
            <span className="text-gray-500 text-[13px]">
              No Related Courses Selected
            </span>
          )}
        </div>

        {/* Dropdown Button */}
        <button
          className="p-2 border rounded-lg text-left w-full dark:bg-inherit text-gray-600"
          // className="w-full text-left mt-0 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue"
          onClick={toggleDropdown}
        >
          {dropdownOpen ? "Close Dropdown" : "Select Courses"}
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 left-0 top-20 bg-white border border-gray-600 rounded-lg w-full shadow-xl">
            <input
              type="text"
              className="w-full p-2 border-b focus:outline-none rounded-lg"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="max-h-56 overflow-auto">
              {filteredCourses?.length > 0 ? (
                filteredCourses.map((course) => (
                  <li
                    key={course._id}
                    className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCheckboxChange(course._id)}
                      className="w-6 h-6 cursor-pointer accent-blue-500 mr-2"
                    />
                    <Image
                      src={course.course_image || CouseDummyImages}
                      alt={course.course_title}
                      width={42}
                      height={42}
                      className="rounded-full h-[2rem] w-[2rem]"
                    />
                    {course.course_title}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {errors.related_courses && (
        <p className="text-red-500 text-xs">{errors.related_courses.message}</p>
      )}
    </div>
  );
};

export default SelectMultipleCourses;
