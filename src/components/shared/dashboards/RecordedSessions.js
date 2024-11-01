"use client";
import React from "react";
import RecordedSessionCard from "./RecordedSessionCard";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import reactImg from "@/assets/images/courses/React.jpeg";
import os from "@/assets/images/courses/os.jpeg";
import javascript from "@/assets/images/courses/JavaScript.jpeg";

const RecordedSessions = () => {
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

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl  mb-4">Access Recorded Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessions.map((session) => (
          <RecordedSessionCard key={session.id} {...session} />
        ))}
      </div>
    </div>
  );
};

export default RecordedSessions;
