"use client";
import Image from "next/image";
import React from "react";

const CourseListItem = ({
  image,
  title,
  description,
  instructor,
  rating,
  duration,
}) => (
  <div className="flex gap-4 p-2.5 border rounded border-gray-200 font-Open">
    <Image src={image} alt={title} className="w-52 h-36 rounded object-cover" />
    <div className="flex-1">
      <h3 className="text-base text-[#282F3E]">{title}</h3>
      <p className="text-size-11 text-[#585D69]">{description}</p>
      <p className="text-size-11 text-[#585D69]">{instructor}</p>
      <div className="flex items-center gap-2 mt-2 text-yellow-500">
        <span className="text-sm">{rating}.0 ★★★★</span>
        <span className="text-size-11 text-[#585D69]">(4051)</span>
      </div>
      <p className="text-size-11 text-[#585D69]">{duration}</p>
    </div>
    <button className="text-primaryColor text-sm hover:underline">
      More Info
    </button>
  </div>
);

export default CourseListItem;
