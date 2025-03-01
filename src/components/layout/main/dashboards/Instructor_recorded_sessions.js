import Image from "next/image";
import React from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Reactimg from "@/assets/images/courses/React.jpeg";
import Os from "@/assets/images/courses/os.jpeg";
import JavaScript from "@/assets/images/courses/javaScript.jpeg";

const classes = [
  {
    id: 1,
    course_image: AiMl,
    meet_title: "AI & ML Masterclasses",
    date: "21th October 2024",
    instructor: "Sayef Mamud, PixelCo",
  },
  {
    id: 2,
    course_image: Reactimg,
    meet_title: "React Masterclasses",
    date: "21th October 2024",
    instructor: "Sayef Mamud, PixelCo",
  },
  {
    id: 3,
    course_image: Os,
    meet_title: "OS Masterclasses",
    date: "21th October 2024",
    instructor: "Sayef Mamud, PixelCo",
  },
  {
    id: 4,
    course_image: JavaScript,
    meet_title: "JavaScript Masterclasses",
    date: "21th October 2024",
    instructor: "Sayef Mamud, PixelCo",
  },
];
const Instructor_Recorded_Sessions = () => {
  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center  pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          Recorded Sessions
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:border dark:text-white dark:bg-inherit shadow rounded-lg p-4"
          >
            <div className="rounded overflow-hidden">
              <Image
                src={classItem.course_image}
                alt={classItem.meet_title}
                className="w-full h-40 object-cover"
                width={300}
                height={150}
              />
            </div>
            <h3 className="mt-2 font-semibold dark:text-white text-gray-800">
              {classItem.meet_title}
            </h3>
            <p className="text-[#585D69] text-xs">{classItem.instructor}</p>
            <p className="text-[#7ECA9D] text-sm mt-1.5">
              Date: {classItem.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructor_Recorded_Sessions;
