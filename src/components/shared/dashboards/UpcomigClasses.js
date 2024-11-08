import React from "react";
import ClassCard from "./ClassCard";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import reactImg from "@/assets/images/courses/React.jpeg";

const UpcomigClasses = () => {
  const classes = [
    {
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: AiMl,
    },
    {
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: reactImg,
    },
    {
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: reactImg,
    },
    {
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      dateTime: "12-11-24, 12:00 PM",
      isLive: true,
      image: AiMl,
    },
  ];
  return (
    <div className="px-10 pb-12">
      <h2 className="text-size-32  text-start mb-4">Upcoming Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
        {classes.map((classItem, index) => (
          <ClassCard
            key={index}
            title={classItem.title}
            instructor={classItem.instructor}
            dateTime={classItem.dateTime}
            isLive={classItem.isLive}
            image={classItem.image}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomigClasses;
