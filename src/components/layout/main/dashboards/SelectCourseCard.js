import React from 'react';
import { Users, Clock } from 'lucide-react';
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Image from 'next/image';

export default function CourseCard({ course, isSelected, onClick }) {
  const imgSrc = course?.course_image || AiMl;
  return (
    <div
      onClick={onClick}
      className={`group p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-[#3B82F6] bg-[#EFF6FF] shadow-md'
          : 'border-gray-200 hover:border-[#93C5FD] hover:shadow-lg'
      }`}
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={course.course_title}
            className="w-full h-full object-cover rounded-lg"
            width={128}
            height={128}
          />
          <div
            className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
              isSelected
                ? 'bg-[#3B82F6] opacity-20'
                : 'opacity-0 group-hover:opacity-10 bg-black'
            }`}
          ></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900">{course.course_title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.course_category === 'Live Courses'
                  ? 'bg-green-100 text-green-700'
                  : course.course_category === 'Blended Courses'
                  ? 'bg-[#FDF4D0] text-[#F59E0B]'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {course.course_category}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{course.course_description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.session_duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              437 students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
