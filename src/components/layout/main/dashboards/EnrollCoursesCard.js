import React from "react";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";

const EnrollCoursesCard = ({ title, image, isLive, progress, onClick }) => {
  const displayImage = image || AiMl
  return (
    <div
      onClick={onClick}
      className="cursor-pointer relative max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-white dark:bg-inherit"
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          <span className="text-xs font-semibold text-red-500">Live</span>
        </div>
      )}
      {/* Course Image */}
      <div className="w-full h-48">
        <Image
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      {/* Course Content */}
      <div className="p-4">
        <h3 className="text-size-15 text-[#282F3E] dark:text-white">{title}</h3>
        {/* Progress Bar */}
        <div className="mt-2 flex items-center justify-between">
          <div className="w-[30%] h-1 flex bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-1 bg-green-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <span className="ml-0 text-xs text-gray-500">{progress}%</span>
          <div className="mt-1 text-size-10 w-fit  font-semibold text-primaryColor cursor-pointer hover:underline">
            Continue Learning
          </div>
        </div>
        {/* Continue Learning */}
      </div>
    </div>
  );
};

export default EnrollCoursesCard;
