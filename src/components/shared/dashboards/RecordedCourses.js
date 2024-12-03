"use client";
import Image from "next/image";
import React from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";

const RecordedCard = ({
  course_title,
  course_tag,
  rating,
  course_image,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-inherit shadow-sm rounded-lg overflow-hidden border border-gray-200"
    >
      <Image
        src={course_image || AiMl}
        alt={course_title}
        width={200}
        height={160}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 ">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-[#282F3E] dark:text-white">
            {course_title}
          </h3>
        </div>
        <p className="text-xs text-[#585D69]">{course_tag}</p>
        <div className="flex items-center mt-2 justify-between">
          <div className="flex ">
            <span className="text-[#888C94] text-size-11 my-auto">
              {rating}
            </span>
            <span className="text-yellow-500"> ⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedCard;
