"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import { useState } from "react";
import image6 from "@/assets/images/courses/image6.png";

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white dark:bg-screen-dark flex flex-col justify-between shadow-md  dark:border-whitegrey border">
      <Image
        src={image6}
        alt={course?.course_title}
        className="rounded-md w-full"
        width={300}
        height={200}
      />
      <div className="text-center py-3">
        <h3 className="dark:text-gray300">{course?.course_title}</h3>
        <h3 className="font-bold text-[#5C6574] dark:text-gray300 text-lg ">
          {course?.course_category}
        </h3>
        <h3 className="font-semibold text-md dark:text-gray300">
          {course?.course_fee}
        </h3>
        <p className="text-gray-500 dark:text-gray-300">
          {course?.course_duration}
        </p>
      </div>
      <div className="flex  mt-2 ">
        <button
          onClick={openModal}
          className="bg-[#7ECA9D] text-sm text-white px-4 w-1/2 leading-none py-3.5"
        >
          Download Brochure
        </button>
        <button
          onClick={() => router.push(`/courses/${course._id}`)}
          className="bg-[#F6B335] text-sm text-white px-4 w-1/2 leading-none py-3.5"
        >
          Program Details
        </button>
      </div>
      <DownloadBrochureModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CourseCard;
