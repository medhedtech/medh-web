// "use client";
// import React, { useEffect, useState } from "react";
// import EnrollCoursesCard from "./EnrollCoursesCard";
// import reactImg from "@/assets/images/courses/React.jpeg";
// import hockey from "@/assets/images/courses/hockey.jpeg";
// import os from "@/assets/images/courses/os.jpeg";
// import javascript from "@/assets/images/courses/javaScript.jpeg";
// import { useRouter } from "next/navigation";
// import useGetQuery from "@/hooks/getQuery.hook";
// import { apiUrls } from "@/apis";

// const EnrollCourses = () => {
//   const router = useRouter();
//   const [enrollCourses, setEnrollCourses] = useState([]);
//   const { getQuery, loading } = useGetQuery();

//   const handleCardClick = (id) => {
//     router.push(`/dashboards/my-courses/${id}`);
//   };

//   const studentId = localStorage.getItem("userId");

//   useEffect(() => {
//     getQuery({
//       url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
//       onSuccess: (data) => {
//         // Extract course data from the response
//         const courses = data
//           .map((enrollment) => enrollment.course_id)
//           .slice(0, 4);
//         setEnrollCourses(courses);
//         console.log(courses, "Extracted Course Data");
//       },
//       onFail: (error) => {
//         // Log the error or handle it
//         console.error("Failed to fetch enrolled courses:", error);
//       },
//     });
//   }, []);

//   return (
//     <div className="container mx-auto mt-[-40px] p-8">
//       <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
//         <h2 className="text-size-32 font-Open dark:text-white">
//           Enrolled Courses
//         </h2>
//         <a
//           href="/dashboards/enrolled-courses"
//           className="text-green-500 text-sm font-semibold hover:underline "
//         >
//           View All
//         </a>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {enrollCourses.map((course) => (
//           <EnrollCoursesCard
//             key={course._id}
//             title={course.course_title}
//             image={course.course_image}
//             isLive={course.course_tag === "Live"}
//             progress={40}
//             onClick={() => handleCardClick(course._id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
// export default EnrollCourses;

"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const EnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const { getQuery, loading } = useGetQuery();

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setStudentId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      getQuery({
        url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
        onSuccess: (data) => {
          const courses = data
            .map((enrollment) => enrollment.course_id)
            .filter((course) => course)
            .slice(0, 4);
          setEnrollCourses(courses);
          console.log(data, "real Course Data");
          console.log(courses, "Extracted Course Data");
        },
        onFail: (error) => {
          console.error("Failed to fetch enrolled courses:", error);
        },
      });
    }
  }, [studentId]);

  return (
    <div className="container mx-auto mt-[-40px] p-8">
      <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
        <h2 className="text-size-32 font-Open dark:text-white">
          Enrolled Courses
        </h2>
        <a
          href="/dashboards/enrolled-courses"
          className="text-green-500 text-sm font-semibold hover:underline "
        >
          View All
        </a>
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

export default EnrollCourses;
