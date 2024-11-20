// components/ClassCard.js
import React from "react";
import Image from "next/image";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";

const ClassCard = ({
  title,
  instructor,
  dateTime,
  isLive,
  image,
  courseId,
}) => {
  const { postQuery } = usePostQuery();

  const handleEnrollCourse = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        toast.error("Please log in to join classes.");
        return;
      }
      await postQuery({
        url: apiUrls?.EnrollCourse?.enrollCourse,
        postData: {
          student_id: studentId,
          course_id: courseId,
        },
        onSuccess: () => {
          toast.success("Hurray ! You are enrolled successfully.");
        },
        onFail: () => {
          toast.error("Error enrolling in the course. Please try again.");
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative">
      {isLive && (
        <div className="flex items-center space-x-1 absolute top-3 left-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000]"></div>
          <span className="text-size-11  text-[#888C94]">Live</span>
        </div>
      )}
      <div className="max-w-xs rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
        <div className="w-full h-48 p-0.5">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-Open text-[#282F3E]">{title}</h3>
          <p className="text-xs text-[#585D69]">{instructor}</p>
          <p className="text-xs text-[#888C94] mt-2">{dateTime}</p>
          <button
            onClick={handleEnrollCourse}
            className="mt-4 w-fit px-4 bg-primaryColor text-white font-semibold rounded-xl hover:bg-green-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
