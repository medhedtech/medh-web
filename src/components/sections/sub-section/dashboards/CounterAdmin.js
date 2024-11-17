"use client";
import React, { useState, useEffect } from "react";
import counter from "@/assets/images/counter/icons_badge.svg";
import counter2 from "@/assets/images/counter/card-1.png";
import counter3 from "@/assets/images/counter/card-2.png";
import counter4 from "@/assets/images/counter/card-3.png";
import counter5 from "@/assets/images/counter/card-4.png";
import counter6 from "@/assets/images/counter/card-5.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const CounterAdmin = () => {
  const { getQuery } = useGetQuery();
  const [counts, setCounts] = useState({
    enrolledCourses: 0,
    activeStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    corporateEmployees: 0,
    schools: 0,
  });

  // Fetch Counts Data from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        getQuery({
          url: apiUrls?.adminDashboard?.getDashboardCount,
          onSuccess: (response) => {
            setCounts(response?.counts || {});
          },
          onFail: () => {
            console.log("Failed to fetch counts data");
          },
        });
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const dashboardCounts = [
    {
      name: "Enrolled Courses",
      image: counter,
      data: counts.enrolledCourses,
      symbol: "+",
    },
    {
      name: "Active Students",
      image: counter2,
      data: counts.activeStudents,
      symbol: "+",
    },
    {
      name: "Total Instructors ",
      image: counter3,
      data: counts.totalInstructors,
      symbol: "+",
    },
    {
      name: "Total Courses",
      image: counter4,
      data: counts.totalCourses,
      symbol: "+",
    },
    {
      name: "Corporate Employee",
      image: counter5,
      data: counts.corporateEmployees,
      symbol: "",
    },
    {
      name: "School/Institute",
      image: counter6,
      data: counts.schools,
      symbol: "",
    },
  ];

  return (
    <CounterDashboard counts={dashboardCounts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterAdmin;

// import counter from "@/assets/images/counter/icons_badge.svg";
// import counter1 from "@/assets/images/counter/card-1.png";
// import counter2 from "@/assets/images/counter/card-1.png";
// import counter3 from "@/assets/images/counter/card-2.png";
// import counter4 from "@/assets/images/counter/card-3.png";
// import counter5 from "@/assets/images/counter/card-4.png";
// import counter6 from "@/assets/images/counter/card-5.png";
// import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
// import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
// const CounterAdmin = () => {
//   const counts = [
//     {
//       name: "Enrolled Courses",
//       image: counter,
//       data: 100,
//       symbol: "+",
//     },
//     {
//       name: "Active Students",
//       image: counter2,
//       data: 50,
//       symbol: "+",
//     },
//     {
//       name: "Total Instructors ",
//       image: counter3,
//       data: 50,
//       symbol: "+",
//     },
//     {
//       name: "Total Courses",
//       image: counter4,
//       data: 150,
//       symbol: "+",
//     },
//     {
//       name: "Cooporate Employee",
//       image: counter5,
//       data: 30,
//       symbol: "",
//     },
//     {
//       name: "School/Institute",
//       image: counter6,
//       data: 10,
//       symbol: "",
//     },
//   ];
//   return (
//     <CounterDashboard counts={counts}>
//       <HeadingDashboard>Dashboard</HeadingDashboard>
//     </CounterDashboard>
//   );
// };

// export default CounterAdmin;
