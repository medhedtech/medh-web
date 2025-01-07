"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import CourseCard from "@/components/shared/dashboards/CourseCard";

const StudentNewCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();

  const [priceFilter, setPriceFilter] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  const [limit] = useState(20);
  const [page] = useState(1);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = () => {
      getQuery({
        url: apiUrls?.courses?.getAllCoursesWithLimits(
          page,
          limit,
          "",
          "Live",
          "",
          "Published",
          "",
          "",
          "",
          // true
        ),
        onSuccess: (res) => {
          setCourses(res?.courses || []);
          setFilteredCourses(res?.courses || []); // Initialize filteredCourses
        },
        onFail: (err) => {
          console.error("Error fetching courses:", err);
        },
      });
    };
    fetchCourses();
  }, [page, limit]);

  // Filter Courses
  useEffect(() => {
    const applyFilter = () => {
      const filtered = courses.filter((course) => {
        const coursePrice = course?.course_fee || 0;
        const isAboveMin = minFee ? coursePrice >= minFee : true;
        const isBelowMax = maxFee ? coursePrice <= maxFee : true;
        const matchesTitle = course?.course_title
          ?.toLowerCase()
          ?.includes(searchTitle.toLowerCase());

        // Filter out courses with tag "Pre-Recorded" or "Free"
        const isValidCourseTag =
          course?.course_tag !== "Pre-Recorded" &&
          course?.course_tag !== "Free";

        return isAboveMin && isBelowMax && matchesTitle && isValidCourseTag;
      });
      setFilteredCourses(filtered);
    };
    applyFilter();
  }, [priceFilter, minFee, maxFee, searchTitle, courses]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "lessThan500") {
      setMinFee(0);
      setMaxFee(500);
    } else if (value === "500to1000") {
      setMinFee(500);
      setMaxFee(1000);
    } else if (value === "moreThan1000") {
      setMinFee(1000);
      setMaxFee(Infinity);
    } else {
      setMinFee("");
      setMaxFee("");
    }
    setPriceFilter(value);
  };

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="mx-auto mt-[-40px] p-8">
      <div className="flex justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/dashboards/student-dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FaArrowLeft className="text-gray-700 dark:text-white" size={20} />
            <h2 className="text-3xl dark:text-white">Enroll in New Course</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search by title"
            className="dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] px-3 py-1"
          />
          <div className="relative">
            <select
              value={priceFilter}
              onChange={handlePriceChange}
              className="appearance-none dark:bg-inherit border border-[#BDB7B7] text-[#808080] outline-none rounded-[20px] pr-7 pl-3 py-1"
            >
              <option value="">All Prices</option>
              <option value="lessThan500">Less than 500</option>
              <option value="500to1000">500 - 1000</option>
              <option value="moreThan1000">More than 1000</option>
            </select>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#808080]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(filteredCourses.length > 0 ? filteredCourses : courses)
          .filter((course) => course.course_fee !== 0) // Exclude courses with fee 0
          .map((course) => (
            <CourseCard
              key={course._id || course.id}
              {...course}
              onClick={() => handleCardClick(course._id || course.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default StudentNewCourses;
