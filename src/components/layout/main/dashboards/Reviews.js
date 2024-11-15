"use client";
import StarIcon from "@/assets/images/icon/StarIcon";
import Image from "next/image";
import React from "react";

const Review = ({ reviewer, rating, comment, likes, date, avtar }) => {
  return (
    <div className="flex space-x-4 border-b py-4 ">
      <div className="bg-slate-300 rounded-full w-10 h-10">
        <Image src={avtar} alt="pic" className="w-10 h-10 rounded-full" />
      </div>

      <div>
        <div className="flex justify-between">
          <h4 className="text-sm font-semibold">{reviewer}</h4>
          <span className="text-yellow-500 text-sm bg-[#E0FFED] rounded-xl px-2 flex gap-0.5">
            <span className="my-auto">
              <StarIcon />
            </span>{" "}
            {rating}
          </span>
        </div>
        <p className="text-xs text-[#545454] mb-4 w-[80%]">{comment}</p>
        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
          <span>❤️ {likes}</span> <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default Review;
