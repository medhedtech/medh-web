import Image from "next/image";
import React from "react";

const CourseCard = ({ title, instructor, progress, image }) => {
  return (
    <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 border border-gray-200">
      {/* Left Section - Text Content */}
      <div className="w-full md:w-2/3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">Instructor: {instructor}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{progress}%</p>

        {/* Continue Learning Button */}
        <button className="mt-2 px-4 py-2 bg-white text-green-500 border border-green-500 rounded-full hover:bg-green-500 hover:text-white transition">
          Continue Learning
        </button>
      </div>

      {/* Right Section - Image */}
      <div className="w-24 md:w-32 flex-shrink-0 ml-4">
        {/* <img
          src={image}
          alt="Course illustration"
          className="w-full h-full object-cover rounded-lg"
        /> */}
        <Image
          src={image}
          alt="Course illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default CourseCard;
