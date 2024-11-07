"use client";
import Image from "next/image";
import React from "react";

const CourseGridItem = ({ image, title, instructor, rating }) => (
  <div className="p-2 rounded-lg shadow-sm border border-[#ECECEC]">
    <Image
      src={image}
      alt={title}
      className="w-full h-36 object-cover rounded"
    />
    <h4 className="mt-2 text-[#282F3E] text-sm ">{title}</h4>
    <p className="text-xs text-[#585D69]">{instructor}</p>
    <div className="flex items-center gap-2 mt-1 text-yellow-500">
      <span className="text-[#888C94] text-size-11">{rating} ★</span>
      <span className="text-size-11 text-[#888C94]">(4051)</span>
    </div>
  </div>
);

export default CourseGridItem;
