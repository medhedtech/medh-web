"use client";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useEffect, useState } from "react";
import teacherImage1 from "@/assets/images/teacher/teacher__1.png";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import teacherImage3 from "@/assets/images/teacher/teacher__3.png";
import teacherImage4 from "@/assets/images/teacher/teacher__4.png";
import teacherImage5 from "@/assets/images/teacher/teacher__5.png";
import Preloader from "@/components/shared/others/Preloader";
import { useRouter } from "next/navigation";

const PopularInstructors = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  const [courses, setCourses] = useState([]);
  
  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (data) => {
          if (Array.isArray(data)) {
            const formattedCourses = data.map((course, index) => ({
              id: course._id,
              name: course.course_title,
              description: course.course_description,
              avatar: [
                teacherImage1,
                teacherImage2,
                teacherImage3,
                teacherImage4,
                teacherImage5,
              ][index % 5],
              reviews: `${Math.floor(Math.random() * 1000 + 100)} reviews`,
              students: `${Math.floor(Math.random() * 500 + 50)} students`,
              sessions: `${course.no_of_Sessions} sessions`,
            }));

            const latestCourses = formattedCourses.slice(0, 10);
            setCourses(latestCourses);
          }
        },
      });
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-10px md:px-10 font-Poppins md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-[18px] font-semibold text-black dark:text-white">
          Recent Course
        </h2>
        <div>
          <h3
            onClick={() => {
              router.push("/dashboards/admin-listofcourse");
            }}
            className="cursor-pointer text-xl md:text-[16px] font-normal text-gray-800 dark:text-white"
          >
            See More...
          </h3>
        </div>
      </div>
      <div className="w-full border-t-2 border-gray-200 mb-4"></div>
      {/* Instructor List */}
      <ul>
        {loading ? (
          <p>
            <Preloader />
          </p>
        ) : (
          courses.map(
            ({ name, description, avatar, students, sessions }, idx) => (
              <li
                key={idx}
                className={`flex items-center flex-wrap ${
                  idx === courses.length - 1
                    ? "pt-15px"
                    : "py-15px border-b border-borderColor dark:border-borderColor-dark"
                }`}
              >
                {/* Avatar */}
                <div className="max-w-full md:max-w-1/5 pr-10px">
                  <Image
                    src={avatar}
                    alt={name}
                    className="w-full rounded-full"
                  />
                </div>
                {/* Details */}
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
                        {students}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-darkblack dark:text-darkblack-dark gap-x-4 leading-1.8">
                      <p className="flex items-center gap-x-1">
                        <i className="icofont-video-alt"></i>
                        {sessions}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          )
        )}
      </ul>
    </div>
  );
};

export default PopularInstructors;
