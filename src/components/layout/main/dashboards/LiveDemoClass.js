import Image from "next/image";
import React from "react";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import Reactimg from "@/assets/images/courses/React.jpeg";

const liveClasses = [
  {
    id: 1,
    course_image: AiMl,
    meet_title: "AI & ML Masterclasses",
    instructor: "Sayef Mamud, PixelCo",
    date_time: "12-11-24, 12:00 PM",
    live: true,
  },
  {
    id: 2,
    course_image: Reactimg,
    meet_title: "React Masterclasses",
    instructor: "Sayef Mamud, PixelCo",
    date_time: "12-11-24, 12:00 PM",
    live: true,
  },
  {
    id: 3,
    course_image: Reactimg,
    meet_title: "React Masterclasses",
    instructor: "Sayef Mamud, PixelCo",
    date_time: "12-11-24, 12:00 PM",
    live: true,
  },
  {
    id: 4,
    course_image: AiMl,
    meet_title: "AI & ML Masterclasses",
    instructor: "Sayef Mamud, PixelCo",
    date_time: "12-11-24, 12:00 PM",
    live: true,
  },
];

const LiveDemoClass = () => {
  return (
    <div className="px-10 pb-12">
      <div className="flex justify-between items-center pt-4 mb-4">
        <h2 className="text-2xl font-Open font-semibold dark:text-white text-gray-900">
          Start/Join the Live Demo Class
        </h2>
        <a href="#" className="text-green-500 hover:underline">
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:bg-inherit shadow rounded-lg border p-4 relative"
          >
            {/* Display "Live" Badge */}
            {classItem.live && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Live
              </div>
            )}
            {/* Course Image */}
            <div className="rounded overflow-hidden">
              <Image
                src={classItem.course_image}
                alt={classItem.meet_title || "Class Image"}
                className="w-full h-40 object-cover rounded"
                width={300}
                height={150}
              />
            </div>
            {/* Class Information */}
            <h3 className="mt-3 font-semibold text-gray-800  dark:text-white text-lg">
              {classItem.meet_title || "Untitled Class"}
            </h3>
            <p className="text-gray-600 text-sm">
              {classItem.instructor || "Instructor not specified"}
            </p>
            <p className="text-gray-500 text-sm">
              Date & Time: {classItem.date_time || "Not specified"}
            </p>
            {/* Join Button */}
            <button
              className="mt-4 px-4 py-1 bg-[#7ECA9D]  text-white font-semibold rounded-full hover:bg-green-600 transition"
              //   onClick={() => alert(`Joining ${classItem.meet_title}`)}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDemoClass;
