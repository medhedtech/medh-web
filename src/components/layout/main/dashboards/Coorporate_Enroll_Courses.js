// "use client";
// import React, { useEffect, useState } from "react";
// import EnrollCoursesCard from "./EnrollCoursesCard";
// import { useRouter } from "next/navigation";
// import useGetQuery from "@/hooks/getQuery.hook";
// import { apiUrls } from "@/apis";
// import Coorporate_EnrollCoursesCard from "./CoorporateEnrollCourseCard";

// const CoorporateEnrollCourses = () => {
//   const router = useRouter();
//   const [enrollCourses, setEnrollCourses] = useState([]);
//   const [coorporateId, setCoorporateId] = useState(null);
//   const { getQuery } = useGetQuery();

//   const handleCardClick = (id) => {
//     router.push(`/dashboards/coorporate-my-courses/${id}`);
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUserId = localStorage.getItem("userId");
//       setCoorporateId(storedUserId);
//     }
//   }, []);

//   useEffect(() => {
//     if (coorporateId) {
//       getQuery({
//         url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateCoursesByCoorporateId}/${coorporateId}`,
//         onSuccess: (data) => {
//           const courses = data
//             .map((enrollment) => enrollment.course_id)
//             .filter((course) => course)
//             .slice(0, 4);
//           setEnrollCourses(courses);
//           console.log(data, "real Course Data");
//           console.log(courses, "Extracted Course Data");
//         },
//         onFail: (error) => {
//           console.error("Failed to fetch enrolled courses:", error);
//         },
//       });
//     }
//   }, [coorporateId]);

//   return (
//     <div className="container mx-auto mt-[-40px] p-8">
//       <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
//         <h2 className="text-size-32 font-Open dark:text-white">
//           Enrolled Courses Coorporate
//         </h2>
//         <a
//           href="/dashboards/coorporate-all-enrolled-courses"
//           className="text-green-500 text-sm font-semibold hover:underline "
//         >
//           View All
//         </a>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {enrollCourses.map((course, i) => {
//           console.log(course);
//           return (
//             <Coorporate_EnrollCoursesCard
//               key={course._id}
//               title={course.course_title}
//               image={course.course_image}
//               isLive={course.course_tag === "Live"}
//               progress={40}
//               onClick={() => handleCardClick(course._id)}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CoorporateEnrollCourses;

"use client";
import React, { useEffect, useState } from "react";
import Coorporate_EnrollCoursesCard from "./CoorporateEnrollCourseCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const CoorporateEnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [coorporateId, setCoorporateId] = useState(null);
  const { getQuery } = useGetQuery();

  const handleCardClick = (id) => {
    router.push(`/dashboards/coorporate-my-courses/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setCoorporateId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (coorporateId) {
      getQuery({
        url: `${apiUrls?.CoorporateEnrollCourse?.getCoorporateCoursesByCoorporateId}/${coorporateId}`,
        onSuccess: (data) => {
          const courses = data
            .map((enrollment) => enrollment.course_id)
            .filter((course) => course)
            .slice(0, 16);
          setEnrollCourses(courses);
          console.log(data, "real Course Data");
          console.log(courses, "Extracted Course Data");
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
        },
      });
    }
  }, [coorporateId]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-semibold text-[#282F3E]">
          Enrolled Courses
        </h2>
        <a
          href="/dashboards/coorporate-all-enrolled-courses"
          className="text-sm font-medium text-green-500 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {enrollCourses.map((course, i) => (
          <Coorporate_EnrollCoursesCard
            key={course._id}
            title={course.course_title}
            instructor={course.instructor || "Sandeep Chauhan"}
            image={course.course_image}
            totalEnrolled={course.total_enrolled || "20"}
            onClick={() => handleCardClick(course._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CoorporateEnrollCourses;
