import Image from "next/image";
import React from "react";
import Education from "@/assets/images/course-detailed/education.svg";
import Emi from "@/assets/images/course-detailed/emi-card.svg";
import Mode from "@/assets/images/course-detailed/mode.svg";
import Course from "@/assets/images/course-detailed/Course.svg";
import Session from "@/assets/images/course-detailed/session.svg";
import Classes from "@/assets/images/course-detailed/classes.svg";
import Projects from "@/assets/images/course-detailed/project.svg";
import Couresegray from "@/assets/images/course-detailed/course-gray.svg";
import Modegray from "@/assets/images/course-detailed/mode-gray.svg";
import Sessiongray from "@/assets/images/course-detailed/session-gray.svg";

// JSON data for course details
const courseDetails = [
  { label: "EMI Options", value: "Yes", icon: Emi },
  { label: "Certification", value: "Yes" }, // No icon here
  { label: "Mode", value: "Live Online", icon: Mode },
  { label: "Duration", value: "4 months / 16 weeks", icon: Course },
  { label: "Online Sessions", value: "32 (90-120 min each)", icon: Session },
  { label: "Efforts", value: "4-6 hours per week" }, // No icon here
  { label: "Classes", value: "Weekends / Weekdays", icon: Classes },
  { label: "Assignments", value: "Yes" }, // No icon here
  { label: "Quizzes", value: "Yes" }, // No icon here
  { label: "Projects", value: "No", icon: Projects },
];

// Simplified block details
const courseInfo = [
  {
    label: "DURATION",
    value: "4 months / 16 weeks",
    icon: Couresegray
  },
  {
    label: "ONLINE SESSIONS",
    value: "32 (90-120 min each)",
    icon: Modegray
  },
  {
    label: "MODE",
    value: "Live Online",
    icon: Sessiongray
  }
];

function CourseEducation() {
  return (
    <div className="flex flex-wrap justify-between bg-white w-full lg:space-x-8">
      {/* Left Section */}
      <div className="lg:w-[60%] w-full md:px-4 ">
        <div className="relative lg:bottom-12 bottom-5">
          <Image
            src={Education}
            alt="Education"
            width={730}
            height={400}
            className="rounded-md"
          />
        </div>
        <div className="lg:ml-[11%] px-5 lg:p-0 lg:mt-10 mt-6">
          <h1 className="lg:text-3xl text-[22px] font-bold text-[#5C6574] mb-2 lg:w-[70%] w-full">
            Digital Marketing with Data Analytics Foundation Certificate
          </h1>
          <div className="flex space-x-8 lg:text-sm text-[12px] text-gray-500 mb-4 lg:space-x-12">
            {courseInfo.map((info, index) => (
              <div key={index} className="flex space-x-8 lg:space-x-12">
                <div className="flex justify-center items-center">
                  <Image src={info.icon} width={20} alt={info.label} />
                  <div className="lg:ml-4 ml-2">
                    <h4 className="font-semibold text-primaryColor">
                      {info.label}
                    </h4>
                    <p>{info.value}</p>
                  </div>
                </div>
                {index !== courseInfo.length - 1 && (
                  <span className="border-r-2 lg:pr-16 pr-8"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-[35%] w-full flex justify-center items-center flex-col lg:mr-6 mt-10">
        <div className="bg-gray-50 lg:w-[70%] w-full rounded-md shadow-sm border-2 border-gray-200  ">
          <div className="bg-[#F5F2FF] p-4 border-b-2 border-gray-200 md:px-4">
            <div className="flex justify-between items-center">
              <div className="mb-2">
                <p className="text-[1rem] font-normal font-Popins leading-6 text-[#41454F]">
                  4 Months Course
                </p>
                <h3 className="text-2xl font-bold text-[#5C6574]">
                  USD $595.00
                </h3>
              </div>
              <div className="text-right text-gray-500">
                <button className="text-[#F2277E]">Share</button>
              </div>
            </div>
            <div className="flex space-x-4 my-2 text-[15px]">
              <button className="bg-[#F2277E] text-white px-8 py-1 rounded-[30px] hover:bg-pink-600">
                BUY NOW
              </button>
              <button className="bg-gray-200 text-gray-700 px-9 py-1 rounded-[30px] hover:bg-gray-300">
                WISHLIST
              </button>
            </div>
            <p className="text-gray-500">Enrollment validity: Lifetime</p>
          </div>

          {/* Dynamically Render Course Details */}
          <div className="text-sm px-4 md:px-8">
            {courseDetails.map((detail, index) => (
              <div
                key={index}
                className="flex justify-between my-[6px] pb-2 border-b border-dashed"
              >
                <div className="flex items-center">
                  <Image
                    src={detail.icon || ""}
                    width={24}
                    height={24}
                    alt={detail.label}
                  />
                  <span className="ml-2">{detail.label}:</span>
                </div>
                <div>
                  <span>{detail.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseEducation;
