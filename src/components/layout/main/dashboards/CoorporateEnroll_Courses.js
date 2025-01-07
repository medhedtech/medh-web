"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const CoorporateEnroll_Courses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setEmployeeId(storedUserId);
    }
  }, []);

  // useEffect(() => {
  //   if (employeeId) {
  //     getQuery({
  //       url: `${apiUrls?.CoorporateEnrollCourse?.getEnrolledCoursesByEmployeeId}/${employeeId}`,
  //       onSuccess: (data) => {
  //         const courses = data.courses?.slice(0, 8);
  //         setEnrollCourses(courses);
  //         console.log(data, "Real Course Data");
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
                .slice(0, 40) // Limit to 40 courses
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


  const handleCardClick = (id) => {
    router.push(`/dashboards/coorporate-my-courses/${id}`);
  };

  return (
    <div className="container mx-auto p-8 mt-[-40px]">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={() => {
            router.back();
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 dark:text-white"
            size={20}
          />
          <h2 className="text-size-32 font-Open dark:text-white">
            Enrolled Courses employee
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {enrollCourses.map((course, i) => {
          console.log(course);
          return (
            <EnrollCoursesCard
              key={course._id}
              title={course.course_title}
              image={course.course_image}
              isLive={course.course_tag === "Live"}
              progress={40}
              onClick={() => handleCardClick(course._id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CoorporateEnroll_Courses;
