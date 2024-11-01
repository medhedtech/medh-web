"use client";
import Image from "next/image";
import React from "react";

const CourseCard = ({ title, instructor, rating, reviews, image }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      {/* <img src={image} alt={title} className="w-full h-40 object-cover" /> */}
      <Image src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-sm text-[#282F3E] ">{title}</h3>
        <p className="text-xs text-[#585D69]">{instructor}</p>
        <div className="flex items-center mt-2 justify-between">
          <div className="flex ">
            <span className="text-[#888C94] text-size-11 my-auto">
              {rating}
            </span>
            <span className="text-yellow-500"> ⭐⭐⭐⭐</span>
          </div>
          <span className="text-[#888C94] text-size-11 ml-2 my-auto">
            ({reviews})
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
