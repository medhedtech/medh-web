// "use client";
// import React, { useEffect, useState } from "react";
// import EnrollCoursesCard from "./EnrollCoursesCard";
// import { useRouter } from "next/navigation";
// import { FaArrowLeft } from "react-icons/fa";
// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";

// const StudentEnrollCourses = () => {
//   const router = useRouter();
//   const [enrollCourses, setEnrollCourses] = useState([]);
//   const { getQuery } = useGetQuery();
//   const studentId = localStorage.userId;

//   useEffect(() => {
//     getQuery({
//       url: `${apiUrls?.EnrollCourse?.getEnrolledCoursesByStudentId}/${studentId}`,
//       onSuccess: (data) => {
//         const courses = data.map((enrollment) => enrollment.course_id);
//         setEnrollCourses(courses);
//         console.log(courses, "Extracted Course Data");
//       },
//       onFail: (error) => {
//         console.error("Failed to fetch enrolled courses:", error);
//       },
//     });
//   }, []);

//   const handleCardClick = (id) => {
//     router.push(`/dashboards/my-courses/${id}`);
//   };

//   return (
//     <div className="container mx-auto p-8 mt-[-40px]">
//       <div className="flex justify-between items-center mb-4">
//         <div
//           onClick={() => {
//             router.push("/dashboards/my-courses");
//           }}
//           className="flex items-center gap-2"
//         >
//           <FaArrowLeft
//             className="cursor-pointer text-gray-700 dark:text-white"
//             size={20}
//           />
//           <h2 className="text-size-32 font-Open dark:text-white">
//             Enrolled Courses
//           </h2>
//         </div>
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
// export default StudentEnrollCourses;

"use client";
import React, { useEffect, useState } from "react";
import EnrollCoursesCard from "./EnrollCoursesCard";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const StudentEnrollCourses = () => {
  const router = useRouter();
  const [enrollCourses, setEnrollCourses] = useState([]);
  const { getQuery } = useGetQuery();
  const [studentId, setStudentId] = useState(null);

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
            .filter((course) => course);
          // .slice(0, 80);
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

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="container mx-auto p-8 mt-[-40px]">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={() => {
            router.push("/dashboards/my-courses");
          }}
          className="flex items-center gap-2"
        >
          <FaArrowLeft
            className="cursor-pointer text-gray-700 dark:text-white"
            size={20}
          />
          <h2 className="text-size-32 font-Open dark:text-white">
            Enrolled Courses
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

export default StudentEnrollCourses;
