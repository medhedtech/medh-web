"use client";
import Image from "next/image";
import React from "react";

const RecordedSessionCard = ({ title, instructor, date, image }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div className="relative">
        {/* <img src={image} alt={title} className="w-full h-40 object-cover" /> */}
        <Image src={image} alt={title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white text-2xl">▶</span> {/* Play icon */}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm text-[#282F3E] ">{title}</h3>
        <p className="text-xs text-[#585D69]">{instructor}</p>
        <p className="text-size-11 text-primaryColor mt-2">
          Recorded Date: {date}
        </p>
      </div>
    </div>
  );
};

export default RecordedSessionCard;
