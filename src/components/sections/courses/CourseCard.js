// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import DownloadBrochureModal from "@/components/shared/download-broucher";
// import { useState } from "react";
// import image6 from "@/assets/images/courses/image6.png";

// const CourseCard = ({ course }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const router = useRouter();

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <div className="bg-white dark:bg-screen-dark flex flex-col justify-between shadow-md  dark:border-whitegrey border">
//       <div className="relative w-full h-[200px] overflow-hidden">
//         <Image
//           src={course?.course_image || image6}
//           alt={course?.course_title}
//           layout="fill"
//           objectFit="cover"
//           className="rounded-md"
//         />
//       </div>
//       <div className="text-center py-3">
//         <h3 className="dark:text-gray300">{course?.course_category}</h3>
//         <h3 className="font-bold text-[#5C6574] dark:text-gray300 text-lg ">
//           {course?.course_title}
//         </h3>
//         <p className="text-gray-500 dark:text-gray-300">
//           {course?.course_duration || course?.course_category} course
//         </p>
//       </div>
//       <div className="flex  mt-2 ">
//         <button
//           onClick={openModal}
//           className="bg-[#7ECA9D] text-sm text-white px-4 w-1/2 leading-none py-3.5"
//         >
//           Download Brochure
//         </button>
//         <button
//           onClick={() => router.push(`/course-detailed/${course?._id}`)}
//           className="bg-[#F6B335] text-sm text-white px-4 w-1/2 leading-none py-3.5"
//         >
//           Program Details
//         </button>
//       </div>
//       <DownloadBrochureModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         courseTitle={course?.course_title}
//       />
//     </div>
//   );
// };

// export default CourseCard;
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import image6 from "@/assets/images/courses/image6.png";
import Emi from "@/assets/images/course-detailed/emi-card.svg";
import Cer from "@/assets/images/course-detailed/certificate.png";
import Efforts from "@/assets/images/course-detailed/efforts.png";
import Assignments from "@/assets/images/course-detailed/assignment.png";
import Quizzes from "@/assets/images/course-detailed/quizzes.png";
import Mode from "@/assets/images/course-detailed/mode.svg";
import Course from "@/assets/images/course-detailed/course.svg";
import Session from "@/assets/images/course-detailed/session.svg";
import Classes from "@/assets/images/course-detailed/classes.svg";
import Projects from "@/assets/images/course-detailed/project.svg";

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [courseDetails1, setCourseDetails1] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const router = useRouter();

  // Fetch course details when the component mounts
  useEffect(() => {
    if (course?._id) {
      fetchCourseDetails(course._id);
    }
  }, [course?._id]);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => setCourseDetails1(data),
        onFail: (err) => console.error("Error fetching course details:", err),
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // JSON data for course details
  const courseDetails = [
    { label: "EMI Options", value: "Yes", icon: Emi },
    {
      label: "Certification",
      value: courseDetails1?.is_Certification || "N/A",
      icon: Cer,
    },
    {
      label: "Mode",
      value: courseDetails1?.course_category || "Live Online",
      icon: Mode,
    },
    {
      label: "Duration",
      value: courseDetails1?.course_duration || "4 months / 16 weeks",
      icon: Course,
    },
    {
      label: "Online Sessions",
      value: courseDetails1?.no_of_Sessions || "10",
      icon: Session,
    },
    {
      label: "Efforts",
      value: courseDetails1?.efforts_per_Week
        ? `${courseDetails1.efforts_per_Week} hours / week`
        : "4-6 hours per week",
      icon: Efforts,
    },
    {
      label: "Classes",
      value: courseDetails1?.class_type || "Weekends / Weekdays",
      icon: Classes,
    },
    {
      label: "Assignments",
      value: courseDetails1?.is_Assignments || "N/A",
      icon: Assignments,
    },
    {
      label: "Quizzes",
      value: courseDetails1?.is_Quizes || "N/A",
      icon: Quizzes,
    },
    {
      label: "Projects",
      value: courseDetails1?.is_Projects || "N/A",
      icon: Projects,
    },
  ];

  return (
    <div
      className={`relative bg-white dark:bg-screen-dark flex flex-col justify-between shadow-md dark:border-whitegrey border p-2 transition-transform duration-300 ease-in-out z-10 ${
        isHovered ? "transform scale-105 z-50 shadow-xl" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={course?.course_image || image6}
          alt={course?.course_title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      {/* Hover popup displayed to the right */}
      <div
        className={`absolute top-0 left-[20%] ml-4 bg-white shadow-lg border border-gray-300 px-4 py-2 w-[100%] max-w-[250px] z-50 ${
          isHovered ? "" : "hidden"
        }`}
      >
        {courseDetails.map((detail, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-1 pb-0 z-50"
          >
            <div className="flex items-center">
              {detail.icon && React.isValidElement(detail.icon) ? (
                <detail.icon size={24} className="text-primaryColor" />
              ) : (
                <Image
                  src={detail.icon}
                  width={24}
                  height={24}
                  alt={detail.label}
                />
              )}
              <span className="ml-2 text-[10px]">{detail.label}:</span>
            </div>
            <div>
              <span className=" text-[10px]">{detail.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-3">
        <h3 className="dark:text-gray300">{course?.course_category}</h3>
        <h3 className="font-bold text-[#5C6574] dark:text-gray300 text-lg">
          {course?.course_title}
        </h3>
        <p className="text-gray-500 dark:text-gray-300">
          {course?.course_duration || course?.course_category} course
        </p>
      </div>

      <div className="flex mt-2">
        <button
          onClick={openModal}
          className="bg-[#7ECA9D] text-sm text-white px-4 w-1/2 leading-none py-3.5"
        >
          Download Brochure
        </button>
        <button
          onClick={() => router.push(`/course-detailed/${course?._id}`)}
          className="bg-[#F6B335] text-sm text-white px-4 w-1/2 leading-none py-3.5"
        >
          Program Details
        </button>
      </div>
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={course?.course_title}
      />
    </div>
  );
};

export default CourseCard;
