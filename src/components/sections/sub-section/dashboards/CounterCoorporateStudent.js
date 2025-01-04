"use client";
import { useEffect, useState } from "react";
import counter1 from "@/assets/images/counter/books.png";
import counter2 from "@/assets/images/counter/Live.png";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import CoorporateCounterStudentdashboard from "@/components/shared/dashboards/CounterCoorporateStudentDashboard";

const CoorporateCounterStudent = () => {
  const { getQuery } = useGetQuery();
  const [counts, setCounts] = useState({
    enrolledCourses: 0,
    liveCourses: 0,
    selfPacedCourses: 0,
  });
  const [studentId, setStudentId] = useState(null);

  // Retrieve student ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const student_id = localStorage.getItem("userId");
      if (student_id) {
        setStudentId(student_id);
      } else {
        console.log("Student ID not found in localStorage");
      }
    }
  }, []);

  // Fetch counts data using the new API endpoint once studentId is available
  useEffect(() => {
    if (studentId) {
      const fetchCounts = async () => {
        try {
          const response = await getQuery({
            url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateCountByCoorporateStudentId}/${studentId}`,
          });

          const { totalEnrollments, liveCoursesCount, selfPacedCoursesCount } =
            response || {};

          setCounts({
            enrolledCourses: totalEnrollments || 0,
            liveCourses: liveCoursesCount || 0,
            selfPacedCourses: selfPacedCoursesCount || 0,
          });
        } catch (error) {
          console.error("Failed to fetch counts:", error);
        }
      };

      fetchCounts();
    }
  }, [studentId]);

  // Prepare dashboard data
  const dashboardCounts = [
    {
      name: "Enrolled Courses",
      image: counter1,
      data: counts.enrolledCourses,
    },
    {
      name: "Live Courses",
      image: counter2,
      data: counts.liveCourses,
    },
  ];

  return <CoorporateCounterStudentdashboard counts={dashboardCounts} />;
};

export default CoorporateCounterStudent;
