"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useRouter } from "next/navigation";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Loading from "@/app/loading";

const CoorporateNew_Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const { getQuery, loading } = useGetQuery();

  const [searchTitle, setSearchTitle] = useState("");
  const [limit] = useState(8);
  const [page] = useState(1);
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

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
          true
        ),
        onSuccess: (res) => {
          setCourses(res?.courses || []);
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
  }, [minFee, maxFee, searchTitle, courses]);

  const handleCardClick = (id) => {
    router.push(`/dashboards/coorporate-my-courses/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <h2 className="text-3xl dark:text-white">Enroll in New Course</h2>
        </div>
        <div>
          <a
            href="/dashboards/coorporate-enroll-new-courses"
            className="text-primaryColor hover:underline"
          >
            View All
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(filteredCourses.length > 0 ? filteredCourses : courses)
          .filter((course) => course.course_fee !== 0)
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

export default CoorporateNew_Courses;
