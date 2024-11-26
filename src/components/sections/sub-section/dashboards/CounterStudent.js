"use client";
import { useEffect, useState } from "react";
import counter1 from "@/assets/images/counter/books.png";
import counter2 from "@/assets/images/counter/Live.png";
import counter3 from "@/assets/images/counter/Student.png";
import CounterStudentdashboard from "@/components/shared/dashboards/CounterStudentdashboard";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const CounterStudent = () => {
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

  // Fetch counts data once studentId is available
  useEffect(() => {
    if (studentId) {
      const fetchCounts = async () => {
        try {
          const enrollResponse = await getQuery({
            url: `${apiUrls?.EnrollCourse?.getCountByStudentId}/${studentId}`,
          });
          const membershipResponse = await getQuery({
            url: `${apiUrls?.Membership?.getSelfPackedCount}/${studentId}`,
          });

          if (enrollResponse && membershipResponse) {
            setCounts({
              enrolledCourses: enrollResponse?.totalEnrollments || 0,
              liveCourses: enrollResponse?.liveCoursesCount || 0,
              selfPacedCourses: membershipResponse?.totalMemberships || 0,
            });
          } else {
            console.log("No response from API");
          }
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
    {
      name: "Self-paced Courses",
      image: counter3,
      data: counts.selfPacedCourses,
    },
  ];

  return <CounterStudentdashboard counts={dashboardCounts} />;
};

export default CounterStudent;
