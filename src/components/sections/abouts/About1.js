// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import aidata from "@/assets/images/about/ai-data-science.png";
// import { apiUrls } from "@/apis";
// import usePostQuery from "@/hooks/postQuery.hook";
// import useGetQuery from "@/hooks/getQuery.hook";

// const About1 = () => {
//   const [courses, setCourses] = useState([]);
//   const { getQuery } = useGetQuery();
//   const [limit] = useState(4);
//   const [page] = useState(1);

//   useEffect(() => {
//     const fetchCourses = () => {
//       getQuery({
//         url: apiUrls?.courses?.getAllCoursesWithLimits(
//           page,
//           limit,
//           "",
//           "",
//           "Live Courses",
//           "Published",
//           "",
//           "",
//           "",
//           false
//         ),
//         onSuccess: (res) => {
//           console.log("Response is:", res);
//           setCourses(res?.courses || []);
//         },
//         onFail: (err) => {
//           console.error("Error fetching courses:", err);
//         },
//       });
//     };
//     fetchCourses();
//   }, [page, limit]);

//   return (
//     <section className="dark:bg-screen-dark">
//       <div className="container mx-auto px-4 py-10 text-center">
//         <h2 className="text-2xl sm:text-3xl text-[#7ECA9D] font-bold mb-4 dark:text-white">
//           Featured LIVE Courses
//         </h2>
//         <p className="text-gray-600 mb-8 max-w-full sm:max-w-md lg:max-w-2xl text-center mx-auto px-4 dark:text-gray-300">
//           Medh&#39;s expertly crafted skill development courses empower you to
//           excel in life. Master industry-relevant skills and conquer modern
//           challenges. Embrace the future – Invest in your skills now.
//         </p>

//         {/* Check if courses are valid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {courses?.slice(0, 4)?.map((course) => (
//             <Link href={`/course-detailed/${course?._id}`} key={course?._id}>
//               {/* <Link href={"/courses"} key={course?._id}> */}
//               <div className="bg-white border dark:border-whitegrey shadow-2xl flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300 h-full">
//                 <div className="relative w-full h-48">
//                   <Image
//                     src={course?.course_image || aidata}
//                     alt={course?.course_title}
//                     fill
//                     objectFit="cover"
//                     className="w-full h-full"
//                   />
//                 </div>
//                 <div className="py-4 px-6 flex-grow dark:bg-screen-dark">
//                   <h3 className="text-lg font-bold text-[#5C6574] dark:text-whitegrey3">
//                     {course?.course_title}
//                   </h3>
//                   {/* <p className="text-sm text-gray-500">
//                     {course?.course_category}
//                   </p> */}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default About1;

// // "use client";
// // import Image from "next/image";
// // import Link from "next/link";
// // import React from "react";
// // import aidata from "@/assets/images/about/ai-data-science.png";
// // import digital from "@/assets/images/about/digital-marketing.png";
// // import personality from "@/assets/images/about/personality-development.png";
// // import vedic from "@/assets/images/about/vedic-mathematics.png";
// // import useIsTrue from "@/hooks/useIsTrue";

// // const About1 = ({ children, image, hideCounter }) => {
// //   const isHome9 = useIsTrue("/home-9");
// //   const isHome9Dark = useIsTrue("/home-9-dark");

// //   const courses = [
// //     {
// //       title: "Artificial Intelligence and Data Science",
// //       imageSrc: aidata,
// //       path: "/ai-data-science",
// //     },
// //     {
// //       title: "Digital Marketing with Data Analytics",
// //       imageSrc: digital,
// //       path: "/digital-marketing-with-data-analytics-course",
// //     },
// //     {
// //       title: "Personality Development",
// //       imageSrc: personality,
// //       path: "/personality-development-course",
// //     },
// //     {
// //       title: "Vedic Mathematics",
// //       imageSrc: vedic,
// //       path: "/vedic-mathematics",
// //     },
// //   ];

// //   return (
// //     <section className="dark:bg-screen-dark">
// //       <div className="container  mx-auto px-4 py-10 text-center">
// //         <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">
// //           Featured LIVE Courses
// //         </h2>
// //         <p className="text-gray-600 mb-8 max-w-full sm:max-w-md lg:max-w-2xl text-center mx-auto px-4 dark:text-gray-300">
// //           Medh’s expertly crafted skill development courses empower you to excel
// //           in life. Master industry-relevant skills and conquer modern
// //           challenges. Embrace the future – Invest in your skills now.
// //         </p>

// //         {/* Grid Section */}
// //         <div className="grid grid-cols gap-6 sm:grid-cols-2 lg:grid-cols-4">
// //           {courses.map((course, index) => (
// //             <Link href={course.path} key={index}>
// //               <div className="bg-white   border dark:border-whitegrey  shadow-2xl flex flex-col overflow-hidden hover:scale-105 transition transform duration-300 h-full">
// //                 <div className="relative w-full h-48">
// //                   <Image
// //                     src={course.imageSrc}
// //                     alt={course.title}
// //                     layout="fill" // Ensure the image fills the container
// //                     objectFit="cover" // Crop the image to fit
// //                   />
// //                 </div>
// //                 <div className="py-4 px-6 flex-grow dark:bg-screen-dark">
// //                   <h3 className="text-lg font-bold text-[#5C6574] dark:text-whitegrey3">
// //                     {course.title}
// //                   </h3>
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default About1;

"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import aidata from "@/assets/images/about/ai-data-science.png";
import digital from "@/assets/images/about/digital-marketing.png";
import personality from "@/assets/images/about/personality-development.png";
import vedic from "@/assets/images/about/vedic-mathematics.png";

const About1 = () => {
  // Static data for courses
  const courses = [
    {
      _id: "1",
      course_title: "Artificial Intelligence and Data Science",
      course_image: aidata,
      path: "/ai-and-data-science-course",
    },
    {
      _id: "2",
      course_title: "Digital Marketing with Data Analytics",
      course_image: digital,
      path: "/digital-marketing-with-data-analytics-course",
    },
    {
      _id: "3",
      course_title: "Personality Development",
      course_image: personality,
      path: "/personality-development-course",
    },
    {
      _id: "4",
      course_title: "Vedic Mathematics",
      course_image: vedic,
      path: "/vedic-mathematics-course",
    },
  ];

  return (
    <section className="dark:bg-screen-dark py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl text-[#7ECA9D] font-bold mb-6 dark:text-white">
          Featured LIVE Courses
        </h2>
        <p className="text-gray-600 mb-10 max-w-full sm:max-w-md lg:max-w-2xl text-center mx-auto px-4 dark:text-gray-300">
          Medh&#39;s expertly crafted skill development courses empower you to
          excel in life. Master industry-relevant skills and conquer modern
          challenges. Embrace the future - Invest in your skills now.
        </p>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <Link href={course.path} key={course._id}>
              <div
                className="bg-white border border-gray-300 dark:border-whitegrey shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-md overflow-hidden h-full transform hover:scale-105 transition-transform duration-500 ease-out"
                style={{
                  height: "100%",
                }}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.course_image}
                    alt={course.course_title}
                    fill
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <div className="py-4 px-6 text-center flex flex-col justify-between h-full">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    {course.course_title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About1;
