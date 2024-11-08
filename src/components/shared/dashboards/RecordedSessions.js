"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/JavaScript.jpeg";

const RecordedSessions = () => {
  const router = useRouter();

  const sessions = [
    {
      id: 1,
      title: "AI & ML Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: AiMl,
    },
    {
      id: 2,
      title: "React Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: reactImg,
    },
    {
      id: 3,
      title: "OS Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: os,
    },
    {
      id: 4,
      title: "JavaScript Masterclasses",
      instructor: "Sayef Mamud, PixelCo",
      date: "21th October 2024",
      image: javascript,
    },
  ];

  const handleCardClick = (id) => {
    router.push(`/dashboards/my-courses/${id}`);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between font-normal font-Open  pb-4 ">
        <h2 className="text-size-32 font-Open">Access Recorded Sessions</h2>
        <a
          href="#"
          className="text-green-500 text-sm font-semibold hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleCardClick(session.id)}
            className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
          >
            <div className="relative">
              <Image
                src={session.image}
                alt={session.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white text-2xl">▶</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm text-[#282F3E]">{session.title}</h3>
              <p className="text-xs text-[#585D69]">{session.instructor}</p>
              <p className="text-size-11 text-primaryColor mt-2">
                Recorded Date: {session.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordedSessions;
