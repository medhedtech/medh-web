import React from "react";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";

const Coorporate_EnrollCoursesCard = ({
  title,
  instructor,
  image,
  totalEnrolled,
  onClick,
}) => {
  const displayImage = image || AiMl;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Left-Side Image */}
      <div className="w-1/3">
        <Image
          src={displayImage}
          alt={title}
          height={200} // adjust height as needed
          width={200} // adjust width as needed
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>

      {/* Right-Side Content */}
      <div className="w-2/3 flex flex-col justify-between p-4">
        {/* Heading and Instructor */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{instructor}</p>
        </div>

        {/* Total Enrollment */}
        <div className="text-right mt-2">
          <p className="text-xs font-medium text-gray-500">
            Total Enrolled: <span className="font-semibold">{totalEnrolled}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coorporate_EnrollCoursesCard;