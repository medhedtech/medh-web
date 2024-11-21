// "use client";
// import React from 'react'
// import CardImg1 from "./../../../assets/images/digital-marketing/card-1.svg";
// import CardImg2 from "./../../../assets/images/personality/courseimg2.jpeg";
// import CardImg3 from "./../../../assets/images/digital-marketing/card-3.svg";
// import CourseCard from "../courses/CourseCard";
// import Registration from "../registrations/Registration";

// function DigiMarketingCource() {

//     const courses = [
//         {
//           title: "Advanced Certificate in",
//           label: "Digital Marketing with Data Analytics",
//           duration: "8 Months Course",
//           image: CardImg1,
//         },
//         {
//             title: "Foundation Certificate in",
//             label: "Digital Marketing with Data Analytics",
//             duration: "4 Months Course",
//           image: CardImg2,
//         },
//         {
//           title: "Executive Diploma in",
//           label: "Digital Marketing with Data Analytics",
//           duration: "12 Months Course",
//           image: CardImg3,
//         },
//       ];
//   return (
//     <>
//        <div className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col pb-14">
//       <h1 className="text-center text-[#5C6574] md:text-3xl text-2xl font-bold py-5 dark:text-gray50 ">
//       Course Options in Digital Marketing with Data Analytics
//       </h1>
//       <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  text-[#5C6574]">
//         {courses.map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>
//     </div>
//       <Registration/>
//     </>
//   )
// }

// export default DigiMarketingCource

"use client";
import React, { useEffect, useState } from "react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import CourseCard from "../courses/CourseCard";
// import Registration from "../registrations/Registration";
import ExploreJourney from "../explore-journey/Enroll-Form";

function DigiMarketingCource() {
  const { getQuery } = useGetQuery();
  const [digitalMarketingCourses, setDigitalMarketingCourses] = useState([]);

  // Fetch Digital Marketing courses from API
  const fetchDigitalMarketingCourses = () => {
    getQuery({
      url: apiUrls.courses.getAllCoursesWithLimits(
        1,
        10,
        "",
        "",
        "",
        "",
        "Digital Marketing with Data Analytics",
        "",
        false
      ),
      onSuccess: (data) => {
        const filtered = (data?.courses || []).slice(0, 3);
        setDigitalMarketingCourses(filtered);
      },
      onFail: (error) => {
        console.error("Error fetching Digital Marketing courses:", error);
      },
    });
  };

  useEffect(() => {
    fetchDigitalMarketingCourses();
  }, []);

  return (
    <>
      <div id="courses-section" className="w-full bg-white dark:bg-screen-dark h-auto py-6 flex justify-center items-center flex-col pb-14">
        <h1 className="text-center text-[#5C6574] md:text-3xl text-2xl font-bold py-5 dark:text-gray50">
          Course Options in Digital Marketing with Data Analytics
        </h1>
        <div className="md:w-[80%] w-[88%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[#5C6574]">
          {digitalMarketingCourses.length > 0 ? (
            digitalMarketingCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p>No courses found for Digital Marketing with Data Analytics.</p>
          )}
        </div>
      </div>
      {/* <Registration /> */}
      <ExploreJourney
        mainText="Explore the Dynamic Fusion of Digital Marketing with Data Analytics Course!"
        subText="Enroll Now !"
      />
    </>
  );
}

export default DigiMarketingCource;
