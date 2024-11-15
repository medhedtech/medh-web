"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

const CourseCard = ({ course }) => {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-screen-dark flex flex-col justify-between shadow-md  dark:border-whitegrey border">
      <Image
        src={course.image}
        alt={course.title}
        className="rounded-md w-full"
        width={300}
        height={200}
      />
      <div className="text-center py-3">
        <h3 className="dark:text-gray300">{course.title}</h3>
        <h3 className="font-bold text-[#5C6574] dark:text-gray300 text-lg ">
          {course.label}
        </h3>
        <h3 className="font-semibold text-md dark:text-gray300">
          {course.grade}
        </h3>
        <p className="text-gray-500 dark:text-gray-300">{course.duration}</p>
      </div>
      <div className="flex  mt-2 ">
        <button className="bg-[#7ECA9D] text-sm text-white px-4 w-1/2 leading-none py-3.5">
          Download Brochure
        </button>
        <button
          onClick={() => router.push(`/courses/${course.id}`)}
          className="bg-[#F6B335] text-sm text-white px-4 w-1/2 leading-none py-3.5"
        >
          Program Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
