"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Coorporate_EnrollCoursesCard from "./CoorporateEnrollCourseCard";

const CoorporateAdminEnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const { getQuery } = useGetQuery();

  const handleCardClick = (id) => {
    router.push(`/dashboards/coorporate-my-courses/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setEmployeeId(storedUserId);
    }
  }, []);

  // useEffect(() => {
  //   if (employeeId) {
  //     getQuery({
  //       url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateCoursesByCoorporateId}/${employeeId}`,
  //       onSuccess: (data) => {
  //         const courses = data
  //           .map((enrollment) => enrollment.course_id)
  //           .filter((course) => course)
  //           .slice(0, 4);
  //         setEnrollCourses(courses);
  //         console.log(data, "real Course Data");
  //         console.log(courses, "Extracted Course Data");
  //       },
  //       onFail: (error) => {
  //         console.error("Failed to fetch enrolled courses:", error);
  //       },
  //     });
  //   }
  // }, [employeeId]);

  useEffect(() => {
    // Fetch enrolled courses
    if (employeeId) {
      getQuery({
        url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateCoursesByCoorporateId}/${employeeId}`,
        onSuccess: async (data) => {
          // Map courses and fetch count for each course
          const courses = await Promise.all(
            data
              .map((enrollment) => enrollment.course_id)
              .filter((course) => course) // Ensure valid courses
              .slice(0, 4) // Limit to 4 courses
              .map(async (course) => {
                try {
                  // Fetch student count for each course
                  const response = await getQuery({
                    url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateStudentCoursesCountByEmployeeId}/${course._id}`,
                    skipStateUpdate: true, // Avoid overriding the state during nested API calls
                  });
                  return {
                    ...course,
                    studentCount: response?.count || 0, // Add student count
                  };
                } catch (error) {
                  console.error(
                    `Error fetching count for course ${course._id}:`,
                    error
                  );
                  return {
                    ...course,
                    studentCount: 0, // Default to 0 on error
                  };
                }
              })
          );
          setEnrollCourses(courses); // Update state with courses and counts
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
        },
      });
    }
  }, [employeeId]);

  return (
    <div className="container mx-auto mt-[-40px] p-8">
      <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
        <h2 className="text-size-32 font-Open dark:text-white">
          Enrolled Courses
        </h2>
        <a
          href="/dashboards/coorporate-all-enrolled-courses"
          className="text-green-500 text-sm font-semibold hover:underline "
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {enrollCourses.map((course, i) => {
          console.log(course);
          return (
            <Coorporate_EnrollCoursesCard
              key={course._id}
              title={course.course_title}
              image={course.course_image}
              isLive={course.course_tag === "Live"}
              totalEnrolled={course.studentCount}
              progress={40}
              onClick={() => handleCardClick(course._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CoorporateAdminEnrollCourses;
