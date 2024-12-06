import React from "react";
import CourseCard from "./CourseCard";
import progress1 from "@/assets/images/dashbord/progress1.png";
import progress2 from "@/assets/images/dashbord/progress2.png";

const ProgressOverview = () => {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      instructor: "John Doe",
      progress: 40,
      image: progress1,
    },
    {
      id: 2,
      title: "Java Full Stack",
      instructor: "John Doe",
      progress: 70,
      image: progress2,
    },
  ];

  return (
    <div className="w-full py-6 px-10">
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-size-32 font-Open dark:text-white">
          Progress Overview
        </h2>
        <a
          href="/dashboards/student-progress-overview"
          className="text-green-500 hover:underline"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div> */}
    </div>
  );
};

export default ProgressOverview;
