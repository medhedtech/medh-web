// "use client";
// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
// import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
// import teacherImage3 from "@/assets/images/teacher/teacher__3.png";
// import teacherImage4 from "@/assets/images/teacher/teacher__4.png";
// import teacherImage5 from "@/assets/images/teacher/teacher__5.png";

// const PopularInstructors = () => {
//   const router = useRouter();
//   const { getQuery, loading } = useGetQuery();
//   const [courses, setCourses] = useState([]);

//   // Fetch courses from API
//   useEffect(() => {
//     const fetchCourses = async () => {
//       await getQuery({
//         url: apiUrls?.courses?.getAllCourses,
//         onSuccess: (data) => {
//           if (Array.isArray(data)) {
//             const formattedCourses = data.map((course, index) => ({
//               id: course._id,
//               name: course.course_title,
//               description: course.course_description,
//               avatar: [
//                 teacherImage1,
//                 teacherImage2,
//                 teacherImage3,
//                 teacherImage4,
//                 teacherImage5,
//               ][index % 5],
//               reviews: `${Math.floor(Math.random() * 1000 + 100)} reviews`,
//               students: `${Math.floor(Math.random() * 500 + 50)} students`, // Generate random student count
//               courses: `${course.no_of_Sessions} sessions`, // Use sessions as course count
//             }));
//             setCourses(formattedCourses);
//           }
//         },
//       });
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="popular-instructors">
//       <h2>Popular Instructors</h2>
//       <div className="instructor-grid">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           courses.map((instructor) => (
//             <div
//               key={instructor.id}
//               className="instructor-card"
//               onClick={() => router.push(`/courses/${instructor.id}`)}
//             >
//               <Image
//                 src={instructor.avatar}
//                 alt={instructor.name}
//                 className="instructor-avatar"
//               />
//               <h3>{instructor.name}</h3>
//               <p>{instructor.description}</p>
//               <p>{instructor.reviews}</p>
//               <p>{instructor.students}</p>
//               <p>{instructor.courses}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PopularInstructors;




import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import teacherImage3 from "@/assets/images/teacher/teacher__3.png";
import teacherImage4 from "@/assets/images/teacher/teacher__4.png";
import teacherImage5 from "@/assets/images/teacher/teacher__5.png";
import Image from "next/image";
import Link from "next/link";

const PopularInstructors = () => {
  const instructors = [
    {
      id: 1,
      name: "Sanki Jho",
      description: "Foundation course to understand about software",
      avatar: teacherImage1,
      reviews: "25,895",
      students: "692",
      courses: "15",
    },
    {
      id: 2,
      name: "Nidmjae Mollin",
      description: "Foundation course to understand about software",
      avatar: teacherImage2,
      reviews: "21,895",
      students: "95",
      courses: "10",
    },
    {
      id: 3,
      name: "Nidmjae Mollin",
      description: "Foundation course to understand about software",
      avatar: teacherImage3,
      reviews: "17,895",
      students: "325",
      courses: "20",
    },
    {
      id: 4,
      name: "Sndi Jac",
      description: "Foundation course to understand about software",
      avatar: teacherImage4,
      reviews: "17,895",
      students: "325",
      courses: "45",
    },
    {
      id: 5,
      name: "Sndi Jac",
      description: "Foundation course to understand about software",
      avatar: teacherImage5,
      reviews: "17,895",
      students: "325",
      courses: "45",
    },
  ];
  return (
    <div className="p-10px md:px-10 font-Poppins md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-[18px] font-semibold text-black dark:text-white">
          Recent Course
        </h2>
        <div>
          <h3 className="cursor-pointer text-xl md:text-[16px] font-normal text-gray-800 dark:text-white">
            See More...
          </h3>
        </div>
      </div>

      <div className="w-full border-t-2 border-gray-200 mb-4"></div>

      {/* instrutor */}
      <ul>
        {instructors?.map(
          (
            { id, name, description, avatar, reviews, students, courses },
            idx
          ) => (
            <li
              key={idx}
              className={`flex items-center flex-wrap  ${
                idx === instructors?.length - 1
                  ? "pt-15px"
                  : "py-15px border-b border-borderColor dark:border-borderColor-dark"
              }`}
            >
              {/* avatar */}
              <div className="max-w-full md:max-w-1/5 pr-10px">
                <Image src={avatar} alt="" className="w-full rounded-full" />
              </div>
              {/* details */}
              <div className="max-w-full md:max-w-4/5 pr-10px">
                <div>
                  <h5 className="text-[18px] leading-1 font-semibold text-contentColor dark:text-contentColor-dark mb-5px">
                    {description}
                  </h5>
                  <div className="flex items-center text-sm text-darkblack dark:text-darkblack-dark gap-x-4 leading-1.8">
                    <p className="flex items-center gap-x-1">
                      <i className="icofont-student-alt"></i>
                      {name}
                    </p>
                    <p className="flex items-center gap-x-1">
                      <i className="icofont-video-alt"></i>
                      {students} lesson
                    </p>
                  </div>

                  <div className="flex items-center text-sm text-darkblack dark:text-darkblack-dark gap-x-4 leading-1.8">
                    <p className="flex items-center gap-x-1">
                      <i className="icofont-video-alt"></i>1 hr 30 min
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default PopularInstructors;
