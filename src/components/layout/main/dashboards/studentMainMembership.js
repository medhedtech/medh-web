"use client";
import React from "react";
import Image from "next/image";
import ClockLogo from "@/assets/images/student-dashboard/clock.svg";
import VideoClass from "@/assets/images/student-dashboard/video-class.svg";
import FallBackUrl from "@/assets/images/courses/image1.png";

const StudentMainMembership = ({ membership }) => (
  <>
    {membership.courses?.map((course) => (
      <div
        key={course.course_id || `${membership._id}-${course.course_title}`} // Use a unique course id or combination
        className="flex items-center dark:border shadow-student-dashboard p-5 rounded-lg overflow-hidden hover:scale-105 transform transition-transform duration-300"
      >
        <div className="relative h-40 w-[40%]">
          <Image
            src={course.course_image || FallBackUrl}
            alt={course.course_title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>

        {/* Course Info Section */}
        <div className="px-4 w-[60%] font-Open">
          <span className="text-orange-500 text-xs font-bold text-[#FFA927]">
            {membership.category_type === "Live Courses"
              ? "Certificate"
              : "Diploma"}
          </span>
          <h3 className="text-xl font-semibold dark:text-white text-[#202244] mt-2">
            {course.course_title}
          </h3>
          <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-2">
            <Image
              src={VideoClass}
              alt="Classes Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            {course.no_of_Sessions} Sessions
          </div>
          <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-1">
            <Image
              src={ClockLogo}
              alt="Clock Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            {course.course_duration} | {course.session_duration}
          </div>
          <p className="text-[#7ECA9D] font-bold text-xs mt-4">
            Membership Name:{" "}
            {membership.membership_type.charAt(0).toUpperCase() +
              membership.membership_type.slice(1).toLowerCase()}
          </p>
        </div>
      </div>
    ))}
  </>
);

export default StudentMainMembership;
