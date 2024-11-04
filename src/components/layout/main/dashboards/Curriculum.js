"use client";
import React from "react";

const CurriculumSection = ({ title, duration, lessons }) => {
  return (
    <div className="mb-8 w-96">
      <div className="flex mt-6 justify-between mb-3">
        <h4 className="text-sm  font-semibold">
          Section 01 - <span className="text-primaryColor">{title}</span>
        </h4>
        <p className="text-sm text-primaryColor">{duration} Mins</p>
      </div>
      <ul>
        {lessons.map((lesson, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b border-gray-200 py-3 text-[#202244]"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 flex bg-slate-200 items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <div>
                <p className="text-base font-medium">{lesson.title}</p>
                <p className="text-gray-500 text-sm">{lesson.duration}</p>
              </div>
            </div>
            <div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.2 13.05V4.95L12.6 9L7.2 13.05ZM9 0C4.02705 0 0 4.02705 0 9C0 13.9729 4.02705 18 9 18C13.9729 18 18 13.9729 18 9C18 4.02705 13.9729 0 9 0Z"
                  fill="#7ECA9D"
                />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurriculumSection;
